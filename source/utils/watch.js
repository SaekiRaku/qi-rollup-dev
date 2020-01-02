import fs from "fs";
import _ from "lodash";
import validate from "validate";
import {
    watch
} from "rollup";

export default function (options = {}) {
    options = _.cloneDeep(options);
    let basic = this.basic;
    let config = this.config;

    let v = new validate({
        input: {
            required: true
        }
    });

    let err = v.validate(_.cloneDeep(config));
    if (err.length > 0) {
        throw new Error(err[0].message);
    }

    let watcher = watch(config);
    watcher.on("event", (evt) => {
        options.callback?.(evt);
    });

    let fswatcher = [];
    if (options.extra) {
        if (typeof options.extra == "function") {
            options.extra = options.extra();
        }
        if (typeof options.extra == "string") {
            options.extra = [options.extra];
        }
        if (Array.isArray(options.extra)) {
            for (let i in options.extra) {
                let ext = options.extra[i];
                if (typeof ext == "function") {
                    ext = ext();
                }
                if (typeof ext == "string") {
                    fswatcher.push(
                        fs.watch(ext, { recursive: true }, () => {
                            options.callback?.({ code: "END" });
                        })
                    );
                }
            }
        }
    }

    return () => {
        watcher.close();
        for (let i in fswatcher) {
            fswatcher[i].close();
        }
    }
}