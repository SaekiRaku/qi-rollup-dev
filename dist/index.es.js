import path from 'path';
import _ from 'lodash';
import validate from 'validate';
import { rollup, watch as watch$1 } from 'rollup';

function formats (...types) {
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
      });
    }

    config.output.push({
      name: basic.name,
      file: path.dirname(basic.output) + "/" + path.basename(basic.output, path.extname(basic.output)) + `.${types[i]}` + path.extname(basic.output),
      format: types[i]
    });
  }
}

function init () {
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

// QI-AUTO-EXPORT
var presets = {
  formats,
  init
};

async function build () {
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
  });

  if (!Array.isArray(config.output)) {
    config.output = [config.output];
  }

  for (let i in config.output) {
    let output = config.output[i];
    await bundle.write(output).catch(e => {
    });
  }
}

function clearCache (...paths) {
  if (Array.isArray(paths[0])) {
    paths = paths[0];
  }

  for (let p in paths) {
    for (let cachePath in require.cache) {
      if (paths[p] instanceof RegExp) {
        if (paths[p].test(cachePath)) {
          delete require.cache[cachePath];
        }
      } else if (typeof paths[p] == "string") {
        if (cachePath.indexOf(paths[p]) != -1) {
          delete require.cache[cachePath];
        }
      }
    }
  }
}

function watch (options) {
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

  let watcher = watch$1(config);
  watcher.on("event", evt => {
    options.callback && options.callback(evt);
  });
}

// QI-AUTO-EXPORT
var utils = {
  build,
  clearCache,
  watch
};

class QiRollupDev {
  constructor(basic) {
    this.basic = {
      name: "",
      input: "",
      output: ""
    };
    this.config = {};

    this.presets = (() => {
      let obj = {};
      Object.keys(presets).forEach(key => {
        // Change `this` direction
        obj[key] = (...args) => {
          // Chained
          presets[key].apply(this, args);
          return this.presets;
        };
      });
      return obj;
    })();

    Object.keys(utils).forEach(key => {
      this[key] = utils[key];
    });

    if (basic) {
      if (typeof basic != "object" || Array.isArray(basic)) {
        throw new Error("Wrong type of `basic`, should be Object");
      }

      this.basic = basic;
      this.presets.init();
    }
  }

}

export default QiRollupDev;
