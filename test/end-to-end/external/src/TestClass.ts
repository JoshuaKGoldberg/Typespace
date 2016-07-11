/// <reference path="../typings/ExternalProject.d.ts" />

import { ExternalClass, IExternalInterface } from "ExternalProject";
import { IUtility } from "./Utilities/IUtility";

/**
 * A sample class.
 */
export class TestClass extends ExternalClass implements IExternalInterface {
    /**
     * A sample utility.
     */
    public utility: IUtility;

    /**
     * @returns The sample utility.
     */
    public getUtility(): IUtility {
        return this.utility;
    }
}
