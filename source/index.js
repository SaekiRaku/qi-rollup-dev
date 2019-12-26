import presets from "./presets/index.js";
import utils from "./utils/index.js";

class QiRollupDev {

    constructor(basic) {
        Object.keys(utils).forEach((key) => {
            this[key] = utils[key];
        })

        if (basic) {
            if (typeof basic != "object" || Array.isArray(basic)) {
                throw new Error("Wrong type of `basic`, should be Object");
            }
            this.basic = basic;
            this.presets.init();
        }
    }

    basic = {
        name: "",
        input: "",
        output: "",
    }

    config = {};

    presets = (() => {
        let obj = {};
        Object.keys(presets).forEach((key) => {
            // Change `this` direction
            obj[key] = (...args) => {
                // Chained
                presets[key].apply(this, args);
                return this.presets;
            }
        })
        return obj;
    })();
}

export default QiRollupDev;