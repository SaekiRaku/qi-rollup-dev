# Qi Rollup Dev

Provide useful preset configs and tool functions for `rollup`, just like a start-up template but with more controllability. The main goal of this project is reduce the time for design development environment.

**NOTICE: This project is experimental, use at your own risk if you'd like use it for production purpose.**

## Features

* ~~Out of the box of preset configs covered for most common useage of `rollup`.~~ (Only library development by now.)

## Todo

* Add preset for `typescript`

## Useage

This project didn't have complicated functions, so I'm just going to provide some example code.

### Case 1 - Node library

Only 5 lines of core code to create a framework for NodeJS library development.

```javascript
const QiRollupDev = require("@qiqi1996/qi-rollup-dev");

// Create instance and provide basic info of project.
var dev = new QiRollupDev({ name: "LibraryName", input: "/path/to/entry.js", output: "/path/to/output.js" });

// Add output config for `rollup` that can output two type of modules(CommonJS & ESModules).
// It will generate 3 files at last, which are `output.js(CommonJS, cause it's the first argument)`, `output.cjs.js(CommonJS)`, `output.esm.js(ESModule)`.
dev.presets.formats("cjs", "esm");

// You can check(or modify) the final config of rollup by this:
// dev.config.plugins = [ babel(), strip(), ... ]
// console.log(dev.config);

// Auto rebuild when code changed. For `evt` object, see: http://rollupjs.org/guide/en/#rollupwatch
dev.watch({ callback: (evt) => { "Do something..." } });

// Bundle up the whole project.
dev.build();
```

### More Cases

See example code [Go→](./example/)

## License

MIT

Copyright 2019(c), qiqi1996.com. All right reserved.