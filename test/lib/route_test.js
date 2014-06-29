describe("#route", function() {
  it("set routes", function() {
    E.route("a", 1);
    E.route({b: 2, c: 3});

    assert.deepEqual(E.route.map, {a: 1, b: 2, c: 3})
  });

  it("matches a route", function() {
    assertRoute("/home", "/home");
    assertRoute("/items/{item}", "/items/debby");
    assertRoute("/items/{item}", "#/items/debby");
    assertRoute("/items/{item}", "#!/items/debby");
    assertRoute(".*/items", "/hi/items");
    assertRoute(".*/items", "/some/regex/items");
    assertRoute(".*/items", "/items");
  });

  it("works with the old generic routes", function() {
    var count = 0, routes = [];
    E.route(function(path){ count++; routes.push(path) });
    E.route(function(path){ count++ });
    E.route(function(path){ count++ });

    E.route("/any_randow_route") && assert.equal(count, 3);
    E.route("/other_randow_route") && assert.equal(count, 6);
    assert.deepEqual(routes, ["/any_randow_route", "/other_randow_route"])
  });

  it("matches the params", function() {
    assertRoute("/items?search={q}", "/items?search=hi",
      {path: "/items?search=hi", q: "hi"});

    assertRoute("/items/{item}/{id}", "/items/debby/2",
      {path: "/items/debby/2", item: "debby", id: "2"});

    assertRoute(".*/{item}/{id}", "/my/crazy/cart/debby/2",
      {path: "/my/crazy/cart/debby/2", item: "debby", id: "2"});
  });

  function assertRoute(route, path, params) {
    var received = false;
    E.route(route, function(p) {
      received = true
      params && assert.deepEqual(p, params)
    });

    E.route(path);
    assert(received, "Invalid route to => " + path);
  }

});
