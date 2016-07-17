const ts = require("typescript");
const expect = require("chai").expect;
const SourceFile = require("../../../lib/Reading/SourceFile").SourceFile;

const mocks = {
    mockNodes: source => ts.createSourceFile("mock.ts", source, ts.ScriptTarget.ES2015, true).statements,
    mockSourceFile: (source, fileName) => new SourceFile(fileName || "mock.ts", mocks.mockNodes(source))
}

describe("SourceFile", () => {
    describe("fileDependencies", () => {
        it("retrieves a single file dependency", () => {
            // Arrange
            const fileNames = ["Foo"];
            const source = `import { Baz } from "./${fileNames[0]}";`;

            // Act
            const sourceFile = mocks.mockSourceFile(source);

            // Assert
            expect(sourceFile.fileDependencies).to.be.deep.equal(fileNames);
        });

        it("retrieves two file dependencies", () => {
            // Arrange
            const fileNames = ["Foo", "Bar"];
            const source = `
                import { Baz } from "./${fileNames[0]}";
                import { Qux } from "./${fileNames[1]}";
            `;

            // Act
            const sourceFile = mocks.mockSourceFile(source);

            // Assert
            expect(sourceFile.fileDependencies).to.be.deep.equal(fileNames);
        });

        it("ignores duplicate file dependencies", () => {
            // Arrange
            const fileNames = ["Foo", "Bar"];
            const source = `
                import { Baz } from "./${fileNames[0]}";
                import { Qux } from "./${fileNames[1]}";
                import { Quux } from "./${fileNames[1]}";
            `;

            // Act
            const sourceFile = mocks.mockSourceFile(source);

            // Assert
            expect(sourceFile.fileDependencies).to.be.deep.equal(fileNames);
        });
    });

    describe("moduleDependencies", () => {
        it("retrieves root module dependencies", () => {
            // Arrange
            const imports = ["Foo"];
            const source = `import { ${imports[0]} } from "../Bar";`;

            // Act
            const sourceFile = mocks.mockSourceFile(source, "Baz/Qux.ts");

            // Assert
            expect(Array.from(sourceFile.moduleDependencies[""])).to.be.deep.equal(imports);
        });

        it("retrieves parent module dependencies", () => {
            // Arrange
            const imports = ["Foo"];
            const source = `import { ${imports[0]} } from "../Bar";`;

            // Act
            const sourceFile = mocks.mockSourceFile(source, "Baz/Qux/Quux.ts");

            // Assert
            expect(Array.from(sourceFile.moduleDependencies["Baz"])).to.be.deep.equal(imports);
        });

        it("retrieves child module dependencies", () => {
            // Arrange
            const imports = ["Foo"];
            const source = `import { ${imports[0]} } from "./Bar/Baz";`;

            // Act
            const sourceFile = mocks.mockSourceFile(source, "Qux.ts");

            // Assert
            expect(Array.from(sourceFile.moduleDependencies["/Bar"])).to.be.deep.equal(imports);
        });

        it("retrieves externally imported dependencies", () => {
            // Arrange
            const imports = ["Foo"];
            const source = `import { ${imports[0]} } from "Bar";`;

            // Act
            const sourceFile = mocks.mockSourceFile(source, "Baz.ts");

            // Assert
            expect(Array.from(sourceFile.moduleDependencies["Bar"])).to.be.deep.equal(imports);
        });
    });
});
