import { ITypespaceSettings } from "../Typespace";
import { ISourceFiles, SourceFile } from "../Reading/SourceFile";
import { SourceFilePrinter } from "./SourceFilePrinter";

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
     * Settings to run Typespace.
     */
    private settings: ITypespaceSettings;

    /**
     * Initializes a new instance of the SourceFilesPrinter class.
     * 
     * @param sourceFiles   Source files, keyed by full path.
     * @param rootNamespace   Root namespace to ignore from module paths.
     */
    constructor(sourceFiles: ISourceFiles, settings: ITypespaceSettings) {
        this.sourceFiles = sourceFiles;
        this.settings = settings;

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
            const sourceFilePrinter: SourceFilePrinter = await SourceFilePrinter.fromSourceFile(sourceFile, this.settings);
            allBodies.push(sourceFilePrinter.getBody());
            allImports.push(
                ...sourceFilePrinter.getImports()
                .filter((text: string): boolean => !!text));
        }

        allImports = Array.from(new Set<string>(allImports)).sort();

        return `${allImports.join("\n")}\n\n${allBodies.join("\n\n")}`;
    }
}
