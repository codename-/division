(function() {
  var Division, EventEmitter, Master, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  fs = require('fs');

  Master = require('./Master');

  EventEmitter = require('events').EventEmitter;

  module.exports = Division = (function(_super) {
    var __define,
      _this = this;

    __extends(Division, _super);

    function Division(settings) {
      var __define;
      var __define,
        _this = this;
      __define = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return Object.defineProperty.apply(null, [].concat(_this, args));
      };
      __define("version", {
        enumerable: true,
        value: "0.3.0"
      });
      __define("environment", {
        enumerable: true,
        value: process.env.NODE_ENV || 'development'
      });
      __define("settings", {
        enumerable: true,
        writable: true,
        value: {
          extensions: [],
          size: Math.max(2, require('os').cpus().length)
        }
      });
      __define("master", {
        value: new Master()
      });
      __define("running", {
        writable: true,
        value: false
      });
      this.extend(this.settings, settings);
    }

    __define = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Object.defineProperty.apply(null, [].concat(Division.prototype, args));
    };

    __define("configure", {
      enumerable: true,
      value: function() {
        var environments, fn, _i;
        environments = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), fn = arguments[_i++];
        if (!fn || typeof fn !== 'function') {
          return this;
        }
        if (environments.length === 0 || ~environments.indexOf(this.environment)) {
          fn.call(this);
        }
        return this;
      }
    });

    __define("set", {
      enumerable: true,
      value: function(setting, value) {
        this.settings[setting] = value;
        return this;
      }
    });

    __define("get", {
      enumerable: true,
      value: function(setting) {
        return this.settings[setting];
      }
    });

    __define("enable", {
      enumerable: true,
      value: function(setting) {
        return this.set(setting, true);
      }
    });

    __define("enabled", {
      enumerable: true,
      value: function(setting) {
        return !!this.settings[setting];
      }
    });

    __define("disable", {
      enumerable: true,
      value: function(setting) {
        return this.set(setting, false);
      }
    });

    __define("disabled", {
      enumerable: true,
      value: function(setting) {
        return !this.settings[setting];
      }
    });

    __define("use", {
      enumerable: true,
      value: function() {
        var extension, parameters;
        extension = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (typeof extension === "string") {
          this.settings.extensions.push(extension);
          extension = require(this.resolve(extension));
        }
        extension.apply(this.master, parameters);
        return this;
      }
    });

    __define("run", {
      enumerable: true,
      value: function(fn) {
        var _this = this;
        if (!this.running) {
          this.master.configure(this.settings);
          process.nextTick(function() {
            var counter;
            counter = 0;
            while (counter++ < _this.settings.size) {
              _this.master.spawn();
            }
            if (typeof fn === 'function') {
              return fn.call(_this.master, _this.master);
            }
          });
        }
        this.running = true;
        return this.master;
      }
    });

    __define("resolve", {
      value: (function() {
        var extensions;
        extensions = fs.readdirSync(__dirname + '/extensions').map(function(file) {
          return file.split(".")[0];
        });
        return function(extension) {
          if (extensions.indexOf(extension) > -1) {
            return __dirname + '/extensions/' + extension;
          } else {
            return extension;
          }
        };
      })()
    });

    __define("extend", {
      value: function(target, source) {
        var array, clone, copy, key, src;
        if (typeof target !== "object" && typeof target !== 'function') {
          target = {};
        }
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          copy = source[key];
          if (target === copy) {
            continue;
          }
          if (copy && (this.__object(copy) || (array = this.__array(copy)))) {
            src = target[key];
            if (array) {
              clone = src && this.__array(src) ? src : [];
              array = false;
            } else {
              clone = src && this.__object(src) ? src : {};
            }
            target[key] = this.extend(clone, copy);
          } else if (copy !== void 0) {
            target[key] = copy;
          }
        }
        return target;
      }
    });

    __define("__object", {
      value: function(obj) {
        if (typeof obj !== "object" || obj.nodeType) {
          return false;
        }
        try {
          if (obj.constructor && !Object.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
          }
        } catch (_error) {
          return false;
        }
        return true;
      }
    });

    __define("__array", {
      value: function(array) {
        return Array.isArray.call(array);
      }
    });

    return Division;

  }).call(this, EventEmitter);

}).call(this);
