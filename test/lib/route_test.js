describe("#route", function() {
  it("sets many routes at once", function() {
    E.route({a: 1, b: 2, c: 3});

    assert.deepEqual(E.route.map, [
      {regex: {}, keys: ["match"], callback: 1},
      {regex: {}, keys: ["match"], callback: 2},
      {regex: {}, keys: ["match"], callback: 3} ]);
  });

  it("matches a route", function() {
    assertRoute("/home", "/home");
    assertRoute("/items/{item}", "/items/debby");
    assertRoute("/items/{item}", "#/items/debby");
    assertRoute("/items/{item}", "#!/items/debby");
    assertRoute("*/items", "/hi/items");
    assertRoute("*/items", "/some/regex/items");
    assertRoute("*/items", "/items");
  });

  it("works with generic routes", function() {
    var count = 0;
    E.route(function(){ count++ });
    E.route(function(){ count++ });
    E.route(function(){ count++ });

    E.route("/any_randow_route") && assert.equal(count, 3);
    E.route("/other_randow_route") && assert.equal(count, 6);
  });

  it("triggers the same route only once", function(){
    var count = 0;
    E.route.clear()(function(){ count++ });

    E.route("/somewhere") && assert.equal(count, 1);
    E.route("/somewhere") && assert.equal(count, 1);
    E.route("/somewhere") && assert.equal(count, 1);
    E.route("/other") && assert.equal(count, 2);
    E.route("/other") && assert.equal(count, 2);
  });

  it("triggers all routes that matches the path", function(){
    var count = 0, fn = function(){ count++ };
    E.route.clear();
    E.route(fn); E.route({"/my*": fn, "/my/way": fn, "*": fn});

    E.route("/my/way");
    assert.equal(count, 4);
  });

  it("matches the params", function() {
    assertRoute("/items?search={q}", "/items?search=hi",
      {path: "/items?search=hi", match: "/items?search=hi", q: "hi"});

    assertRoute("/items/{item}/{id}", "/items/debby/2",
      {path: "/items/debby/2", match: "/items/debby/2", item: "debby", id: "2"});

    assertRoute("/my/*/{item}/{id}", "/my/crazy/cart/2",
      {path: "/my/crazy/cart/2", match:  "/my/crazy/cart/2", item: "cart", id: "2"});
  });

  function assertRoute(route, path, params) {
    var received = false;

    E.route.clear()(route, function(p) {
      received = true
      params && assert.deepEqual(p, params)
    });

    E.route(path);
    assert(received, "Invalid route to => " + path);
  }
});
