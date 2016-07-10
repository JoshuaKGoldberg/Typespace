import * as path from "path";
import { ITypespaceSettings } from "../Typespace";
import { ISourceFiles, SourceFile } from "./SourceFile";
import { SourceFileFactory } from "./SourceFileFactory";
import { ISourceModules, SourceModule } from "./SourceModule";

/**
 * Creates a collection of source modules from a list of file paths.
 */
export class SourceModuleFactory {
    /**
     * Generated source modules.
     */
    public /* readonly */ sourceModules: ISourceModules = {};

    /**
     * Full root path to generated modules.
     */
    private rootPath: string;

    /**
     * Settings to run Typespace.
     */
    private settings: ITypespaceSettings;

    /**
     * Generated source files.
     */
    private sourceFiles: ISourceFiles = {};

    /**
     * Generates source files within modules.
     */
    private sourceFileFactory: SourceFileFactory = new SourceFileFactory();

    /**
     * Initializes a new instance of the SourceModule class.
     * 
     * @param rootPath   Full root path to generated modules.
     */
    public constructor(rootPath: string, filePaths: string[], settings: ITypespaceSettings) {
        this.rootPath = rootPath;
        this.settings = settings;

        const files: SourceFile[] = filePaths.map(
            (filePath: string): SourceFile => {
                return this.sourceFileFactory.createFromPath(
                    path.posix.join(this.rootPath, filePath));
            });

        for (const file of files) {
            this.sourceFiles[file.fullPath] = file;
        }

        this.createModulesFromFiles(files);
    }

    /**
     * Collects source modules and adds them to this.sourceModules.
     * 
     * @param sourceFiles   Source files within modules.
     */
    private createModulesFromFiles(sourceFiles: SourceFile[]): void {
        const folderFiles: { [i: string]: SourceFile[] } = {};

        for (const sourceFile of sourceFiles) {
            if (!folderFiles[sourceFile.folderPath]) {
                folderFiles[sourceFile.folderPath] = [sourceFile];
            } else {
                folderFiles[sourceFile.folderPath].push(sourceFile);
            }
        }

        for (const folderPath in folderFiles) {
            const modulePath: string = this.createModulePath(folderPath);
            const addedModule: SourceModule = new SourceModule(modulePath, folderFiles[folderPath]);
            this.sourceModules[folderPath] = addedModule;
        }
    }

    /**
     * Generates the corresponding module path from a folder path.
     * 
     * @param folderPath   A path to a file.
     * @returns The corresponding module path.
     */
    private createModulePath(folderPath: string): string {
        if (folderPath.indexOf(this.settings.root) === 0) {
            folderPath = folderPath.substring(this.settings.root.length);
        }

        if (folderPath.indexOf(this.settings.pathPrefix) === 0) {
            folderPath = folderPath.substring(this.settings.pathPrefix.length);
        }

        return folderPath;
    }
}
