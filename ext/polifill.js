if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    if (typeof o !== 'object') throw TypeError('Argument must be an object');
    function F() {};
    F.prototype = o;
    return new F();
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
