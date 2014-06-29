describe("#render", function() {

  it("Single token", function() {
    assert.equal(E.render("x"), "x");
    assert.equal(E.render("x", {}), "x");
    assert.equal(E.render("{x}", { x: "x" }), "x");
    assert.equal(E.render("{x}", { x: "z" }), "z");
  });

  it("Multiple tokens", function() {
    assert(E.render("{x}{y}", { x: "x", y: "y" }) == "xy");
  });

  it("Single quotes", function() {
    assert.equal(E.render("'x'"), "'x'");
    assert.equal(E.render("\'x.\';"), "\'x.\';");
  });

  it("Empty values", function() {
    assert.equal(E.render("{x}", { x: undefined }), "");
    assert.equal(E.render("{x}", { x: null }), "");
    assert.equal(E.render("{x}", { x: true }), "true");
    assert.equal(E.render("{x}", { x: false }), "false");
    assert.equal(E.render("{x}", { x: 0 }), "0");
  });

  it("With spaces", function() {
    assert.equal(E.render("{ x }", { x: 'x' }), "x");
    assert.equal(E.render("{x }", { x: 'x' }), "x");
    assert.equal(E.render("{ x}", { x: 'x' }), "x");
    assert.equal(E.render("{  x  }", { x: 'x' }), "x");
  });

  it("Empty template", function() {
    assert(E.render() === "");
  });

  it("Nearby brackets", function() {
    assert.equal(E.render("{{x}", { x: 'x' }), "{x");
    assert.equal(E.render("{x}}", { x: 'x' }), "x}");
    assert.equal(E.render("{{x}}", { x: 'x' }), "{x}");
  });

  if (typeof jQuery == "function") {
    it("<template> tag", function() {
      assert($.trim(E.render($("#test1").html(), {x: 'x'})) == "x");
    });
  }

  it("Newline characters", function() {
    assert.equal(E.render("x\r"), "x\r");
    assert.equal(E.render("x\n"), "x\n");
  });

  it("Backslashes", function() {
    assert.equal(E.render("\\{x}", { x: 'x' }), "\\x");
  });

  it("Escaping", function() {
    assert.equal(E.render("{x}", { x: '&' }, true), "&amp;");
    assert.equal(E.render("{x}", { x: '"' }, true), "&quot;");
    assert.equal(E.render("{x}", { x: '<' }, true), "&lt;");
    assert.equal(E.render("{x}", { x: '>' }, true), "&gt;");
  });

  it("Escaping empty values", function() {
    assert.equal(E.render("{x}", { x: undefined }, true), "");
    assert.equal(E.render("{x}", { x: null }, true), "");
    assert.equal(E.render("{x}", { x: true }, true), "true");
    assert.equal(E.render("{x}", { x: false }, true), "false");
    assert.equal(E.render("{x}", { x: 0 }, true), "0");
  });

  it("Not Escaping", function() {
    assert.equal(E.render("{x}", { x: '&' }), "&");
    assert.equal(E.render("{x}", { x: '"' }), "\"");
    assert.equal(E.render("{x}", { x: '<' }), "<");
    assert.equal(E.render("{x}", { x: '>' }), ">");
  });

  it("Nested objects", function() {
    assert.equal(E.render("{x.y}", { x: { y: 'x' }}), "x");
  });

  it("Undefined properties", function() {
    assert.equal(E.render("{x}", {}), "");
  });

  it('Custom escape function', function(){
    var template = '{x}',
      data = {x: 'custom-replace-function'},
      escape_fn = function(text){ return text.replace(/-/g, '!')};

    assert.equal(E.render(template, data, escape_fn), 'custom!replace!function');
  });

  it('Custom escape function args', function(){
    E.render('{x}', { x: 'foo'}, function(val, key) {
      assert.equal(key, 'x');
      assert.equal(val, 'foo');
    });
  });

  it('Can be set to not escape', function(){
    var template = '{x}',
      data = {x: '<script>test</script>'};

    assert.equal(E.render(template, data), '<script>test</script>');
  });

});
