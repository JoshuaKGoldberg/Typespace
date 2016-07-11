/// <reference path="../../typings/ExternalProject.d.ts" />

import { IExternalValue } from "ExternalProject";

/**
 * A sample utility interface.
 */
export interface IUtility {
    /**
     * @returns A sample external value.
     */
    getValue(): IExternalValue;
}
