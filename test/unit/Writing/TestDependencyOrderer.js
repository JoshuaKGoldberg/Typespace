const expect = require("chai").expect;
const DependencyOrderer = require("../../../lib/Writing/DependencyOrderer").DependencyOrderer;

const mocks = {
    getDependencies: instance => instance.dependencies,
    mockInstance: dependencies => {
        return {
            dependencies: dependencies || []
        };
    },
    mockOrderer: instances => new DependencyOrderer(instances || {}, mocks.getDependencies)
};

describe("DependencyOrderer", () => {
    describe("generate", () => {
        it("orders a single instance", () => {
            // Arrange
            const instances = {
                foo: mocks.mockInstance()
            };
            const orderer = mocks.mockOrderer(instances)

            // Act
            const ordered = orderer.generate();

            // Assert
            expect(ordered).to.be.deep.equal([instances.foo]);
        });

        it("orders two unrelated instances", () => {
            // Arrange
            const instances = {
                foo: mocks.mockInstance(),
                bar: mocks.mockInstance()
            };
            const orderer = mocks.mockOrderer(instances)

            // Act
            const ordered = orderer.generate();

            // Assert
            expect(ordered).to.be.deep.equal([instances.foo, instances.bar]);
        });

        it("orders two related instances", () => {
            // Arrange
            const instances = {
                foo: mocks.mockInstance(["bar"]),
                bar: mocks.mockInstance()
            };
            const orderer = mocks.mockOrderer(instances)

            // Act
            const ordered = orderer.generate();

            // Assert
            expect(ordered).to.be.deep.equal([instances.bar, instances.foo]);
        });

        it("orders instances with duplicate dependencies", () => {
            // Arrange
            const instances = {
                foo: mocks.mockInstance(["bar"]),
                bar: mocks.mockInstance(),
                baz: mocks.mockInstance(["bar"]),
                qux: mocks.mockInstance(["bar", "baz"])
            };
            const orderer = mocks.mockOrderer(instances)

            // Act
            const ordered = orderer.generate();

            // Assert
            expect(ordered).to.be.deep.equal([
                instances.bar, instances.foo, instances.baz, instances.qux
            ]);
        });

        it("allows circular dependencies", () => {
            // Arrange
            const instances = {
                foo: mocks.mockInstance(["bar"]),
                bar: mocks.mockInstance(["baz"]),
                baz: mocks.mockInstance(["foo"])
            };
            const orderer = mocks.mockOrderer(instances)

            // Act
            const ordered = orderer.generate();

            // Assert
            expect(ordered).to.be.deep.equal([
                instances.baz, instances.bar, instances.foo
            ]);
        });
    });
});
