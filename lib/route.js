E.route = (function() {
  var map = [];

  function route(to, callback) {
    var key;
    if (typeof to === "function") {
      route("*", to);
    } else if (callback) {
      set(to, callback);
    } else if (typeof to === "object") {
      for (key in to) to.hasOwnProperty(key) && set(key, to[key]);
    } else execute(to);
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

  function execute(to) {
    var size = map.length, i;
    for (i = 0; i < size; i++) execRoute(to, map[i]);
    route.trigger("execute", to);
  }

  function execRoute(to, router) {
    var matches = to.match(router.regex);
    if (matches) router.callback(getParams(to, router.keys, matches));
  }

  function getParams(to, keys, values) {
    var params = {path: to}, size = keys.length, i;
    for (i = 0; i < size; i++) params[keys[i]] = values[i];
    return params;
  }

  route.map = map;
  route.clear = function() { map = []; return route; };
  return E.observable(route);
})();
