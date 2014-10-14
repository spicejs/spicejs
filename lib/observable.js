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
