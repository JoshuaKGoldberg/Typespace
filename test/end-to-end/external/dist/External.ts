namespace External.Utilities {
    import IExternalValue = ExternalProject.IExternalValue;

    /**
     * A sample utility interface.
     */
    export interface IUtility {
        /**
         * @returns A sample external value.
         */
        getValue(): IExternalValue;
    }
}

namespace External {
    import ExternalClass = ExternalProject.ExternalClass;
    import IExternalInterface = ExternalProject.IExternalInterface;
    import IUtility = Utilities.IUtility;

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
}
