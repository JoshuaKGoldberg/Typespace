/**
 * Instances of a class, keyed by full path.
 * 
 * @type TClass   The type of class.
 */
export interface IClassInstances<TClass> {
    [i: string]: TClass;
}

/**
 * Retrieves a class instance's dependencies.
 * 
 * @type TClass   The type of class.
 * @returns The class instance's dependencies.
 */
export interface IGetDependencies<TClass> {
    (instance: TClass): string[];
}

/**
 * Generically orderers class instances by their dependencies.
 * 
 * @type TClass   The type of class.
 */
export class DependencyOrderer<TClass> {
    /**
     * Instances of the class, keyed by full path.
     */
    private instances: IClassInstances<TClass>;

    /**
     * Retrieves a class instance's dependencies.
     */
    private getDependencies: IGetDependencies<TClass>;

    /**
     * Initializes a new instance of the DependencyOrderer class.
     * 
     * @param instances   Instances of the class, keyed by full path.
     * @param getDependencies   Retrievies a class instance's dependencies.
     */
    public constructor(instances: IClassInstances<TClass>, getDependencies: IGetDependencies<TClass>) {
        this.instances = instances;
        this.getDependencies = getDependencies;
    }

    /**
     * @returns Class instances in order of their dependencies.
     */
    public generate(): TClass[] {
        const orderedInstances: TClass[] = [];

        this.generateOrderedDependencies(
            new Set<string>(),
            Object.keys(this.instances),
            orderedInstances);

        return orderedInstances;
    }

    /**
     * Recursively adds instances to a list by their path dependencies.
     * 
     * @param addedPaths   Which paths have already been added.
     * @param paths   Dependencies of the current instance being added.
     * @param orderedInstances   Output instances.
     */
    private generateOrderedDependencies(addedPaths: Set<string>, paths: string[], orderedInstances: TClass[]): void {
        for (const path of paths) {
            if (addedPaths.has(path)) {
                continue;
            }

            addedPaths.add(path);

            const instance: TClass = this.instances[path];
            if (!instance) {
                continue;
            }

            this.generateOrderedDependencies(addedPaths, this.getDependencies(instance), orderedInstances);
            orderedInstances.push(instance);
        }
    }
}
