/// <reference path="../../typings/typescript/index.d.ts" />
/// <reference path="../../typings/fs-extra/index.d.ts" />

import * as fs from "fs-promise";
import * as ts from "typescript";
import { ITypespaceSettings } from "../Typespace";
import { SourceFile } from "../Reading/SourceFile";

/**
 * Prints a single SourceFile.
 */
export class SourceFilePrinter {
    /**
     * The source file to be printed.
     */
    private sourceFile: SourceFile;

    /**
     * Full contents of the source file.
     */
    private contents: string;

    /**
     * Settings to run Typespace.
     */
    private settings: ITypespaceSettings;

    /**
     * Initializes a new instance of the SourceFilePrinter class.
     * 
     * @param sourceFile   The source file to be printed.
     * @param settings   Settings to run Typespace.
     * @returns A promise for a new instance of the SourceFilePrinter class.
     */
    public static async fromSourceFile(sourceFile: SourceFile, settings: ITypespaceSettings): Promise<SourceFilePrinter> {
        return new SourceFilePrinter(
            sourceFile,
            (await fs.readFile(sourceFile.fullPath)).toString(),
            settings);
    }

    /**
     * Initializes a new instance of the SourceFilePrinter class.
     * 
     * @param sourceFile   The source file to be printed.
     * @param contents  Full contents of the source file.
     * @param settings   Settings to run Typespace.
     */
    public constructor(sourceFile: SourceFile, contents: string, settings: ITypespaceSettings) {
        this.sourceFile = sourceFile;
        this.contents = contents;
        this.settings = settings;
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
        const imports: string[] = [];

        for (const moduleName in this.sourceFile.moduleDependencies) {
            const moduleDependency: Set<string> = this.sourceFile.moduleDependencies[moduleName];

            for (const item of moduleDependency) {
                imports.push(`import ${item} = ${this.parseModuleName(moduleName)}.${item};`);
            }
        }

        return imports;
    }

    /**
     * 
     */
    private parseModuleName(moduleName: string): string {
        const relativeModulePath: string[] = this.getPathComponents(moduleName);
        const relativeFolderPath: string[] = this.getPathComponents(this.sourceFile.folderPath);

        while (relativeModulePath.length > relativeFolderPath.length && relativeModulePath[0] === relativeFolderPath[0]) {
            relativeModulePath.shift();
            relativeFolderPath.shift();
        }

        return relativeModulePath.join(".");
    }

    /**
     * Converts a path into its components, ignoring the root path and prefix.
     * 
     * @param path   A path that may include the root path and prefix.
     * @returns The important components of the path.
     */
    private getPathComponents(path: string): string[] {
        if (path.startsWith(this.settings.root)) {
            path = path.substring(this.settings.root.length);
        }

        if (path.startsWith(this.settings.pathPrefix)) {
            path = path.substring(this.settings.pathPrefix.length);
        }

        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        return path.split("/");
    }
}
