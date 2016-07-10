/// <reference path="../../typings/typescript/index.d.ts" />
/// <reference path="../../typings/fs-extra/index.d.ts" />

import * as fs from "fs-promise";
import * as ts from "typescript";
import { SourceFile } from "../Reading/SourceFile";

/**
 * Prints a single SourceFile.
 */
export class SourceFilePrinter {
    /**
     * The source file to be printed.
     */
    sourceFile: SourceFile;

    /**
     * Root namespace to ignore from module paths.
     */
    rootNamespace: string;

    /**
     * Full contents of the source file.
     */
    contents: string;

    /**
     * Initializes a new instance of the SourceFilePrinter class.
     * 
     * @param sourceFile   The source file to be printed.
     * @param rootNamespace   Root namespace to ignore from module paths.
     * @returns A promise for a new instance of the SourceFilePrinter class.
     */
    public static async fromSourceFile(sourceFile: SourceFile, rootNamespace: string): Promise<SourceFilePrinter> {
        return new SourceFilePrinter(
            sourceFile,
            rootNamespace,
            (await fs.readFile(sourceFile.fullPath)).toString());
    }

    /**
     * Initializes a new instance of the SourceFilePrinter class.
     * 
     * @param sourceFile   The source file to be printed.
     * @param rootNamespace   Root namespace to ignore from module paths.
     * @param contents  Full contents of the source file.
     */
    public constructor(sourceFile: SourceFile, rootNamespace: string, contents: string) {
        this.sourceFile = sourceFile;
        this.rootNamespace = rootNamespace;
        this.contents = contents;
    }

    /**
     * @returns The body of the source file, with a blank line between nodes.
     */
    public getBody(): string {
        return this.sourceFile.nodes
            .map((node: ts.Node): string => this.contents.substring(node.pos, node.end).trim())
            .join("\n\n");
    }

    /**
     * @returns Unique imports from the source file.
     */
    public getImports(): string[] {
        if (this.sourceFile.imports.length === 0) {
            return [];
        }

        return this.sourceFile.imports
            .map((node: ts.ImportDeclaration): string[] => this.convertImport(node))
            .reduce((a: string[], b: string[]) => {
                if (!a) {
                    return b;
                }
                if (!b) {
                    return a;
                }

                return [...a, ...b];
            })
            .filter((printed: string): boolean => !!printed);
    }

    /**
     * Converts an import from ES6-style to namespace-style.
     * 
     * @param node   An import node.
     * @returns The node's equivalent in namespace-style, if applicable.
     */
    private convertImport(node: ts.ImportDeclaration): string[] {
        const elements: ts.Node[] = (node.importClause.namedBindings as any).elements;
        const namespaceName: string = this.resolveNamespaceName((node.moduleSpecifier as any).text);

        if (!namespaceName) {
            return [];
        }

        return elements.map((element: ts.Node): string => {
            const name: string = (element as any).name.text;
            return `import ${name} = ${namespaceName}.${name};`;
        });
    }

    /**
     * Converts an import path into a namespace.
     * 
     * @param importPath   A path from an ES6-style import.
     * @returns The path's equivalent namespace, if applicable.
     */
    private resolveNamespaceName(importPath: string): string {
        if (importPath.startsWith("./")) {
            importPath = importPath.substring("./".length);
        }
        if (importPath.lastIndexOf("/") === 1) {
            return undefined;
        }

        while (importPath.startsWith("../")) {
            importPath = importPath.substring("../".length);
        }
        if (importPath.lastIndexOf("/") === -1) {
            return undefined;
        }

        importPath = importPath.substring(0, importPath.lastIndexOf("/"));

        return importPath.replace(/\//g, ".");
    }
}
