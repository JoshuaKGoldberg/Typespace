const expect = require("chai").expect;
const fs = require("fs");
const Typespace = require("../../lib/main");
const tsConfig = JSON.parse(fs.readFileSync("./test/end-to-end/tsconfig.json").toString());
const expected = fs.readFileSync("./test/end-to-end/dist/TestProject.ts").toString();

describe("CLI", () => {});

describe("Code", () => {
    it("runs with files", () => {
        // Arrange
        const settings = {
            files: tsConfig.files,
            namespace: "TestProject",
            pathPrefix: "src",
            root: "test/end-to-end/"
        };
        const converter = new Typespace(settings);

        // Act
        const conversion = converter.convert();

        // Assert
        return conversion.then(fileContents => {
            expect(fileContents).to.be.equal(expected);
        });
    });

    it("runs with a tsconfig.json", () => {
        // Arrange
        const settings = {
            config: "./test/end-to-end/tsconfig.json",
            namespace: "TestProject",
            pathPrefix: "src",
            root: "test/end-to-end/"
        };
        const converter = new Typespace(settings);

        // Act
        const conversion = converter.convert();

        // Assert
        return conversion.then(fileContents => {
            expect(fileContents).to.be.equal(expected);
        });
    });
});
