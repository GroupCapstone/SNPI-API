import { createApp } from '../src/app';

interface RouteEntry {
  method: string;
  path: string;
  module: string;
}

function extractAllRoutes(): RouteEntry[] {
  const app: any = createApp();
  const routes: RouteEntry[] = [];

  function split(thing: any): string[] {
    if (typeof thing === 'string') {
      return thing.split('/');
    } else if (thing.fast_slash) {
      return [];
    } else {
      const match = thing
        .toString()
        .replace('/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:[/#?]?[\w.-]*)+)\$\//);
      return match ? match[1].replace(/\\(.)/g, '$1').split('/') : [];
    }
  }

  function handleLayer(layer: any, basePath: string) {
    if (layer.route) {
      const subPath = layer.route.path;
      const fullPath = (basePath + (subPath === '/' ? '' : subPath)).replace(/\/+/g, '/') || '/';
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());

      for (const method of methods) {
        const parts = fullPath.split('/').filter(Boolean);
        let domainModule = 'core';
        if (parts[0] === 'api' && parts[1] === 'v1' && parts[2]) {
          domainModule = parts[2];
        }
        routes.push({
          method,
          path: fullPath,
          module: domainModule,
        });
      }
    } else if (layer.name === 'router' && layer.handle.stack) {
      let segment = '';
      if (layer.regexp) {
        const s = split(layer.regexp).filter(Boolean).join('/');
        if (s) segment = '/' + s;
      }
      for (const subLayer of layer.handle.stack) {
        handleLayer(subLayer, basePath + segment);
      }
    }
  }

  for (const layer of app._router.stack) {
    handleLayer(layer, '');
  }

  return routes;
}

const allRoutes = extractAllRoutes();
// Deduplicate
const uniqueMap = new Map<string, RouteEntry>();
for (const r of allRoutes) {
  uniqueMap.set(`${r.method} ${r.path}`, r);
}

const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
  if (a.path === b.path) return a.method.localeCompare(b.method);
  return a.path.localeCompare(b.path);
});

console.log(`TOTAL UNIQUE ENDPOINTS REGISTERED: ${sorted.length}`);
console.log(JSON.stringify(sorted, null, 2));
