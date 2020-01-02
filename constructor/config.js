import path from "path";

import strip from "@rollup/plugin-strip";
import babel from 'rollup-plugin-babel';

import common from "../common";

const name = "QiRollupDev";

const output = [{
        name,
        format: "cjs",
        file: path.resolve(common.path.DIST, "index.js")
    },
    {
        name,
        format: "esm",
        file: path.resolve(common.path.DIST, "index.es.js")
    }
]

const external = ["rollup", "fs", "path", "lodash", "validate"]

const plugins = [
    babel(),
    strip()
]

export default {
    input: path.resolve(common.path.SOURCE, "index.js"),
    output,
    external,
    plugins
}