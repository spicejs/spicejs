(function(E) { "use strict";

E.observable = function(object) {
  var callbacks = {}, slice = [].slice;

  object.on = function(events, fn) {
    if (typeof fn === "function") {
      events.replace(/[^\s]+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn);
        fn.typed = pos > 0;
      });
    }
    return object;
  };

  object.off = function(events, fn) {
    if (events === "*") callbacks = {};
    else if (fn) {
      var arr = callbacks[events];
      for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
        if (cb === fn) arr.splice(i, 1);
      }
    } else {
      events.replace(/[^\s]+/g, function(name) {
        callbacks[name] = [];
      });
    }
    return object;
  };

  // only single event supported
  object.one = function(name, fn) {
    if (fn) fn.one = true;
    return object.on(name, fn);
  };

  object.trigger = function(name) {
    var args = slice.call(arguments, 1),
      fns = callbacks[name] || [];

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = true;
        fn.apply(object, fn.typed ? [name].concat(args) : args);
        if (fn.one) { fns.splice(i, 1); i--; }
        fn.busy = false;
      }
    }

    return object;
  };

  return object;
};
E.render = (function() {
  var FN = {},
    templateEscape = {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"},
    renderEscape = {'&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;'};

  function render(tmpl, data, escapeFn) {
    if (escapeFn === true) escapeFn = defaultEscapeFn;
    tmpl = tmpl || '';

    return (FN[tmpl] = FN[tmpl] || new Function("_", "e", "return '" +
      tmpl.replace(/[\\\n\r']/g, function(char) {
        return templateEscape[char];
      }).replace(/{\s*([\w\.]+)\s*}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'")
    )(data, escapeFn);
  };

  function defaultEscapeFn(str, key) {
    return str == null ? '' : (str+'').replace(/[&\"<>]/g, function(char) {
      return renderEscape[char];
    });
  }

  return render;
}());
E.route = (function() {
  var map = {},
      fnMap = [],
      paramsRegEx = /\{\w+\}/g,
      paramsReplace = "(\\w+)",
      escapeRegEx  = /[\/\=\?\$\^]/g,
      escapeReplace = "\\$&";

  function route(to, callback) {
    if (typeof to === "function") {
      fnMap.push(to);
    } else if (callback || typeof to === "object") {
      set(to, callback);
    } else execute(to);
    return to;
  }

  function set(to, callback) {
    var key;

    if (!callback) {
      for (key in to) to.hasOwnProperty(key) && set(key, to[key]);
      return;
    }

    map[to] = callback;
  }

  function execute(to) {
    map[to] ? map[to]({path: to}) : execMatch(to) || execFn(to);
    route.trigger("execute", to);
  }

  function execMatch(to) {
    var key, matches, matchKeys, regex;

    for (key in map) {
      if (!map.hasOwnProperty(key)) continue;
      matchKeys = key.match(paramsRegEx);
      regex = key
        .replace(escapeRegEx, escapeReplace)
        .replace(paramsRegEx, paramsReplace);

      matches = to.match(new RegExp("^\#?\!?" + regex + "$"));
      if (matches) return map[key](getParams(to, matchKeys, matches));
    }
  }

  function execFn(to) {
    var callbacks = E.route.fnMap, i;
    for (i = 0; i < callbacks.length; i++) callbacks[i](to);
  }

  function getParams(to, keys, values) {
    var params = {path: to}, i;

    for (i = 1; i < values.length; i++) {
      params[keys[i - 1].slice(1, -1).trim()] = values[i];
    }

    return params;
  }

  route.map = map;
  route.fnMap = fnMap;
  return E.observable(route);
})();
// Browser Navigation
if (typeof window !== "undefined") {
  // redirect to route, push state
  E.route.on("execute", function(to) {
    try {
      history.pushState(null, null, to);
    } catch (err) {
      window.location = to[0] === "#" ? to : "#" + to;
    }
  }).on("load", function() {
    this(location.pathname + location.search + location.hash);
  });

  // Mozilla, Opera and webkit nightlies currently support this event
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
      E.route.trigger("load");
    }, false);

  // If IE event model is used
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function() {
      if (document.readyState === "complete") E.route.trigger("load");
    });
  }
}
})(typeof window !== "undefined" ? window.E = {} : exports);
