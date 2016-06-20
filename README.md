# Typespace

Converts import/require-style TypeScript directories into a unified namespace output.

### Usage

*(to be continued...)*

### Why?

AMD, CommonJS, UMD, and the like are wonderful dependency managers that you should strongly consider using in your project.
However, in some situations, it's useful to have a single smaller file without the overhead of `exports` or `require`.

* High-performance startup situations such as video games
* Older browser projects that haven't moved to require.js

That's where Typespace comes in.
It takes a full set of directories containing TypeScript files that reference each other using `import` and/or `require`, and combines them into a single `.ts` output file.

### Building

*(to be continued...)*