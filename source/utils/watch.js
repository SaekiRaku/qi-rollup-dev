import _ from "lodash";
import validate from "validate";
import {
    watch
} from "rollup";

export default function (options) {
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
        options.callback && options.callback(evt);
    });
}