// Creates a controller
E.controller = (function() {
  var controllers = {};

  function controller(name, callback) {
    controllers[name] = callback;
  }

  controller.all = controllers;
  return controller;
})();

// Binds controller to an element
E.control = (function() {
  var controllers = E.controller.all;

  function control(name, element, options) {
    add(controllers[name], element, options);
    return element;
  }

  function add(callback, element, options) {
    if (!callback || has(callback, element)) return;
    callback._elements.push(element);
    callback(element, options);
  }

  function has(callback, element) {
    callback._elements = callback._elements || [];
    return callback._elements.indexOf(element) !== -1;
  }

  return control;
})();

