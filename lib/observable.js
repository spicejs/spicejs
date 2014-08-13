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
