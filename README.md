# Typespace

Converts import/require-style TypeScript directories into a unified namespace output.

### Usage

*(to be continued...)*

### Why?

AMD, CommonJS, UMD, and the like are wonderful dependency managers that you should strongly consider using in your project.
However, in some browser applications, it's useful to have a single smaller file without the overhead of `exports` or `require`.

* Video games that require extremely rapid startup times
* Older applications that haven't moved to something like require.js

That's where Typespace comes in.
It takes a full set of directories containing TypeScript files that reference each other using `import` and/or `require`, and combines them into a single `.ts` output file.

### Building

*(to be continued...)*