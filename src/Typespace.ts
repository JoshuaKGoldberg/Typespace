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
     * Name of the output root namespace.
     */
    rootNamespace: string;

    /**
     * Input tsconfig.json path.
     */
    project: string;

    /**
     * Root namespace to ignore from module paths.
     */
    root: string;
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
     * Initializes a new instance of the Typespace class.
     * 
     * @param settings   Settings to run.
     */
    constructor(settings: ITypespaceSettings) {
        if (!settings.rootNamespace) {
            throw new Error("You need to specify a -rn/--rootNamespace string.");
        }

        if (!settings.project) {
            throw new Error("You need to specify a -p/--project path.");
        }
        if (!fs.existsSync(settings.project)) {
            throw new Error(`'${settings.project}' does not exist.`);
        }

        this.settings = settings;
    }

    /**
     * Converts files from the source project to a single output.
     * 
     * @returns A promise for the combined output.
     */
    public async convert(): Promise<string> {
        const config: any = JSON.parse(fs.readFileSync(this.settings.project).toString());

        if (!config.files || !(config.files instanceof Array)) {
            throw new Error(`'${this.settings.project}' does not define an array of files.`);
        }

        const rootPath: string = path.dirname(this.settings.project);
        const sourceModuleFactory: SourceModuleFactory = new SourceModuleFactory(rootPath, config.files);
        const sourceModulesPrinter: SourceModulesPrinter = new SourceModulesPrinter(sourceModuleFactory.sourceModules, this.settings);

        return await sourceModulesPrinter.print();
    }
}
