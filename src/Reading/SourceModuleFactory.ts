import * as path from "path";
import { SourceFile } from "./SourceFile";
import { SourceFileFactory } from "./SourceFileFactory";
import { SourceModule } from "./SourceModule";

/**
 * Source files, keyed by full path.
 */
interface ISourceFiles {
    [i: string]: SourceFile;
}

/**
 * Source modules, keyed by folder path.
 */
interface ISourceModules {
    [i: string]: SourceModule;
}

/**
 * Creates a collection of source modules from a list of file paths.
 */
export class SourceModuleFactory {
    /**
     * Full root path to generated modules.
     */
    private rootPath: string;

    /**
     * Generated source modules.
     */
    public /* readonly */ sourceModules: ISourceModules = {};

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
    public constructor(rootPath: string, filePaths: string[]) {
        this.rootPath = rootPath;

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
            const addedModule = new SourceModule(folderPath, folderFiles[folderPath]);
            this.sourceModules[folderPath] = addedModule;
        }
    }

    /**
     * Determines the path to a folder's parent.
     * 
     * @param folderPath   A folder path.
     * @returns The parent folder path, if it exists.
     */
    private getFolderPathParent(folderPath: string): string {
        const parentPath: string = folderPath.substring(0, folderPath.lastIndexOf("/"));

        return parentPath.length <= this.rootPath.length ? undefined : parentPath;
    }
}
