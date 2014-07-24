// Creates an observable object
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

