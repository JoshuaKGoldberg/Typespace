const expect = require("chai").expect;
const ts = require("typescript");
const SourceFile = require("../../../lib/Reading/SourceFile").SourceFile;
const SourceFilePrinter = require("../../../lib/Writing/SourceFilePrinter").SourceFilePrinter;

const mocks = {
    mockNodes: source => ts.createSourceFile("mock.ts", source, ts.ScriptTarget.ES2015, true).statements,
    mockSourceFile: (source, fileName) => new SourceFile(fileName || "mock.ts", mocks.mockNodes(source)),
    mockSourceFilePrinter: (source) => new SourceFilePrinter(
        mocks.mockSourceFile(source),
        source,
        {
            // ...
        })
};

describe("SourceFilePrinter", () => {
    describe("getBody", () => {
        it("prints a file's body", () => {
            // Arrange
            const body = `console.log("Foo");`
            const sourceFilePrinter = mocks.mockSourceFilePrinter(body);

            // Act
            const printed = sourceFilePrinter.getBody();

            // Assert
            expect(printed).to.be.equal(body);
        });

        it("excludes import nodes", () => {
            // Arrange
            const imports = 'import { Foo } from "./Bar";';
            const body = `console.log("Baz");`
            const sourceFilePrinter = mocks.mockSourceFilePrinter(imports + "\n\n" + body);

            // Act
            const printed = sourceFilePrinter.getBody();

            // Assert
            expect(printed).to.be.equal(body);
        });
    });

    describe("getImports", () => {
        it("prints a file's imports", () => {
            // Arrange
            const imports = `import { Foo } from "./Bar/Baz";`
            const sourceFilePrinter = mocks.mockSourceFilePrinter(imports);

            // Act
            const printed = sourceFilePrinter.getImports();

            // Assert
            expect(printed).to.be.deep.equal(["import Foo = Bar.Foo;"]);
        });

        it("excludes body nodes", () => {
            // Arrange
            const imports = 'import { Foo } from "./Bar/Baz";';
            const body = `console.log("Qux");`
            const sourceFilePrinter = mocks.mockSourceFilePrinter(imports + "\n\n" + body);

            // Act
            const printed = sourceFilePrinter.getImports();

            // Assert
            expect(printed).to.be.deep.equal(["import Foo = Bar.Foo;"]);
        });

        it("excludes local imports", () => {
            // Arrange
            const imports = 'import { Foo } from "./Bar";';
            const body = `console.log("Baz");`
            const sourceFilePrinter = mocks.mockSourceFilePrinter(imports + "\n\n" + body);

            // Act
            const printed = sourceFilePrinter.getImports();

            // Assert
            expect(printed).to.be.deep.equal([]);
        });
    })
});

