// Creates a controller
S.controller = (function() {
  function controller(name, callback) {
    controller.on(name, callback);
  }

  return S.observable(controller);
})();

// Binds controller to an element
S.control = (function() {
  function control(name, element, options) {
    has(name, element) || S.controller.trigger(name, element, options);
    return element;
  }

  function has(name, element) {
    var attr = control.prefix + name;
    if (element[attr]) return true;
    element[attr] = true;
    return false;
  }

  control.prefix = "_control_";
  return control;
})();

