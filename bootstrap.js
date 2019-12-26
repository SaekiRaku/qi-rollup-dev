
import constructor from "./constructor";

const command = process.argv[2];

switch (command) {
    case "develop":
        constructor.dev((evt) => {
            if (evt.code == "ERROR") {
                console.error(evt);
                return;
            }
            if (evt.code == "END") {
                for (let i in require.cache) {
                    if (i.indexOf(__dirname) != -1 && /(source|dist|example)/.test(i)) {
                        delete require.cache[i]
                    }
                }
                require("./example/index.js");
            }
        });
    case "build":
        constructor.build();
        break;
}