// Creates a controller
E.controller = (function() {
  var controllers = {};

  function controller(name, callback) {
    controllers[name] = callback;
  };

  controller.all = controllers;
  return controller;
})();

// Binds controller to an element
E.control = (function() {
  var controllers = E.controller.all;

  function control(name, element, options) {
    hasElement(name, element) ||
      addContol(name, element, options);

    return element;
  };

  function addContol(name, element, options) {
    controllers[name]._elements.push(element);
    controllers[name](element, options);
  }

  function hasElement(name, element) {
    var callback = controllers[name];
    callback._elements = callback._elements || [];
    return callback._elements.indexOf(element) !== -1;
  }

  return control;
})();

