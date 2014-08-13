(function(E) { "use strict";
// Creates a controller
E.controller = (function() {
  var controllers = {};

  function controller(name, callback) {
    controllers[name] = callback;
  }

  controller.all = controllers;
  return controller;
})();

// Binds controller to an element
E.control = (function() {
  var controllers = E.controller.all;

  function control(name, element, options) {
    add(controllers[name], element, options);
    return element;
  }

  function add(callback, element, options) {
    if (!callback || has(callback, element)) return;
    callback._elements.push(element);
    callback(element, options);
  }

  function has(callback, element) {
    callback._elements = callback._elements || [];
    return callback._elements.indexOf(element) !== -1;
  }

  return control;
})();

E.Observable = function() { };

E.Observable.prototype = {
  on: function(events, fn) {
    var callbacks = this._callbacks;

    if (typeof fn === "function") {
      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn);
        fn.typed = pos > 0;
      });
    }

    return this;
  },

  off: function(events, fn) {
    var self = this, arr = self._callbacks[events], i, cb;

    if (!events || events === "*") {
      self._callbacks = {};
    } else if (fn) {
      for (i = 0, cb; (cb = arr && arr[i]); ++i) {
        if (cb === fn) arr.splice(i, 1);
      }
    } else {
      events.replace(/\S+/g, function(name) { self._callbacks[name] = []; });
    }

    return this;
  },

  one: function(name, fn) {
    if (fn) fn.one = true;
    return this.on(name, fn);
  },

  trigger: function(name) {
    var args = [].slice.call(arguments, 1),
    fns = this._callbacks[name] || [];

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = true;
        fn.apply(this, fn.typed ? [name].concat(args) : args);
        if (fn.one) { fns.splice(i, 1); i--; }
        fn.busy = false;
      }
    }

    return this;
  },
};

E.observable = function(object) {
  var property, proto ;
  object._callbacks = {};
  object._observable = new E.Observable();

  for (property in E.Observable.prototype) {
    object[property] = object._observable[property];
  }

  return object;
};
// Create & Invoque routes
E.route = (function() {
  var map = [], current_path;

  function route(to, callback) {
    var key;
    if (typeof to === "function") {
      route("*", to);
    } else if (callback) {
      set(to, callback);
    } else if (typeof to === "object") {
      for (key in to) to.hasOwnProperty(key) && set(key, to[key]);
    } else visit(to);
    return route;
  }

  function set(to, callback) {
    var keys = ["path"], regex, key;

    regex = "^\#?\!?" + to
      .replace(/[\/\=\?\$\^]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\{(\w+)\}/g, function(match, key) {
        keys.push(key);
        return "(\\w+)";
      }) + "$";

    map.push({regex: new RegExp(regex), keys: keys, callback: callback});
  }

  function visit(path, trigger) {
    var size = map.length, i;
    if (current_path === path) return;
    for (i = 0; i < size; i++) executeRoute(path, map[i]);
    if (trigger === false) return;
    current_path = path;
    route.trigger("visit", path);
  }

  function executeRoute(path, router) {
    var matches = path.match(router.regex), callback = router.callback;
    if (!matches || !callback) return;

    (typeof callback === "function") ?
      callback(getParams(path, router.keys, matches)) :
      visit(callback, false);
  }

  function getParams(path, keys, values) {
    var params = {}, size = keys.length, i;
    for (i = 0; i < size; i++) params[keys[i]] = values[i];
    return params;
  }

  function replacePath(path) {
    switch(path[0]) {
      case "?":
        return current_path.replace(/\?.*/g, "") + path;
      case "&":
        return current_path.replace(/\&.*/g, "") + path;
      case "#":
        return current_path.replace(/\#.*/g, "") + path;
    }
  }

  route.clear = function() {
    map = [];
    route.trigger("clear");
    return route;
  };

  route.load = function() {
    route.trigger("load");
    return route;
  };

  route.update = function(path, visitable) {
    path = replacePath(path);
    visitable === false ? route.trigger("visit", path) : visit(path);
  };

  route.map = map;
  return E.observable(route);
})();

// Generates a template function
E.template = (function() {
  var cache = {};

  function template(str, data){
    cache[str] = cache[str] || generate(str);
    return data ? cache[str](data) : cache[str];
  }

  function generate(str) {
    var wrap = getWrap(), prefix = wrap[0], sufix = wrap[1];

    return new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" + str
        .replace(/[\r\t\n]/g, " ")
        .split(prefix).join("\t")
        .replace(new RegExp("((^|" + sufix +")[^\t]*)'", "g"), "$1\r")
        .replace(new RegExp("\t=(.*?)" + sufix, "g"), "',$1,'")
        .split("\t").join("');")
        .split(sufix).join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");
  }

  function getWrap() {
    return (typeof template.wrapper === "string") ?
      template.wrapper = template.wrapper.replace(/\s+/, "").split("?") :
      template.wrapper;
  }

  template.wrapper = "<%?%>";
  return template;
}());

})(typeof window !== "undefined" ? window.E = {} : exports);
