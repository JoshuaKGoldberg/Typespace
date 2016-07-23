import { ISourceModules, SourceModule } from "../Reading/SourceModule";
import { ITypespaceSettings } from "../Typespace";
import { SourceFilesPrinter } from "./SourceFilesPrinter";
import { DependencyOrderer } from "./DependencyOrderer";
import { OutputTransformer } from "./OutputTransformer";

/**
 * Prints a set of modules as namespace output.
 */
export class SourceModulesPrinter {
    /**
     * Source modules, keyed by full path.
     */
    private sourceModules: ISourceModules;

    /**
     * Settings to run Typespace.
     */
    private settings: ITypespaceSettings;

    /**
     * Initializes a new instance of the SourceModulesPrinter class.
     * 
     * @param sourceModules   Source modules, keyed by full path.
     * @param settings   Settings to run Typespace.
     */
    public constructor(sourceModules: ISourceModules, settings: ITypespaceSettings) {
        this.sourceModules = sourceModules;
        this.settings = settings;
    }

    /**
     * @returns A promise for printing the source modules as namespace output.
     */
    public async print(): Promise<string> {
        const orderedSourceModules: SourceModule[] = this.orderSourceModules();
        let contents: string = "";

        for (const sourceModule of orderedSourceModules) {
            const namespacePath: string = this.settings.namespace + sourceModule.namespacePath.join(".");
            const moduleContents: string = await this.getSourceModuleContents(sourceModule);

            contents += [
                `namespace ${namespacePath} {`,
                `    ${moduleContents.trim()}`.replace(/\n/g, "\n    "),
                "}\n\n"
            ].join("\n");
        }

        contents = contents
            .trim()
            .replace(/\r/g, "")
            .replace(/\n *\n/g, "\n\n")
            + "\n";

        if (this.settings.references) {
            contents = this.addOutputReferences(contents, this.settings.references);
        }

        if (this.settings.target) {
            contents = this.addOutputTarget(contents, this.settings);
        }

        return contents;
    }

    /**
     * Orders the source modules in by their dependencies.
     * 
     * @returns A promise for the ordered source modules.
     */
    private orderSourceModules(): SourceModule[] {
        const dependencyOrderer: DependencyOrderer<SourceModule> = new DependencyOrderer(
            this.sourceModules,
            (sourceModule: SourceModule): string[] => sourceModule.moduleDependencies);

        return dependencyOrderer.generate();
    }

    /**
     * Prints the contents of a module.
     * 
     * @param sourceModule   A source module.
     * @returns A promise for the printed contents.
     */
    private async getSourceModuleContents(sourceModule: SourceModule): Promise<string> {
        return await new SourceFilesPrinter(sourceModule.sourceFiles, this.settings).print();
    }

    /**
     * Prepends definition references to an output file's contents.
     * 
     * @param contents   An output file's contents.
     * @param references   References to prepend to the file.
     * @returns The output with references prepended.
     */
    private addOutputReferences(contents: string, references: string[]): string {
        return references
            .map(reference => `/// <reference path="${reference}" />`)
            .join("\n")
            + "\n\n"
            + contents;
    }

    /**
     * 
     */
    private addOutputTarget(contents: string, settings: ITypespaceSettings): string {
        return new OutputTransformer().transform(contents, settings);
    }
}
