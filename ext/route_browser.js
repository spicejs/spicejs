(function(exit) { "use strict";
  if (exit) return;

  // redirect to route, push state
  E.route.on("visit", function(to) {
    try {
      history.pushState(null, null, to);
    } catch (err) {
      window.location = to[0] === "#" ? to : "#" + to;
    }
  });

  // load current path
  function load() {
    this(location.pathname + location.search + location.hash);
  };

  // Mozilla, Opera and webkit nightlies currently support this event
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", load);

  // If IE event model is used
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function() {
      if (document.readyState === "complete") load();
    });
  }
})(typeof window === "undefined");
