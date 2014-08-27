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
      var arr = self._callbacks[name] || [], i;
      if(!fn) return self._callbacks[name] = [];
      for (i = 0; arr[i]; ++i) if (arr[i] === fn) arr.splice(i, 1);
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
