const cli = require("../../lib/cli").cli;
const expect = require("chai").expect;

function mockCli(args, onSuccess, onError) {
    const argv = ["node", "./typespace", ...args];
    return cli(argv, onSuccess || (() => {}), onError || (() => {}));
}

describe("CLI", () => {
    it("passes -c", () => {
        // Arrange
        const config = "./tsconfig.json";
        const args = ["-c", config];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.config).to.be.equal(config);
    });

    it("passes --config", () => {
        // Arrange
        const config = "./tsconfig.json";
        const args = ["--config", config];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.config).to.be.equal(config);
    });

    // it("passes -f", () => {
    //     // Arrange
    //     const files = ["foo.ts", "bar.ts"];
    //     const args = ["-f", ...files];

    //     // Act
    //     const typespace = mockCli(args).typespace;

    //     // Assert
    //     expect(typespace.settings.files).to.be.deep.equal(files);
    // });
    
    // it("passes --files", () => {
    //     // Arrange
    //     const files = ["foo.ts", "bar.ts"];
    //     const args = ["--files", ...files];

    //     // Act
    //     const typespace = mockCli(args).typespace;

    //     // Assert
    //     expect(typespace.settings.files).to.be.deep.equal(files);
    // });

    it("passes -n", () => {
        // Arrange
        const namespace = "MyProject";
        const args = ["-n", namespace];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.namespace).to.be.equal(namespace);
    });

    it("passes --namespace", () => {
        // Arrange
        const namespace = "MyProject";
        const args = ["--namespace", namespace];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.namespace).to.be.equal(namespace);
    });

    it("passes -o", () => {
        // Arrange
        const outFile = "out.ts";
        const args = ["-o", outFile];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.outFile).to.be.equal(outFile);
    });

    it("passes --out-file", () => {
        // Arrange
        const outFile = "out.ts";
        const args = ["--out-file", outFile];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.outFile).to.be.equal(outFile);
    });

    it("passes -r", () => {
        // Arrange
        const root = "src";
        const args = ["-r", root];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.root).to.be.equal(root);
    });

    it("passes --root", () => {
        // Arrange
        const root = "src";
        const args = ["-r", root];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.root).to.be.equal(root);
    });

    it("passes -t", () => {
        // Arrange
        const target = "commonjs";
        const args = ["-t", target];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.target).to.be.equal(target);
    });

    it("passes --target", () => {
        // Arrange
        const target = "commonjs";
        const args = ["-t", target];

        // Act
        const typespace = mockCli(args).typespace;

        // Assert
        expect(typespace.settings.target).to.be.equal(target);
    });
});
