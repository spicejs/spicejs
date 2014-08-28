if (typeof Object.create !== 'function') {
  (function () {
    var F = function () {};
    Object.create = function (o) {
      if (typeof o !== 'object') {
        throw TypeError('Argument must be an object');
      }

      F.prototype = o;
      return new F();
    };
  })();
}
