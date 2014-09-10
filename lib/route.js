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

