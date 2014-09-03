if (typeof window !== "undefined") {
  // redirect to route, push state
  S.route.on("visit", function(to) {
    try {
      history.pushState({ edenjs: true }, '', to);
    } catch (err) {
      window.location = to[0] === "#" ? to : "#" + to;
    }
  }).on("load", function() {
    this(location.pathname + location.search + location.hash, false);
  });

  // Mozilla, Opera and webkit nightlies currently support this event
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", S.route.load);

  // If IE event model is used
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function() {
      if (document.readyState === "complete") S.route.load();
    });
  }

  // Popstate event
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.edenjs) S.route.load();
  });
};
