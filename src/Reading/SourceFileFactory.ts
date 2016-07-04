/// <reference path="../../node_modules/typescript/lib/typescript.d.ts" />
/// <reference path="../../typings/node/index.d.ts" />

import * as fs from "fs";
import * as ts from "typescript";
import { SourceFile } from "./SourceFile";

/**
 * Creates source files from their full paths.
 */
export class SourceFileFactory {
    /**
     * Initializes a new instance of the SourceFile class.
     * 
     * @param fullPath   Full (relative) path to the file, such as "a/b/c.ts".
     * @param text   Text contents of the file.
     * @returns A new SourceFile.
     */
    public createFromPath(fullPath: string): SourceFile {
        const fileText: string = fs.readFileSync(fullPath).toString();
        const sourceFile: ts.SourceFile = ts.createSourceFile(fullPath, fileText, ts.ScriptTarget.ES2015);

        return new SourceFile(fullPath, sourceFile.getChildren()[0].getChildren());
    }
}
