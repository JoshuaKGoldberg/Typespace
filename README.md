# Typespace

Converts import/require-style TypeScript directories into a unified namespace output.

## Why?

AMD, CommonJS, UMD, and the like are wonderful dependency managers that you should strongly consider using in your project.
However, in some browser applications, it's useful to have a single smaller file without the overhead of `exports` or `require`.

* Video games that require extremely rapid startup times
* Older applications that haven't moved to something like require.js

That's where Typespace comes in.
It takes a full set of directories containing TypeScript files that reference each other using `import` and/or `require`, and combines them into a single `.ts` output file.

Sources:
```typescript
// src/Foo.ts
export var value = true;
```

```typescript
// src/Bar.ts
import { Value } from "./Foo";
console.log(`Value: ${value}`);
```

Output:
```typescript
namespace MyProject.Foo {
    export var Value = true;
}

namespace MyProject.Bar {
    import Value = MyProject.Foo.Value;
    console.log(`Value: ${Value}`);
}
```

*(in the future, these will be combined and optimized for a reduced file size)*


## Usage

You can use Typespace via `require`/`import` or on the command-line. There's also a [gulp plugin](https://github.com/joshuakgoldberg/gulp-typespace) for building.

Required arguments/flags:

* `namespace` (`-n`/`--namespace`) - name of the root namespace

Optional arguments/flags:

* `config` (`-c`/`--config`) - input tsconfig.json file path to load files from
* `files` (`-f`/`--files`) - paths of files to include
* `outFile` (`-o`/`--outFile`) - output .ts file path
* `pathPrefix` (`-p`/`--pathPrefix`) - directory root to ignore from module paths
* `root` (`-r`/`--root`) - root path to search for files under


### CLI

First install Typespace with `npm install typespace`.

Specifying files manually:
```cmd
typespace --directory . --root src --outFile dist/combined.ts --files src/Foo.ts src/Bar.ts
```

Specifying files from a TypeScript config file:
```cmd
typespace --directory . --root src --outFile dist/combined.ts --config tsconfig.json
```

### Code

```javascript
const Typespace = require("typespace");

const settings = {
    directory: ".",
    outFile: "dist/combined.ts",
    root: "src",
    files: ["src/Foo.ts", "src/Bar.ts"]
};

const converter = new Typespace(settings);
converter.convert()
    .then((fileContents: string): void => {
        console.log(`Printed to ${settings.outFile}:\n${fileContents}`);
    });
```


## Building

Typespace is built using Gulp.

```cmd
npm install -g gulp-cli
npm install
gulp
```

The primary Gulp tasks are:

* `tslint` - lints source code with TSLint
* `tsc` - compiles source code with TypeScript
* `test` - runs tests
* `watch` - runs Gulp whenever a source or test file changes


### Compilation

Source files are in TypeScript and primarly rely on `async`/`await` programming.
Babel is used for Node compatibility.


### Tests

Tests files are in JavaScript and run with Mocha.
Test coverage for unit tests is computed with Istanbul.
