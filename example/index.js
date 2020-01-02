import QiRollupDev from "../dist/index.js";

import strip from "@rollup/plugin-strip";

const dev = new QiRollupDev({
    name: "ModuleName",
    input: __dirname + "/src/index.js",
    output: __dirname + "/dist/index.js"
});

dev.config.plugins = [strip()];

dev.presets.formats("cjs", "esm").cli();

console.log(dev.config);

dev.watch({
    extra: __dirname,
    // this property can add extra files or directory(recursive) to be watched
    callback(evt) {
        if (evt.code == "ERROR") {
            console.error(evt);
            return;
        }
        if (evt.code == "END") {
            // Delete the require cache of NodeJS when `rollup` finish rebuild, and then reload the example/test code.
            // So that you will get the ability of hot-reload for NodeJS development.
            // Try to start up this example code and modify the `src/index.js` and see what will happen.
            dev.clearCache(__dirname);
            require("./example.js");
        }
    }
});