namespace TestProject {
    import IUtility = Utilities.IUtility;

    /**
     * A sample interface.
     */
    export interface ITestInterface {
        /**
         * @returns The sample utility.
         */
        getUtility(): IUtility;
    }

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

    namespace Utilities {
        /**
         * A sample utility interface.
         */
        export interface IUtility {
            /**
             * @returns A sample value.
             */
            getValue(): boolean;
        }

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
    }
}