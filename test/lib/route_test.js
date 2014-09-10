describe("#route", function() {
  it("sets many routes at once", function() {
    S.route({a: 1, b: 2, c: 3});

    assert.deepEqual(S.route.map, [
      {regex: {}, keys: ["path"], callback: 1},
      {regex: {}, keys: ["path"], callback: 2},
      {regex: {}, keys: ["path"], callback: 3} ]);
  });

  it("matches a route", function() {
    assertRoute("/home", "/home");
    assertRoute("/items/{item}", "/items/debby");
    assertRoute("/items/{item}", "/items/Judo_gi");
    assertRoute("/items/{item}", "/items/judo-gi");
    assertRoute("/items/{item}", "/items/jiu-Jitsu_gi");
    assertRoute("/items/{item}", "#/items/debby");
    assertRoute("/items/{item}", "#!/items/debby");
    assertRoute("*/items", "/hi/items");
    assertRoute("*/items", "/some/regex/items");
    assertRoute("*/items", "/items");
  });

  it("setts and alias route", function(){
    var count = 0, fn = function(){ count++ };
    S.route({
      "/my_route": fn,
      "/alias_route": "/my_route"
    }).on("visit", fn);

    S.route("/alias_route") && assert.equal(count, 2);
  });

  it("works with generic routes", function() {
    var count = 0;
    S.route(function(){ count++ });
    S.route(function(){ count++ });
    S.route(function(){ count++ });

    S.route("/any_randow_route") && assert.equal(count, 3);
    S.route("/other_randow_route") && assert.equal(count, 6);
  });

  it("triggers all routes that matches the path", function() {
    var count = 0, fn = function(){ count++ };
    S.route.clear();
    S.route(fn); S.route({"/my*": fn, "/my/way": fn, "*": fn});

    S.route("/my/way");
    assert.equal(count, 4);
  });

  it("updates the current route", function() {
    var current;
    S.route(function(params){ current = params.path; });
    S.route("/items");

    S.route.update("?search=eden");
    assert.equal(current, "/items?search=eden");

    S.route.update("?search=pool");
    assert.equal(current, "/items?search=pool");

    S.route.update("&id=1");
    assert.equal(current, "/items?search=pool&id=1");

    S.route.update("#hash");
    assert.equal(current, "/items?search=pool&id=1#hash");

    S.route.update("#hash2");
    assert.equal(current, "/items?search=pool&id=1#hash2");

    S.route.update("&id=2");
    assert.equal(current, "/items?search=pool&id=2");

    S.route.update("/page");
    assert.equal(current, "/page");
  });

  it("updates the route silently", function() {
    var current;
    S.route(function(params){ current = params.path; });
    S.route("/items");

    S.route.update("/other_path", false);
    assert.equal(current, "/items");
  });

  it("matches the params", function() {
    assertRoute("/items?search={q}", "/items?search=hi",
      {path: "/items?search=hi", q: "hi"});

    assertRoute("/items/{item}/{id}", "/items/debby/2",
      {path: "/items/debby/2", item: "debby", id: "2"});

    assertRoute("/my/*/{item}/{id}", "/my/crazy/cart/2",
      {path: "/my/crazy/cart/2", item: "cart", id: "2"});
  });

  function assertUpdate(update, expected) {
  }

  function assertRoute(route, path, params) {
    var received = false;

    S.route.clear()(route, function(p) {
      received = true
      params && assert.deepEqual(p, params)
    });

    S.route(path);
    assert(received, "Invalid route to => " + path);
  }
});
