import { IUtility } from "./Utilities/IUtility";
import { ITestInterface } from "./ITestInterface";

/**
 * A sample class.
 */
export class TestClass implements ITestInterface {
    /**
     * A sample utility.
     */
    private utility: IUtility;

    /**
     * @returns The sample utility.
     */
    public getUtility(): IUtility {
        return this.utility;
    }
}
