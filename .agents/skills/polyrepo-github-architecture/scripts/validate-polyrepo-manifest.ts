#!/usr/bin/env tsx
/**
 * Polyrepo Release Manifest Validator
 * Validates integration manifest schema, pinning policies, and component immutability.
 * Usage: npx tsx validate-polyrepo-manifest.ts [path/to/release.yaml]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface ManifestComponent {
  repo: string;
  ref: string;
  commitSha?: string;
  type?: string;
  artifact?: string;
  healthEndpoint?: string;
}

interface PolyrepoManifest {
  schemaVersion: string;
  systemRelease: string;
  channel?: 'development' | 'integration' | 'rc' | 'production';
  metadata?: {
    generatedAt?: string;
    changeSetId?: string;
    validatedBy?: string;
  };
  components: Record<string, ManifestComponent>;
}

export function parseSimpleYaml(content: string): PolyrepoManifest {
  // Simple deterministic YAML key-value parser for basic release manifests
  const manifest: PolyrepoManifest = {
    schemaVersion: '',
    systemRelease: '',
    components: {},
  };

  const lines = content.split('\n');
  let currentComponent: string | null = null;
  let inComponentsSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('schemaVersion:')) {
      manifest.schemaVersion = line.replace('schemaVersion:', '').replace(/['"]/g, '').trim();
      continue;
    }
    if (line.startsWith('systemRelease:')) {
      manifest.systemRelease = line.replace('systemRelease:', '').replace(/['"]/g, '').trim();
      continue;
    }
    if (line.startsWith('channel:')) {
      manifest.channel = line.replace('channel:', '').replace(/['"]/g, '').split('#')[0].trim() as any;
      continue;
    }
    if (!rawLine.startsWith(' ') && !rawLine.startsWith('\t')) {
      if (line.startsWith('components:')) {
        inComponentsSection = true;
        currentComponent = null;
      } else {
        inComponentsSection = false;
        currentComponent = null;
      }
      continue;
    }

    if (inComponentsSection) {
      if (/^  [a-zA-Z0-9_-]+:$/.test(rawLine)) {
        currentComponent = line.replace(':', '').trim();
        manifest.components[currentComponent] = { repo: '', ref: '' };
        continue;
      }

      if (currentComponent && manifest.components[currentComponent]) {
        if (line.startsWith('repo:')) {
          manifest.components[currentComponent].repo = line.replace('repo:', '').replace(/['"]/g, '').trim();
        } else if (line.startsWith('ref:')) {
          manifest.components[currentComponent].ref = line.replace('ref:', '').replace(/['"]/g, '').trim();
        } else if (line.startsWith('commitSha:')) {
          manifest.components[currentComponent].commitSha = line.replace('commitSha:', '').replace(/['"]/g, '').trim();
        }
      }
    }
  }

  return manifest;
}

export function validateManifest(manifest: PolyrepoManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!manifest.schemaVersion) {
    errors.push('Missing required field: schemaVersion');
  }
  if (!manifest.systemRelease) {
    errors.push('Missing required field: systemRelease');
  }

  const componentKeys = Object.keys(manifest.components);
  if (componentKeys.length === 0) {
    errors.push('Manifest contains zero components');
  }

  const seenRepos = new Set<string>();

  for (const [name, comp] of Object.entries(manifest.components)) {
    if (!comp.repo) {
      errors.push(`Component '${name}' missing required 'repo' field`);
    } else {
      if (seenRepos.has(comp.repo)) {
        errors.push(`Duplicate repository reference '${comp.repo}' in component '${name}'`);
      }
      seenRepos.add(comp.repo);
    }

    if (!comp.ref) {
      errors.push(`Component '${name}' missing required 'ref' field`);
    } else {
      // Floating ref detection policy: @main or master is forbidden in production/rc
      if (['main', 'master', 'head', 'latest'].includes(comp.ref.toLowerCase())) {
        if (manifest.channel === 'production' || manifest.channel === 'rc') {
          errors.push(
            `Component '${name}' uses forbidden floating ref '${comp.ref}' in '${manifest.channel}' channel. Must pin to tag or SHA.`,
          );
        }
      }
    }

    if (comp.commitSha && !/^[0-9a-fA-F]{40}$/.test(comp.commitSha)) {
      errors.push(`Component '${name}' has invalid 40-character commit SHA: '${comp.commitSha}'`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function run(): Promise<void> {
  const targetPath = process.argv[2] || path.join(__dirname, '../templates/release-manifest-template.yaml');

  if (!fs.existsSync(targetPath)) {
    console.error(`[ERROR] Manifest file not found: ${targetPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  const manifest = parseSimpleYaml(content);
  const result = validateManifest(manifest);

  console.log('------------------------------------------------------------');
  console.log(`Polyrepo Manifest Validation: ${targetPath}`);
  console.log(`System Release: ${manifest.systemRelease || 'UNKNOWN'}`);
  console.log(`Components: ${Object.keys(manifest.components).length}`);
  console.log('------------------------------------------------------------');

  if (result.valid) {
    console.log('[PASSED] Manifest meets all enterprise polyrepo pinning policies.');
    process.exit(0);
  } else {
    console.error('[FAILED] Manifest policy violations detected:');
    result.errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
}

if (require.main === module) {
  run().catch((err) => {
    console.error('[ERROR]', err);
    process.exit(1);
  });
}
