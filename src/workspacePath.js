"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPathWithinRoots = isPathWithinRoots;
exports.isPathInWorkspace = isPathInWorkspace;
exports.isModelFilePath = isModelFilePath;
exports.isSchemaFilePath = isSchemaFilePath;
exports.isAllowedStaleCommand = isAllowedStaleCommand;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
/** Pure helper — testable without the VS Code API. */
function isPathWithinRoots(fsPath, roots) {
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
function isPathInWorkspace(fsPath) {
    const roots = vscode.workspace.workspaceFolders?.map((f) => f.uri.fsPath) ?? [];
    return isPathWithinRoots(fsPath, roots);
}
function isModelFilePath(fsPath) {
    const normalized = fsPath.replace(/\\/g, '/');
    return (isPathInWorkspace(fsPath) &&
        /\/app\/models\/[^/]+\.rb$/i.test(normalized) &&
        !normalized.includes('/app/models/concerns/'));
}
function isSchemaFilePath(fsPath) {
    const normalized = fsPath.replace(/\\/g, '/');
    return isPathInWorkspace(fsPath) && /\/db\/(structure\.sql|schema\.rb)$/i.test(normalized);
}
function isAllowedStaleCommand(command) {
    return /^rails db:(structure:dump|schema:dump)$/.test(command.trim());
}
