if (typeof window !== "undefined") {
  // redirect to route, push state
  E.route.on("visit", function(to) {
    try {
      history.pushState({ edenjs: true }, '', to);
    } catch (err) {
      window.location = to[0] === "#" ? to : "#" + to;
    }
  }).on("load", function() {
    this(location.pathname + location.search + location.hash);
  });

  // Mozilla, Opera and webkit nightlies currently support this event
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", E.route.load);

  // If IE event model is used
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function() {
      if (document.readyState === "complete") E.route.load();
    });
  }

  // Popstate event
  window.addEventListener('popstate', function (e) {
    if (e.state !== null && e.state['edenjs']) {
      E.route.load();
    }
  });
};
