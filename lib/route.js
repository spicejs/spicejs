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
