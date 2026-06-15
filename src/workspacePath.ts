import * as vscode from 'vscode';
import {
  isAllowedStaleCommand,
  isModelFilePathNormalized,
  isPathWithinRoots,
  isSchemaFilePathNormalized,
} from './pathGuards';

export { isAllowedStaleCommand, isPathWithinRoots } from './pathGuards';

export function isPathInWorkspace(fsPath: string): boolean {
  const roots = vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath) ?? [];
  return isPathWithinRoots(fsPath, roots);
}

export function isModelFilePath(fsPath: string): boolean {
  const normalized = fsPath.replace(/\\/g, '/');
  return isModelFilePathNormalized(normalized, isPathInWorkspace(fsPath));
}

export function isSchemaFilePath(fsPath: string): boolean {
  const normalized = fsPath.replace(/\\/g, '/');
  return isSchemaFilePathNormalized(normalized, isPathInWorkspace(fsPath));
}
