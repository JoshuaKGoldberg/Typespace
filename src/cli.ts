/// <reference path="../typings/commander/index.d.ts" />

/* tslint:disable no-var-requires */
const program: any = require("commander");
import { Typespace } from "./Typespace";
const metadata: any = require("../package.json");
/* tslint:enable no-var-requires */

/**
 * Callback for a successful file conversion.
 * 
 * @param contents   Generated file contents.
 * @param outFile   Name of a file to output to, if provided.
 */
export interface IOnCliSuccess {
    (contents: string, outFile: string): void;
}

/**
 * Callback for an error during a conversion.
 * 
 * @param error   The thrown error.
 */
export interface IOnCliError {
    (error: Error): void;
}

/**
 * Returned information on a newly running conversion.
 */
export interface IRunningTypespace {
    /**
     * Promise for the converted file.
     */
    conversion: Promise<void>;

    /**
     * Typespace instance running the conversion.
     */
    typespace: Typespace;
}

/**
 * Runs Typespace with command line arguments.
 * 
 * @param argv   Command line arguments.
 * @param onSuccess   Callback for a successful file conversion.
 * @param onError   Callback for an error during a conversion.
 * @returns Information on a newly running conversion.
 */
export function cli(argv: string[], onSuccess: IOnCliSuccess, onError: IOnCliError): IRunningTypespace {
    "use strict";

    program
        .description(metadata.description)
        .version(metadata.version)
        .usage("-n MyProject [-c tsconfig.json] [-o output.ts] [-r path/to/files] [-t none|commonjs]")
        .option("-c --config [path]", "input tsconfig.json file path to load files from (optional)")
        .option("-n --namespace [string]", "name of the root namespace")
        .option("-o --out-file [path]", "output .ts file path (optional)")
        .option("-r --root [string]", "root path to search for files under (optional)")
        .option("-t --target [string]", "module resolution target (optional)")
        .parse(argv);

    const typespace: Typespace = new Typespace(program);
    const conversion: Promise<void> = typespace.convert()
        .then(contents => {
            const outFile: string = program.outFile;
            if (outFile) {
                onSuccess(contents, outFile);
            }
        })
        .catch(onError);

    return { typespace, conversion };
};
