declare module "fs-promise" {
    export function readFile(fileName: string): Promise<string>;
    export function exists(fileName: string): Promise<boolean>;
}