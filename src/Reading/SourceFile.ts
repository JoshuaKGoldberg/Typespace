/// <reference path="../../node_modules/typescript/lib/typescript.d.ts" />
/// <reference path="../../typings/fs-extra/index.d.ts" />

import * as ts from "typescript";

/**
 * Source files, keyed by full path.
 */
export interface ISourceFiles {
    [i: string]: SourceFile;
}

/**
 * Full paths of module dependencies, keyed to their imports.
 */
export interface IModuleDependencies {
    [i: string]: Set<string>;
}

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
    public /* readonly */ moduleDependencies: IModuleDependencies;

    /**
     * Initializes a new instance of the SourceNodes class.
     * 
     * @param fullPath   Full (relative) path to the file, such as "a/b/c.ts".
     * @param nodes   Child nodes of a source file.
     */
    public constructor(fullPath: string, nodes: ts.Node[]) {
        this.fullPath = fullPath;
        this.folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));

        for (const node of nodes) {
            // Todo: figure out why this works
            if (node.kind === ts.SyntaxKind.ExportAssignment || node.kind === ts.SyntaxKind.ImportDeclaration) {
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
    private getModuleDependencies(imports: ts.ImportDeclaration[]): IModuleDependencies {
        const moduleDependencies: IModuleDependencies = {};

        for (const importNode of imports) {
            // Convert each import to its text, such as "./b/c/x" or "../y" or "fs"
            const localPath: string = (importNode.moduleSpecifier as any).text;

            // Only look at local dependencies, such as "./b/c/x" or "../y"
            if (localPath[0] !== ".") {
                continue;
            }

            // Remove the preceding "./" or "../" and ending file name, for "a/b"
            const relativePath: string = localPath.substring(
                localPath.startsWith("./") ? "./".length : 0,
                localPath.lastIndexOf("/"));

            // Ignore files in the local folder
            if (relativePath.length <= 1) {
                continue;
            }

            // Convert "../../../"-style paths to their absolute equivalents
            const absolutePath: string = this.makePathAbsolute(relativePath);

            // Retrieve

            const importedItems: string[] = (importNode.importClause.namedBindings as any).elements
                .map((element: any): string => {
                    return element.name.text;
                });

            // Add new, unique imports to the module's dependencies
            if (moduleDependencies[absolutePath]) {
                for (const importedItem of importedItems) {
                    moduleDependencies[absolutePath].add(importedItem);
                }
            } else {
                moduleDependencies[absolutePath] = new Set<string>(importedItems);
            }
        }

        return moduleDependencies;
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
