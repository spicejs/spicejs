describe("#observable", function() {
  var el = S.observable({});

  describe("#on", function() {
    it("binds a single listener", function() {
      var count = 0;

      el.on("a", function() { count++ });
      el.trigger("a"); assert.equal(count, 1);
      el.trigger("a"); assert.equal(count, 2);
      el.trigger("a"); assert.equal(count, 3);
    });

    it("binds multiple listeners", function() {
      var count = 0;

      el.on("b/4 c-d d:x", function(n) { count += n });
      el.trigger("b/4", 0).trigger("c-d", 1).trigger("d:x", 2);
      assert.equal(count, 3);
    });
  });

  describe("#one", function() {
    it("binds function to be executed only once", function() {
      var count = 0;

      el.one("g", function() { count++ });
      el.trigger("g").trigger("g");
      assert.equal(count, 1);
    });

    it("binds one and on", function() {
      var count = 0;

      el.one("y", function() {
        count++;
      }).on("y", function() {
        count++;
      }).trigger("y").trigger("y");
      assert.equal(count, 3);
    });
  });


  describe("#off", function() {
    it("removes a single listeners", function() {
      var count = 0;
      function r() { count++ }
      el.on("r", r).on("s", r).off("s").trigger("r").trigger("s");
      assert.equal(count, 1);
    });

    it("removes multiple listeners", function() {
      var count = 0;
      function r() { count++ }
      el.on("r", r).on("s", r).off("s r").trigger("r").trigger("s");
      assert.equal(count, 0);
    });

    it("removes all listeners", function() {
      var count = 0;
      function fn() { count++ }
      el.on("a", fn).on("b", fn).on("c", fn).off("*")
      el.trigger("a").trigger("b").trigger("c");
      assert.equal(count, 0);
    });

    it("removes a specific listener", function() {
      var count = 0;
      function fn() { count++; }
      function fn2() { count++; }

      el.on("a", fn).on("a", fn2).off("a", fn).trigger("a");
      assert.equal(count, 1);
    });

    it("fails silently for undefined events", function() {
      el.off("non-existing").off("missing", function() {});
    })
  });

  describe("#trigger", function() {
    it("does not call trigger infinitely", function() {
      var count = 0;

      el.on("update", function(value) {
        el.trigger("update", value);
        count++;
      });

      el.trigger("update", "foo");
      assert.equal(1, count);
    });

    it("is able to trigger events inside a listener", function() {
      var e2;
      el.on("e1", function() { this.trigger("e2"); });
      el.on("e2", function() { e2 = true; });
      el.trigger("e1");
      assert(e2);
    });


    it("passes multiple arguments", function() {
      var args;
      el.on("a", function() { args = [].slice.call(arguments, 0) });
      el.trigger("a", 1, [2, 3], {a: 1}, "hi", true);
      assert.deepEqual(args, [1, [2, 3], {a: 1}, "hi", true]);
    });
  });

  describe("#create", function() {
    var Item = S.observable({price: 1}),
      item1 = Item.create({name: "burrito", price: 2}),
      item2 = item1.create({name: "Super Burrito", price: 3});
      item3 = Item.create({name: "taco"}),

    it("overloads the parent properties", function() {
      assert.deepEqual(Item,
        {price:1, _callbacks:{}});

      assert.deepEqual(item1,
        {name:"burrito", price:2, _parent: Item, _callbacks: {}});

      assert.deepEqual(item2,
        {name:"Super Burrito", price:3, _parent: item1, _callbacks: {}});

      assert.deepEqual(item3,
        {name:"taco", _parent: Item, _callbacks: {}});

      assert.equal(item3.price, 1);
    });

    it("sets the correct prototypes", function() {
      assert(Item.isPrototypeOf(item1));
      assert(Item.isPrototypeOf(item2));
      assert(item1.isPrototypeOf(item2));
      assert(Item.isPrototypeOf(item3));
    });

    it("binds events incrementaly and fallback to the parent events", function() {
      var a = 0, b = 0;
      Item.on("a", function() { a++ });
      item1.on("b", function() { b++ });

      item1.trigger("a").trigger("b");
      item3.trigger("b");
      assert.equal(a, 1);
      assert.equal(b, 1);

      item1.off().trigger("a");
      assert.equal(a, 2);
    });
  })
});
