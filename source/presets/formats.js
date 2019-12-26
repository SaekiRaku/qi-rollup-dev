import path from "path";
import _ from "lodash";
import validate from "validate";

export default function (...types) {
    let basic = this.basic;
    let config = this.config;

    let v = new validate({
        name: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        }
    });

    let err = v.validate(_.cloneDeep(basic));
    if (err.length > 0) {
        throw new Error(err[0].message);
    }

    if (!config.output) {
        config.output = [];
    }
    if (!Array.isArray(config.output)) {
        config.output = [config.output];
    }

    if (Array.isArray(types[0])) {
        types = types[0];
    }

    for (let i in types) {
        if (i == 0) {
            config.output.push({
                name: basic.name,
                file: basic.output,
                format: types[i]
            })
        }

        config.output.push({
            name: basic.name,
            file: path.dirname(basic.output) + "/" + path.basename(basic.output, path.extname(basic.output)) + `.${types[i]}` + path.extname(basic.output),
            format: types[i]
        })
    }
}