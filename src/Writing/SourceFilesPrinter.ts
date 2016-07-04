import { SourceFile } from "../Reading/SourceFile";
import { SourceFilePrinter } from "./SourceFilePrinter";

/**
 * Source files, keyed by full path.
 */
interface ISourceFiles {
    [i: string]: SourceFile;
}

/**
 * Prints source files as namespace output.
 */
export class SourceFilesPrinter {
    /**
     * Source files, keyed by full path.
     */
    private sourceFiles: ISourceFiles;

    /**
     * Source files in order of their flattened dependency graph.
     */
    private orderedSourceFiles: SourceFile[];

    /**
     * Root namespace to ignore from module paths.
     */
    private rootNamespace: string;

    /**
     * Initializes a new instance of the SourceFilesPrinter class.
     * 
     * @param sourceFiles   Source files, keyed by full path.
     * @param rootNamespace   Root namespace to ignore from module paths.
     */
    constructor(sourceFiles: ISourceFiles, rootNamespace: string) {
        this.sourceFiles = sourceFiles;
        this.rootNamespace = rootNamespace;

        // const dependencyOrderer: DependencyOrderer<SourceFile> = new DependencyOrderer(
        //     this.sourceFiles,
        //     (sourceFile: SourceFile): string[] => sourceFile.fileDependencies);
        // this.orderedSourceFiles = dependencyOrderer.generate();
        this.orderedSourceFiles = Object.keys(sourceFiles)
            .map((key: string): SourceFile => sourceFiles[key]);
    }

    /**
     * @returns A promise for printing the source files as a namespace.
     */
    public async print(): Promise<string> {
        let allBodies: string[] = [];
        let allImports: string[] = [];

        for (const sourceFile of this.orderedSourceFiles) {
            const sourceFilePrinter: SourceFilePrinter = await SourceFilePrinter.fromSourceFile(sourceFile, this.rootNamespace);
            allBodies.push(sourceFilePrinter.getBody());
            allImports.push(
                ...sourceFilePrinter.getImports()
                .filter((text: string): boolean => !!text));
        }

        allImports = Array.from(new Set<string>(allImports));

        return `${allImports.join("\n")}\n\n${allBodies.join("\n\n")}`;
    }
}
