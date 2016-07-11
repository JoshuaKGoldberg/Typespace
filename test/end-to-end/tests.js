const expect = require("chai").expect;
const fs = require("fs");
const Typespace = require("../../lib/main");

function createConversion(name) {
    const configPath = `./test/end-to-end/${name.toLowerCase()}/tsconfig.json`;

    return {
        config: JSON.parse(fs.readFileSync(configPath).toString()),
        configPath: configPath,
        expected: fs.readFileSync(`./test/end-to-end/${name.toLowerCase()}/dist/${name}.ts`).toString()
    }
}

const conversions = {
    core: createConversion("Core"),
    external: createConversion("External")
};

describe("CLI", () => {});

describe("Code", () => {
    it("runs with files", () => {
        // Arrange
        const settings = {
            files: conversions.core.config.files,
            namespace: "Core",
            pathPrefix: "src",
            root: "test/end-to-end/core/"
        };
        const converter = new Typespace(settings);

        // Act
        const conversion = converter.convert();

        // Assert
        return conversion.then(fileContents => {
            expect(fileContents).to.be.equal(conversions.core.expected);
        });
    });

    it("runs with a tsconfig.json", () => {
        // Arrange
        const settings = {
            config: conversions.core.configPath,
            namespace: "Core",
            pathPrefix: "src",
            root: "test/end-to-end/core/"
        };
        const converter = new Typespace(settings);

        // Act
        const conversion = converter.convert();

        // Assert
        return conversion.then(fileContents => {
            expect(fileContents).to.be.equal(conversions.core.expected);
        });
    });

    it("converts external modules to namespaces", () => {
        // Arrange
        const settings = {
            config: conversions.external.configPath,
            namespace: "External",
            pathPrefix: "src",
            root: "test/end-to-end/external/"
        };
        const converter = new Typespace(settings);

        // Act
        const conversion = converter.convert();

        // Assert
        return conversion.then(fileContents => {
            expect(fileContents).to.be.equal(conversions.external.expected);
        });
    });
});
