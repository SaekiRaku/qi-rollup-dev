import _ from "lodash";
import validate from "validate";
import { rollup } from "rollup";

export default async function () {
    let basic = this.basic;
    let config = this.config;

    let v = new validate({
        output: {
            required: true
        }
    });

    let err = v.validate(_.cloneDeep(config));
    if (err.length > 0) {
        throw new Error(err[0].message);
    }

    let bundle = await rollup(config).catch(e => {
        console.error(e);
    });

    if (!Array.isArray(config.output)) {
        config.output = [config.output];
    }

    for (let i in config.output) {
        let output = config.output[i];
        await bundle.write(output).catch(e => {
            console.error(e);
        })
    }
}