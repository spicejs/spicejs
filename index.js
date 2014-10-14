(function(S) { "use strict";
S.observable = function(object) {
  return merge(object, S.observable.proto.create());
};

S.observable.proto = {
  _callbacks: {},

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
      self._callbacks = Object.create(this._parent._callbacks);
      return this;
    }

    events.replace(/\S+/g, function(name) {
      var i, fns = self._callbacks[name] || [];
      if(!fn) return self._callbacks[name] = [];
      for (i = 0; fns[i]; ++i) if (fns[i] === fn) fns.splice(i, 1);
    });

    return this;
  },

  one: function(events, fn) {
    if (fn) fn.one = true;
    return this.on(events, fn);
  },

  trigger: function(name) {
    var i, fn,
      args = [].slice.call(arguments, 1),
      fns = this._callbacks[name] || [];

    for (i = 0; fn = fns[i]; ++i) {
      fn.apply(this, args);
      if (fn.one) fns.splice(i--, 1);
    }

    return this;
  },

  set: function(attr, value) {
    var oldValue = this[attr];
    this[attr] = value;
    this.trigger("set", attr, value, oldValue).trigger(attr, value, oldValue);
    return this;
  },

  get: function(attr) {
    return this[attr];
  },

  create: function(object) {
    object = object || {};
    object._parent = this;
    object._callbacks = Object.create(this._callbacks);
    return merge(Object.create(this), object);
  }
};

function merge(obj, obj2) {
  for (var property in obj2) obj[property] = obj2[property];
  return obj;
}
// Generates a template function
S.template = (function() {
  var cache = {};

  function template(str, data){
    str = str.trim();
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

// Create & Invoque routes
S.route = (function() {
  var map = [];

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
    for (i = 0; i < size; i++) executeRoute(path, map[i]);
    if (trigger !== false) route.trigger("visit", path);
    route.href = path;
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
        return route.href.replace(/\?.*/g, "") + path;
      case "&":
        return route.href.replace(/\&.*/g, "") + path;
      case "#":
        return route.href.replace(/\#.*/g, "") + path;
      default:
        return path;
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

// Creates a controller
S.controller = (function() {
  function controller(name, callback) {
    controller.on(name, callback);
  }

  return S.observable(controller);
})();

// Binds controller to an element
S.control = (function() {
  function control(name, element, options) {
    has(name, element) || S.controller.trigger(name, element, options);
    return element;
  }

  function has(name, element) {
    var attr = control.prefix + name;
    if (element[attr]) return true;
    element[attr] = true;
    return false;
  }

  control.prefix = "_control_";
  return control;
})();

})(typeof window !== "undefined" ? window.S = {} : exports);
