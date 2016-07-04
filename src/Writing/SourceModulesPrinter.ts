import { SourceModule } from "../Reading/SourceModule";
import { SourceFilesPrinter } from "./SourceFilesPrinter";
import { SourceModuleFactory } from "../Reading/SourceModuleFactory";
import { ITypespaceSettings } from "../Typespace";
import { DependencyOrderer } from "./DependencyOrderer";

/**
 * Source modules, keyed by folder path.
 */
interface ISourceModules {
    [i: string]: SourceModule;
}

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
        let output: string = "";

        for (const sourceModule of orderedSourceModules) {
            const contents: string = await this.getSourceModuleContents(sourceModule);
            const indentation: string = sourceModule.namespacePath.map((_: string): string => "    ").join("");
            let namespacePath: string = sourceModule.namespacePath
                .join(".")
                .substring(this.settings.root.length);

            output += [
                `namespace ${this.settings.namespace}${namespacePath} {`,
                `    ${contents.trim()}`.replace(/\n/g, "\n    "),
                "}\n\n"
            ].join("\n");
        }

        return output
            .trim()
            .replace(/\r/g, "")
            .replace(/\n *\n/g, "\n\n")
            + "\n";
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
        return await new SourceFilesPrinter(sourceModule.sourceFiles, this.settings.root).print();
    }
}
