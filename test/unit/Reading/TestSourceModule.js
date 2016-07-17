const ts = require("typescript");
const expect = require("chai").expect;
const SourceFile = require("../../../lib/Reading/SourceFile").SourceFile;
const SourceModule = require("../../../lib/Reading/SourceModule").SourceModule;

const mocks = {
    mockNodes: source => ts.createSourceFile("mock.ts", source, ts.ScriptTarget.ES2015, true).statements,
    mockSourceFile: (source, fileName) => new SourceFile(fileName || "mock.ts", mocks.mockNodes(source)),
    mockSourceModule: (sourceFiles, modulePath) => new SourceModule(modulePath || "", sourceFiles)
};

describe("SourceModule", () => {
    describe("moduleDependencies", () => {
        it("retrieves a single module dependency", () => {
            // Arrange
            const sourceFiles = [
                mocks.mockSourceFile(`
                    import { Foo } from "./Bar/Baz";
                `)
            ];

            // Act
            const sourceModule = mocks.mockSourceModule(sourceFiles);

            // Assert
            expect(sourceModule.moduleDependencies).to.be.deep.equal(["/Bar"]);
        });

        it("retrieves two module dependencies", () => {
            // Arrange
            const sourceFiles = [
                mocks.mockSourceFile(`
                    import { Foo } from "./Bar/Baz";
                    import { Qux } from "./Quux/Corge";
                `)
            ];

            // Act
            const sourceModule = mocks.mockSourceModule(sourceFiles);

            // Assert
            expect(sourceModule.moduleDependencies).to.be.deep.equal(["/Bar", "/Quux"]);
        });

        it("ignores duplicate module dependencies", () => {
            // Arrange
            const sourceFiles = [
                mocks.mockSourceFile(`
                    import { Foo } from "./Bar/Baz";
                    import { Qux } from "./Bar/Quux";
                `)
            ];

            // Act
            const sourceModule = mocks.mockSourceModule(sourceFiles);

            // Assert
            expect(sourceModule.moduleDependencies).to.be.deep.equal(["/Bar"]);
        });
    });
});
