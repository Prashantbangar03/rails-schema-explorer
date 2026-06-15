import * as path from 'path';

export function isPathWithinRoots(fsPath: string, roots: readonly string[]): boolean {
  if (!fsPath || !path.isAbsolute(fsPath) || roots.length === 0) {
    return false;
  }

  const normalized = path.normalize(fsPath);
  return roots.some((root) => {
    const base = path.normalize(root);
    const rel = path.relative(base, normalized);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  });
}

export function isModelFilePathNormalized(normalizedPath: string, inWorkspace: boolean): boolean {
  return (
    inWorkspace &&
    /\/app\/models\/[^/]+\.rb$/i.test(normalizedPath) &&
    !normalizedPath.includes('/app/models/concerns/')
  );
}

export function isSchemaFilePathNormalized(normalizedPath: string, inWorkspace: boolean): boolean {
  return inWorkspace && /\/db\/(structure\.sql|schema\.rb)$/i.test(normalizedPath);
}

export function isAllowedStaleCommand(command: string): boolean {
  return /^rails db:(structure:dump|schema:dump)$/.test(command.trim());
}
