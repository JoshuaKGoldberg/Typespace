import { IUtility } from "./IUtility";

/**
 * A sample utility.
 */
export class Utility implements IUtility {
    /**
     * @returns A sample value.
     */
    getValue(): boolean {
        return true;
    }
}
