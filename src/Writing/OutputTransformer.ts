import { ITypespaceSettings } from "../Typespace";

/**
 * Transformers keyed by their type of transform.
 */
interface ITransformers {
    [i: string]: ITransformer;
}

/**
 * Transforms an output file's contents into a script target.
 * 
 * @param contents   Contents of an output file.
 * @param settings   Settings to run Typespace.
 * @returns The contents, transformed.
 */
interface ITransformer {
    (contents: string, settings: ITypespaceSettings): string;
}

/**
 * Transforms an output file's contents into its appropriate script target.
 */
export class OutputTransformer {
    /**
     * Transformers keyed by their type of transform.
     */
    private transformers: any = {
        commonjs: this.transformToCommonJs,
        none: (contents: string): string => contents,
    };

    /**
     * Transforms an output file's contents into its appropriate script target.
     * 
     * @param contents   Contents of an output file.
     * @param settings   Settings to run Typespace.
     * @returns The contents, transformed.
     */
    public transform(contents: string, settings: ITypespaceSettings): string {
        if (!this.transformers[settings.target]) {
            throw new Error(`Unknown script target: '${settings.target}'.`);
        }

        return this.transformers[settings.target].call(this, contents, settings);
    }

    /**
     * Transforms an output file's contents to the CommonJS format.
     * 
     * @param contents   Contents of an output file.
     * @param settings   Settings to run Typespace.
     * @returns The contents, transformed.
     */
    public transformToCommonJs(contents: string, settings: ITypespaceSettings): string {
        return contents
            + [
                ``,
                `declare var module: any;`,
                `if (typeof module !== "undefined" && typeof module.exports !== "undefined") {`,
                `   module.exports = ${settings.namespace};`,
                `}`,
                ``
            ].join("\n");
    }
}
