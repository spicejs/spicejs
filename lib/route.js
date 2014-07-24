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
    var keys = ["match"], regex, key;

    regex = "^\#?\!?" + to
      .replace(/[\/\=\?\$\^]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\{(\w+)\}/g, function(match, key) {
        keys.push(key);
        return "(\\w+)";
      }) + "$";

    map.push({regex: new RegExp(regex), keys: keys, callback: callback});
  }

  function visit(path) {
    var size = map.length, i;
    for (i = 0; i < size; i++) executeRoute(path, map[i]);
    current_path = path;
    route.trigger("visit", path);
  }

  function executeRoute(path, router) {
    var matches = path.match(router.regex);
    if (matches) router.callback(getParams(path, router.keys, matches));
  }

  function getParams(path, keys, values) {
    var params = {path: path}, size = keys.length, i;
    for (i = 0; i < size; i++) params[keys[i]] = values[i];
    return params;
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

  route.map = map;
  route.current_path = current_path;
  return E.observable(route);
})();
