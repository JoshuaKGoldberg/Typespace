const expect = require("chai").expect;
const ts = require("typescript");
const OutputTransformer = require("../../../lib/Writing/OutputTransformer").OutputTransformer;

const mocks = {
    mockOutputTransformer: () => new OutputTransformer()
};

describe("OutputTransformer", () => {
    describe("transform", () => {
        it("transforms with a known transform", () => {
            // Arrange
            const transformer = mocks.mockOutputTransformer();
            const contents = "module Test { }";
            const settings = {
                target: "none"
            };

            // Act
            const output = transformer.transform(contents, settings);

            // Assert
            expect(output).to.be.equal(contents);
        });

        it("throws an error on an unknown transform", () => {
            // Arrange
            const transformer = mocks.mockOutputTransformer();
            const contents = "module Test { }";
            const settings = {
                target: "unknown"
            };

            // Act & assert
            expect(() => transformer.transform(contents, settings)).to.throw();
        });
    });

    describe("transformToCommonJs", () => {
        it("appends a conditional module.exports setter", () => {
            // Arrange
            const transformer = mocks.mockOutputTransformer();
            const contents = "module Test { }";
            const settings = {
                namespace: "Test",
                target: "commonjs"
            };

            // Act
            const output = transformer.transform(contents, settings);

            // Assert
            expect(output).to.be.equal(contents + [
                `\n`,
                `declare var module: any;`,
                `if (typeof module !== "undefined" && typeof module.exports !== "undefined") {`,
                `   module.exports = ${settings.namespace};`,
                `}`
            ].join("\n"));
        });
    })
});
