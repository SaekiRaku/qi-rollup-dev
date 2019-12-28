import path from "path";
import _ from "lodash";
import validate from "validate";

export default function (options = {}) {
    let _options = _.merge(options, {
        disableStrip: true
    })
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

    if (!Array.isArray(config.output)) {
        config.output = [config.output];
    }

    for (let i in config.output) {
        config.output[i].banner = "#!/usr/bin/env node\n"
        if (_options.disableStrip && config.plugins && Array.isArray(config.plugins)) {
            config.plugins.forEach((v, i) => {
                if (v.name == "strip") {
                    config.plugins.splice(i, 1);
                }
            })
        }
    }
}