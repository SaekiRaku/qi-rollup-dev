import QiAuto from "@qiqi1996/qi-auto";
import common from "../common";

const config = {
    "export": {
        directory: common.path.SOURCE,
        module: "export",
        options: {
            type: "esm"
        }
    }
}

const qiauto = new QiAuto(config)

export default qiauto;