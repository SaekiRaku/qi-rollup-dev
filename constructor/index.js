import {
    rollup,
    watch
} from "rollup"
import auto from "./auto.js";
import config from "./config.js";

export default {
    dev(callback) {
        auto["export"].watch();
        auto["export"].addEventListener("done", done);

        function done() {
            auto["export"].removeEventListener("done", done);
            let watcher = watch(config);
            watcher.on("event", (evt) => {
                callback(evt);
            });
        }
    },
    build() {
        auto["export"].once();
        auto["export"].addEventListener("done", done);

        async function done() {
            auto["export"].removeEventListener("done", done);
            let bundle = await rollup(config).catch(e => {
                console.error(e);
            });

            for (let i in config.output) {
                let output = config.output[i];
                await bundle.write(output).catch(e => {
                    console.error(e);
                })
            }
        }
    }
}