import _ from "lodash";
import validate from "validate";

export default function () {
    let basic = this.basic;
    let config = this.config;

    let v = new validate({
        input: {
            type: String,
            required: true
        }
    });

    let err = v.validate(_.cloneDeep(basic));
    if (err.length > 0) {
        throw new Error(err[0].message);
    }

    config.input = basic.input;
}