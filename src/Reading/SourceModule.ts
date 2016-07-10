/// <reference path="../../node_modules/typescript/lib/typescript.d.ts" />

import { ISourceFiles, SourceFile } from "./SourceFile";

/**
 * Source modules, keyed by folder path.
 */
export interface ISourceModules {
    [i: string]: SourceModule;
}

/**
 * Collection of files and sub-modules (folders) of a module.
 */
export class SourceModule {
    /**
     * Full (relative) path to the module, such as "a/b".
     */
    public /* readonly */ modulePath: string;

    /**
     * Named path to the namespace, such as ["a", "b"].
     */
    public /* readonly */ namespacePath: string[];

    /**
     * Source files within this module.
     */
    public /* readonly */ sourceFiles: ISourceFiles = {};

    /**
     * All module dependencies from source files.
     */
    public /* readonly */ moduleDependencies: string[];

    /**
     * Initializes a new instance of the SourceModule class.
     * 
     * @param modulePath    Full (relative) path to the module, such as "a/b".
     * @param sourceFiles   Source files within the module.
     */
    public constructor(modulePath: string, sourceFiles: SourceFile[]) {
        this.modulePath = modulePath;
        this.namespacePath = this.modulePath.split("/");

        for (const sourceFile of sourceFiles) {
            this.sourceFiles[sourceFile.fullPath] = sourceFile;
        }

        this.moduleDependencies = this.getModuleDependencies(sourceFiles);
    }

    /**
     * Retrieves module dependencies from source files.
     * 
     * @param sourceFiles   Source files within this module.
     * @returns Collected module dependencies from the source files.
     */
    private getModuleDependencies(sourceFiles: SourceFile[]): string[] {
        const moduleDependencies: Set<string> = new Set<string>();

        for (const sourceFile of sourceFiles) {
            for (const moduleDependency of sourceFile.moduleDependencies) {
                moduleDependencies.add(moduleDependency);
            }
        }

        return Array.from(moduleDependencies);
    }
}
