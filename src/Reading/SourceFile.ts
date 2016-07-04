/// <reference path="../../node_modules/typescript/lib/typescript.d.ts" />
/// <reference path="../../typings/fs-extra/index.d.ts" />

import * as fs from "fs-promise";
import * as ts from "typescript";

/**
 * Stores child nodes of a source file.
 */
export class SourceFile {
    /**
     * Full (relative) path to this file, such as "a/b/c.ts".
     */
    public /* readonly */ fullPath: string;

    /**
     * Full (relative) path to the folder containing this file, such as "a/b".
     */
    public /* readonly */ folderPath: string;

    /**
     * Name of this file, such as "c.ts".
     */
    public /* readonly */ fileName: string;

    /**
     * Top-level import statements.
     */
    public /* readonly */ imports: ts.ImportDeclaration[] = [];

    /**
     * Top-level nodes other than import statements.
     */
    public /* readonly */ nodes: ts.Node[] = [];

    /**
     * Names of files from the same module this file imports from.
     */
    public /* readonly */ fileDependencies: string[];

    /**
     * Paths of modules this file imports from.
     */
    public /* readonly */ moduleDependencies: string[];

    /**
     * Initializes a new instance of the SourceNodes class.
     * 
     * @param fullPath   Full (relative) path to the file, such as "a/b/c.ts".
     * @param nodes   Child nodes of a source file.
     */
    public constructor(fullPath: string, nodes: ts.Node[]) {
        this.fullPath = fullPath;
        this.folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
        this.fileName = fullPath.substring(fullPath.lastIndexOf("/"));

        for (const node of nodes) {
            if (node.kind == ts.SyntaxKind.ImportDeclaration) {
                this.imports.push(node as ts.ImportDeclaration);
            } else {
                this.nodes.push(node);
            }
        }

        this.fileDependencies = this.getFileDependencies(this.imports);
        this.moduleDependencies = this.getModuleDependencies(this.imports);
    }

    /**
     * Retrieves file dependencies in the same module from import declarations.
     * 
     * @param imports   A file's import declarations.
     * @returns Unique full paths of file dependencies in the same module.
     */
    private getFileDependencies(imports: ts.ImportDeclaration[]): string[] {
        const allFileDependencies: string[] = imports
            // Convert each import to its text, such as "./a/b/c" or "fs"
            .map((importNode: ts.ImportDeclaration): string => {
                return (importNode.moduleSpecifier as any).text;
            })
            // Only look at local dependencies in the same module, such as "./a"
            .filter((fileDependency: string): boolean => {
                return fileDependency.startsWith("./") && fileDependency.lastIndexOf("/") === 1;
            })
            // Remove the preceding "./"
            .map((fileDependency: string): string => fileDependency.substring(2));

        return Array.from(new Set<string>(allFileDependencies));
    }

    /**
     * Retrieves module dependencies from import declarations.
     * 
     * @param imports   A file's import declarations.
     * @returns Unique module dependencies of the file.
     */
    private getModuleDependencies(imports: ts.ImportDeclaration[]): string[] {
        const allModuleDependencies: string[] = imports
            // Convert each import to its text, such as "./a/b/c" or "fs"
            .map((importNode: ts.ImportDeclaration): string => {
                return (importNode.moduleSpecifier as any).text;
            })
            // Only look at local dependencies, such as "./a/b/c"
            .filter((fileDependency: string): boolean => {
                return fileDependency.startsWith(".");
            })
            // Remove the preceding "./" or "../" and ending file name, for "a/b"
            .map((fileDependency: string): string => {
                if (fileDependency.startsWith("./")) {
                    fileDependency = fileDependency.substring(2);
                }

                return fileDependency.substring(0, fileDependency.lastIndexOf("/"));
            })
            // Ignore files in the local folder
            .filter((fileDependency: string): boolean => {
                return fileDependency.length > 1;
            })
            // Convert "../../../"-style paths to their absolute equivalents
            .map((fileDependency: string): string => this.makePathAbsolute(fileDependency));

        return Array.from(new Set<string>(allModuleDependencies));
    }

    /**
     * Converts a relative file path to its absolute equivalent.
     * 
     * @param filePath   A relative file path from an import.
     * @returns The file path's absolute equivalent.
     */
    private makePathAbsolute(filePath: string): string {
        if (filePath.indexOf("..") === -1) {
            return this.folderPath + "/" + filePath;
        }

        let fullPath: string = this.folderPath.substring(0, this.folderPath.lastIndexOf("/"));

        while (filePath.startsWith("../")) {
            fullPath = fullPath.substring(0, filePath.lastIndexOf("/"));
            filePath = filePath.substring("../".length);
        }

        return fullPath;
    }
}
