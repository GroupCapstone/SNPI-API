import fs from 'node:fs';
import path from 'node:path';

import request from 'supertest';
import ts from 'typescript';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { ALL_PERMISSION_CODES } from '../src/constants/permissions';
import { AuthService } from '../src/modules/auth/auth.service';
import { RoleModel } from '../src/modules/role/role.model';
import { UserModel } from '../src/modules/user/user.model';
import { TokenUtil } from '../src/utils/token';
import { TEST_PASSWORD } from './fixtures/test-credentials';

// Exercise production authentication behavior: test impersonation headers must
// never supply authority to this HTTP matrix.
vi.mock('../src/config/env', async (importOriginal) => {
  type EnvShape = { env: { NODE_ENV: string; [key: string]: unknown }; [key: string]: unknown };
  const actual = (await importOriginal()) as EnvShape;
  return { ...actual, env: { ...actual.env, NODE_ENV: 'development' } };
});
vi.mock('../src/modules/user/user.model', () => ({ UserModel: { findOne: vi.fn() } }));
vi.mock('../src/modules/role/role.model', () => ({ RoleModel: { find: vi.fn() } }));

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';
interface Endpoint {
  method: Method;
  url: string;
  permissions: string[];
}

const source = (file: string) =>
  ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
const appSource = source(path.resolve('src/app.ts'));
const routeImports = new Map<string, string>();
appSource.forEachChild((node) => {
  if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
  if (!node.moduleSpecifier.text.endsWith('.route')) return;
  const bindings = node.importClause?.namedBindings;
  if (!bindings || !ts.isNamedImports(bindings)) return;
  for (const binding of bindings.elements) {
    routeImports.set(binding.name.text, path.resolve('src', `${node.moduleSpecifier.text}.ts`));
  }
});

const endpoints: Endpoint[] = [];
const visitMount = (node: ts.Node) => {
  if (ts.isCallExpression(node) && node.expression.getText(appSource) === 'app.use') {
    const [mount, router] = node.arguments;
    const file = router && routeImports.get(router.getText(appSource));
    if (mount && ts.isStringLiteral(mount) && file) {
      const tree = source(file);
      const permissionArrays = new Map<string, string[]>();
      const collectConstants = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node) && node.initializer) {
          const initializer = ts.isAsExpression(node.initializer)
            ? node.initializer.expression
            : node.initializer;
          if (ts.isArrayLiteralExpression(initializer)) {
            permissionArrays.set(
              node.name.getText(tree),
              initializer.elements.filter(ts.isStringLiteral).map((element) => element.text),
            );
          }
        }
        ts.forEachChild(node, collectConstants);
      };
      collectConstants(tree);
      const visitRoute = (route: ts.Node) => {
        if (ts.isCallExpression(route) && ts.isPropertyAccessExpression(route.expression)) {
          const method = route.expression.name.text as Method;
          const [url, ...handlers] = route.arguments;
          if (
            ['get', 'post', 'patch', 'put', 'delete'].includes(method) &&
            url &&
            ts.isStringLiteral(url)
          ) {
            const permissions = handlers.flatMap((handler) =>
              ts.isCallExpression(handler) &&
              ['authorize', 'requirePermission'].includes(handler.expression.getText(tree))
                ? handler.arguments.flatMap((argument) =>
                    ts.isStringLiteral(argument)
                      ? [argument.text]
                      : ts.isSpreadElement(argument)
                        ? (permissionArrays.get(argument.expression.getText(tree)) ?? [])
                        : [],
                  )
                : [],
            );
            endpoints.push({
              method,
              url: mount.text + (url.text === '/' ? '' : url.text),
              permissions,
            });
          }
        }
        ts.forEachChild(route, visitRoute);
      };
      visitRoute(tree);
    }
  }
  ts.forEachChild(node, visitMount);
};
visitMount(appSource);

const publicEndpoints = new Set([
  'get /api/v1/health',
  'get /api/v1/health/liveness',
  'get /api/v1/health/readiness',
  'post /api/v1/auth/login',
  'post /api/v1/auth/refresh',
  'get /api/v1/reports/certificates/verify/:code',
]);
const sessionEndpoints = new Set([
  'post /api/v1/auth/logout',
  'get /api/v1/auth/me',
  'patch /api/v1/auth/change-password',
  'get /api/v1/dashboard/action-items',
]);
const protectedEndpoints = endpoints.filter(
  (endpoint) => !publicEndpoints.has(`${endpoint.method} ${endpoint.url}`),
);
const rbacEndpoints = protectedEndpoints.filter(
  (endpoint) => !sessionEndpoints.has(`${endpoint.method} ${endpoint.url}`),
);
const resourceUrl = (url: string) => url.replace(/:[A-Za-z]+/g, '507f1f77bcf86cd799439011');
const schoolId = '507f1f77bcf86cd799439001';
const userId = '507f1f77bcf86cd799439002';

describe('complete protected HTTP route inventory', () => {
  const app = createApp();
  const token = TokenUtil.generateAccessToken({
    userId,
    username: 'matrix',
    email: 'matrix@example.test',
    tokenVersion: 0,
  });
  const account = () => ({
    _id: userId,
    schoolId,
    username: 'matrix',
    email: 'matrix@example.test',
    roles: ['staff'],
    branchAccess: 'all',
    status: 'active',
    tokenVersion: 0,
    mustChangePassword: false,
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(UserModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(account()),
    } as never);
    vi.mocked(RoleModel.find).mockReturnValue({ exec: vi.fn().mockResolvedValue([]) } as never);
  });

  it('requires a catalogued permission guard for every non-public, non-session route', () => {
    expect(endpoints.length).toBeGreaterThan(260);
    const catalog = new Set(ALL_PERMISSION_CODES);
    for (const endpoint of rbacEndpoints) {
      expect(endpoint.permissions.length, `${endpoint.method} ${endpoint.url}`).toBeGreaterThan(0);
      for (const permission of endpoint.permissions) {
        expect(catalog.has(permission), `${endpoint.url}: ${permission}`).toBe(true);
      }
    }
  });

  it.each(protectedEndpoints)('rejects anonymous $method $url', async ({ method, url }) => {
    const requestForMethod = request(app)[method];
    const response = await requestForMethod(resourceUrl(url))
      .set('X-User-Id', userId)
      .set('X-User-Roles', 'super_admin')
      .set('X-User-Permissions', '*');
    expect(response.status).toBe(401);
  });

  it.each(rbacEndpoints)(
    'rejects a real session without permission: $method $url',
    async ({ method, url }) => {
      const requestForMethod = request(app)[method];
      const response = await requestForMethod(resourceUrl(url)).auth(token, { type: 'bearer' });
      expect(response.status).toBe(403);
    },
  );

  it.each(['inactive', 'suspended', 'locked'])(
    'rejects a %s account even with a valid token',
    async (status) => {
      vi.mocked(UserModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...account(), status }),
      } as never);
      expect((await request(app).get('/api/v1/users').auth(token, { type: 'bearer' })).status).toBe(
        401,
      );
    },
  );

  it('rejects expired, invalid, and revoked tokens', async () => {
    for (const invalid of [
      'invalid-token',
      TokenUtil.generateAccessToken({
        userId,
        username: 'matrix',
        email: 'matrix@example.test',
        tokenVersion: 1,
      }),
    ]) {
      expect(
        (await request(app).get('/api/v1/users').auth(invalid, { type: 'bearer' })).status,
      ).toBe(401);
    }
    vi.spyOn(TokenUtil, 'verifyAccessToken').mockImplementation(() => {
      throw new Error('jwt expired');
    });
    expect((await request(app).get('/api/v1/users').auth(token, { type: 'bearer' })).status).toBe(
      401,
    );
  });

  it.each(rbacEndpoints)(
    'blocks a temporary-password session: $method $url',
    async ({ method, url }) => {
      vi.mocked(UserModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...account(), mustChangePassword: true }),
      } as never);
      vi.mocked(RoleModel.find).mockReturnValue({
        exec: vi.fn().mockResolvedValue([{ code: 'super_admin', permissions: ['*'] }]),
      } as never);
      const requestForMethod = request(app)[method];
      const response = await requestForMethod(resourceUrl(url)).auth(token, { type: 'bearer' });
      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/change your temporary password/);
    },
  );

  it('keeps session inspection, password change and logout available during recovery', async () => {
    vi.mocked(UserModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ ...account(), mustChangePassword: true }),
    } as never);
    vi.spyOn(AuthService.prototype, 'getCurrentUser').mockResolvedValue({
      mustChangePassword: true,
    } as never);
    const changePassword = vi.spyOn(AuthService.prototype, 'changePassword').mockResolvedValue();
    const logout = vi.spyOn(AuthService.prototype, 'logout').mockResolvedValue();
    expect(
      (await request(app).get('/api/v1/auth/me/').auth(token, { type: 'bearer' })).status,
    ).toBe(200);
    const changed = await request(app)
      .patch('/api/v1/auth/change-password')
      .auth(token, { type: 'bearer' })
      .send({
        currentPassword: TEST_PASSWORD,
        newPassword: 'Changed@456',
        confirmPassword: 'Changed@456',
      });
    expect(changed.status).toBe(200);
    expect(changePassword).toHaveBeenCalled();
    expect(
      (await request(app).post('/api/v1/auth/logout').auth(token, { type: 'bearer' })).status,
    ).toBe(200);
    expect(logout).toHaveBeenCalled();
  });

  it('reads current persisted role permissions on every request', async () => {
    vi.spyOn(AuthService.prototype, 'getCurrentUser').mockResolvedValue({} as never);
    vi.mocked(RoleModel.find).mockReturnValue({
      exec: vi.fn().mockResolvedValue([{ code: 'staff', permissions: ['user.view.all_branches'] }]),
    } as never);
    const context = await new AuthService().buildAuthorizationContext(account() as never);
    expect(context.permissions).toContain('user.view.all_branches');
    vi.mocked(RoleModel.find).mockReturnValue({ exec: vi.fn().mockResolvedValue([]) } as never);
    expect((await request(app).get('/api/v1/users').auth(token, { type: 'bearer' })).status).toBe(
      403,
    );
    expect(RoleModel.find).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active', isDeleted: false }),
    );
  });
});
