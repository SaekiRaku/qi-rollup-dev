'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var _ = _interopDefault(require('lodash'));
var validate = _interopDefault(require('validate'));
var rollup = require('rollup');
var fs = _interopDefault(require('fs'));

function cli (options = {}) {
  let _options = _.merge(options, {
    disableStrip: true
  });

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
    config.output[i].banner = "#!/usr/bin/env node\n";

    if (_options.disableStrip && config.plugins && Array.isArray(config.plugins)) {
      config.plugins.forEach((v, i) => {
        if (v.name == "strip") {
          config.plugins.splice(i, 1);
        }
      });
    }
  }
}

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
  cli,
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

  let bundle = await rollup.rollup(config).catch(e => {
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

function watch (options = {}) {
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

  let watcher = rollup.watch(config);
  watcher.on("event", evt => {
    var _options$callback, _options;

    (_options$callback = (_options = options).callback) === null || _options$callback === void 0 ? void 0 : _options$callback.call(_options, evt);
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
          fswatcher.push(fs.watch(ext, {
            recursive: true
          }, () => {
            var _options$callback2, _options2;

            (_options$callback2 = (_options2 = options).callback) === null || _options$callback2 === void 0 ? void 0 : _options$callback2.call(_options2, {
              code: "END"
            });
          }));
        }
      }
    }
  }

  return () => {
    watcher.close();

    for (let i in fswatcher) {
      fswatcher[i].close();
    }
  };
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

module.exports = QiRollupDev;
