(function(exit) { "use strict";
  if (exit) return;

  // load current path
  function load() {
    E.route(location.pathname + location.search + location.hash);
  }

  // bind events
  E.route.on("visit", function(path) { Turbolinks.visit(path) });
  document.addEventListener("page:load", load);
  document.addEventListener("DOMContentLoaded", load);
})(typeof Turbolinks === "undefined");
