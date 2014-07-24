(function(E){ "use strict";
  var controllers = {};

  E.controller = function(name, callback) {
    controllers[name] = callback;
  };

  E.control = function(name, element, options) {
    if(hasElement(name, element)) return element;
    addElement(name, element);

    controllers[name](element, options);
    return element;
  };

  function addElement(name, element) {
    controllers[name]._elements.push(element);
  }

  function hasElement(name, element) {
    var callback = controllers[name];
    callback._elements = callback._elements || [];
    return callback._elements.indexOf(element) !== -1;
  }
})(typeof window !== "undefined" ? window.E = {} : exports);
