/// <reference path="../typings/node/index.d.ts" />

import * as fs from "fs";
import * as path from "path";
import { SourceModuleFactory } from "./Reading/SourceModuleFactory";
import { SourceModulesPrinter } from "./Writing/SourceModulesPrinter";

/**
 * Settings to run Typespace.
 */
export interface ITypespaceSettings {
    /**
     * Input tsconfig.json file path.
     */
    config?: string;

    /**
     * Paths of files to include.
     */
    files?: string[];

    /**
     * Directory root to ignore from module paths.
     */
    pathPrefix?: string;

    /**
     * Name of the root namespace.
     */
    namespace: string;

    /**
     * Root path to search for files under.
     */
    root?: string;
}

/**
 * Converts import/require-style TypeScript directories into a
 * unified namespace output.
 */
export class Typespace {
    /**
     * Settings to run Typespace.
     */
    private settings: ITypespaceSettings;

    /**
     * Paths to files to include.
     */
    private files: string[];

    /**
     * Initializes a new instance of the Typespace class.
     * 
     * @param settings   Settings to run.
     */
    constructor(settings: ITypespaceSettings) {
        this.settings = settings;
        this.files = this.collectFiles(settings);
    }

    /**
     * Converts files from the source project to a single output.
     * 
     * @returns A promise for the combined output.
     */
    public async convert(): Promise<string> {
        const rootPath: string = this.getRootPath(this.settings);
        const sourceModuleFactory: SourceModuleFactory = new SourceModuleFactory(rootPath, this.files, this.settings);
        const sourceModulesPrinter: SourceModulesPrinter = new SourceModulesPrinter(sourceModuleFactory.sourceModules, this.settings);

        return await sourceModulesPrinter.print();
    }

    /**
     * Collects paths of files to include from settings.
     * 
     * @param settings   Settings to run Typespace.
     * @returns Paths of files to include.
     */
    private collectFiles(settings: ITypespaceSettings): string[] {
        const files: string[] = [];

        if (settings.files) {
            files.push(...settings.files);
        }

        if (settings.config) {
            files.push(...this.collectProjectFiles(settings.config));
        }

        return files;
    }

    /**
     * Collects paths of files to include from a tsconfig.json.
     * 
     * @param config   Path to a tsconfig.json.
     * @returns Paths of files to include.
     */
    private collectProjectFiles(config: string): string[] {
        if (!fs.existsSync(config)) {
            throw new Error(`'${config}' does not exist.`);
        }

        const project: any = JSON.parse(fs.readFileSync(config).toString());

        if (!project.files || !(project.files instanceof Array)) {
            throw new Error(`'${config}' does not define an array of files.`);
        }

        return project.files;
    }

    /**
     * Determines the name of the output root namespace.
     * 
     * @param settings   Settings to run Typespace.
     * @returns The name of the output root namespace.
     */
    private getRootPath(settings: ITypespaceSettings): string {
        if (settings.root) {
            return settings.root;
        }

        if (settings.config) {
            return path.dirname(this.settings.config);
        }

        return ".";
    }
}
