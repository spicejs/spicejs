(function(S) { "use strict";
// Creates a controller
S.controller = (function() {
  var controllers = {};

  function controller(name, callback) {
    controllers[name] = callback;
  }

  controller.all = controllers;
  return controller;
})();

// Binds controller to an element
S.control = (function() {
  var controllers = S.controller.all;

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

S.Observable = function() {
  this._callbacks = {};
};

S.Observable.prototype = {
  on: function(events, fn) {
    var callbacks = this._callbacks;

    if (typeof fn === "function") {
      events.replace(/\S+/g, function(name) {
        (callbacks[name] = callbacks[name] || []).push(fn);
      });
    }

    return this;
  },

  off: function(events, fn) {
    var self = this;

    if (!events || events === "*") {
      self._callbacks = {};
      return this;
    }

    events.replace(/\S+/g, function(name) {
      var i, fns = self._callbacks[name] || [];
      if(!fn) return self._callbacks[name] = [];
      for (i = 0; fns[i]; ++i) if (fns[i] === fn) fns.splice(i, 1);
    });

    return this;
  },

  one: function(name, fn) {
    if (fn) fn.one = true;
    return this.on(name, fn);
  },

  trigger: function(name) {
    var i, fn,
      args = [].slice.call(arguments, 1),
      fns = this._callbacks[name] || [];

    for (i = 0; fn = fns[i]; ++i) {
      if (!fn.busy) {
        fn.busy = true;
        fn.apply(this, args);
        if (fn.one) fns.splice(i--, 1);
        fn.busy = false;
      }
    }

    return this;
  }
};

S.observable = function(object) {
  return merge(object, new S.Observable());
};

function merge(obj, obj2) {
  for (var property in obj2) obj[property] = obj2[property];
  return obj;
}
// Create & Invoque routes
S.route = (function() {
  var map = [], current_path;

  function route(to, trigger) {
    var key;
    if (typeof to === "function") {
      route("*", to);
    } else if (typeof trigger === "function") {
      set(to, trigger);
    } else if (typeof to === "object") {
      for (key in to) to.hasOwnProperty(key) && set(key, to[key]);
    } else visit(to, trigger);
    return route;
  }

  function set(path, callback) {
    var keys = ["path"], regex, key;

    regex = "^\#?\!?" + path
      .replace(/[\/\=\?\$\^]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\{(\w+)\}/g, function(match, key) {
        keys.push(key);
        return "([\\w\\-]+)";
      }) + "$";

    map.push({regex: new RegExp(regex), keys: keys, callback: callback});
  }

  function visit(path, trigger) {
    var size = map.length, i;
    if (current_path === path) return;
    for (i = 0; i < size; i++) executeRoute(path, map[i]);
    if (trigger !== false) route.trigger("visit", path);
    current_path = path;
  }

  function executeRoute(path, router) {
    var matches = path.match(router.regex), callback = router.callback;
    if (!matches || !callback) return;
    if (typeof callback !== "function") return visit(callback, false);
    callback(getParams(path, router.keys, matches))
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
  return S.observable(route);
})();

// Generates a template function
S.template = (function() {
  var cache = {};

  function template(str, data){
    cache[str] = cache[str] || generate(str);
    return data ? cache[str](data) : cache[str];
  }

  function generate(str) {
    var wrap = getWrap(), prefix = wrap[0], sufix = wrap[1];

    return new Function("obj",
      "var p=[];" +
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

})(typeof window !== "undefined" ? window.S = {} : exports);
