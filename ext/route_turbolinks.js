if (typeof Turbolinks !== "undefined") {
  document.addEventListener("page:load", S.route.load);

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.edenjs) Turbolinks.visit(S.route.href);
  });
}
