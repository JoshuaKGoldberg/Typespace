import { IUtility, IAnotherUtility } from "./Utilities/IUtility";
import { ITestInterface } from "./ITestInterface";

/**
 * A sample class.
 */
export class TestClass implements ITestInterface {
    /**
     * A sample utility.
     */
    public utility: IUtility;

    /**
     * Another sample utility.
     */
    public anotherUtility: IAnotherUtility;

    /**
     * @returns The sample utility.
     */
    public getUtility(): IUtility {
        return this.utility;
    }
}
