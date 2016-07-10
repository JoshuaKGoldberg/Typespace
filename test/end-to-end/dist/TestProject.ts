namespace TestProject {
    import IUtility = TestProject.Utilities.IUtility;
    import IAnotherUtility = TestProject.Utilities.IAnotherUtility;
    import IDeepUtility = TestProject.Utilities.Deep.IDeepUtility;

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
}

namespace TestProject.Utilities {
    import IDeepUtility = TestProject.Utilities.Deep.IDeepUtility;

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
     * Another sample utility interface.
     */
    export interface IAnotherUtility {
        /**
         * @returns Another value.
         */
        getValue(): number;
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

namespace TestProject.Utilities.Deep {
    import IAnotherUtility = TestProject.Utilities.IAnotherUtility;

    /**
     * A sample deep utility interface.
     */
    export interface IDeepUtility {
        /**
         * @returns A sample value.
         */
        getDeepValue(): number;
    }
}