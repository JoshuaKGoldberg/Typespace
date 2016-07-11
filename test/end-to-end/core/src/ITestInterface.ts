import { IUtility } from "./Utilities/IUtility";
import { IDeepUtility } from "./Utilities/Deep/IDeepUtility";

/**
 * A sample interface.
 */
export interface ITestInterface {
    /**
     * @returns The sample utility.
     */
    getUtility(): IUtility;
    
    /**
     * A sample deep utility.
     */
    deepUtility?: IDeepUtility;
}
