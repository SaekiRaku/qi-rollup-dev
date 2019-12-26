import QiRollupDev from "../dist/index.js";

const dev = new QiRollupDev({
    name: "ModuleName",
    input: __dirname + "/src/index.js",
    output: __dirname + "/dist/index.js"
});

dev.presets.formats("cjs", "esm")
dev.watch({
    callback(evt) {
        console.log(evt);
    }
});