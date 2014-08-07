describe("#render", function() {

  it('renders the unscaped output', function(){
    assert.equal(E.render("x"), "x");
    assertRender("x", {}, "x");
    assertRender("{x}", { x: "foo" }, "foo");
    assertRender("{x}", { x: "foo" }, "foo");
    assertRender("{x}", { x: true }, "true");
    assertRender("{x}", { x: '&' }, "&");
    assertRender("{x}", { x: '"' }, "\"");
    assertRender("{x}", { x: '<' }, "<");
    assertRender("{x}", { x: '>' }, ">");
    assertRender('{x}', {x: '<script>test</script>'}, '<script>test</script>');
    assertRender('{x}', {x: '<p>test</p>'}, '<p>test</p>');
    assertRender("{x}{y}", { x: "foo", y: "bar" }, "foobar");
    assertRender("{x} {y}", { x: "foo", y: "bar" }, "foo bar");
  });

  it("renders single quotes", function() {
    assert.equal(E.render("'x'"), "'x'");
    assert.equal(E.render("\'x.\';"), "\'x.\';");
  });

  it("renders falsey values", function() {
    assert.equal(E.render("{x}", { x: undefined }), "");
    assert.equal(E.render("{x}", { x: null }), "");
    assert.equal(E.render("{x}", { x: true }), "true");
    assert.equal(E.render("{x}", { x: false }), "false");
    assert.equal(E.render("{x}", { x: 0 }), "0");
  });

  it("ignores white spaces on variables", function() {
    assertRender("{ x }", { x: 'foo' }, "foo");
    assertRender("{x }", { x: 'foo' }, "foo");
    assertRender("{ x}", { x: 'foo' }, "foo");
    assertRender("{  x  }", { x: 'foo' }, "foo");
  });

  it("renders empty template", function() {
    assert.equal(E.render(), "");
  });

  it("renders near brackets", function() {
    assertRender("{{x}", { x: 'foo' }, "{foo");
    assertRender("{x}}", { x: 'foo' }, "foo}");
    assertRender("{{x}}", { x: 'foo' }, "{foo}");
  });

  it("renders newline characters", function() {
    assert.equal(E.render("x\r"), "x\r");
    assert.equal(E.render("x\n"), "x\n");
  });

  it("renders backslashes", function() {
    assertRender("\\{x}", { x: 'x' }, "\\x");
  });

  it("render default escaped values", function() {
    assertRender("{x}", { x: '&' }, "&amp;", true);
    assertRender("{x}", { x: '"' }, "&quot;", true);
    assertRender("{x}", { x: '<' }, "&lt;", true);
    assertRender("{x}", { x: '>' }, "&gt;", true);
  });

  it("renders nested objects", function() {
    assertRender("{x.y}", { x: { y: 'foo' }}, "foo");
    assertRender("{x.y.z}", { x: { y: {z: 'bar'} }}, "bar");
  });

  it('calls a custom escape function', function(){
    function fn (val, key) {
      assert.equal(key, 'x');
      assert.equal(val, 'foo');
      return "bar";
    };

    assertRender("{x}", {x: 'foo'}, "bar", fn);
  });

  function assertRender(template, data, expected, fn) {
    assert.equal(E.render(template, data, fn), expected);
  }
});
