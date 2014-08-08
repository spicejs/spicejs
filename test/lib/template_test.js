describe("#template", function() {
  it("generates a template function", function() {
    var tmpl = E.template("<%= x %>");
    assert.equal(tmpl({x: "foo"}), "foo");
    assert.equal(tmpl({x: 1}), "1");
    assert.equal(tmpl({x: true}), "true");
    assert.equal(tmpl({x: false}), "false");
    assert.equal(tmpl({x: null}), "");
  });

  it("renders a template directly", function() {
    assert.equal(E.template("<%= x %>", {x: "foo"}), "foo");
    assert.equal(E.template("<%= 10 %>", {}), "10");
    assert.equal(E.template("hi", {}), "hi");
  });

  it("compiles javascript code", function() {
    var tmpl = E.template(
      "<% if (a > b) { %>" +
        "a = <%= a %>" +
      "<% } else if (b > a) { %>" +
        "b = <%= b %>" +
      "<% } else { %>" +
        "b(<%= b %>) == a(<%= a %>)" +
      "<% } %>"
    );

    assert.equal(tmpl({a: 1, b: 0}), "a = 1");
    assert.equal(tmpl({a: 1, b: 3}), "b = 3");
    assert.equal(tmpl({a: 3, b: 3}), "b(3) == a(3)");
  });

  it("compiles with a custom wrapper", function() {
    E.template.wrapper = "{{?}}";
    assert.equal(E.template("{{= x }}", {x: "foo"}), "foo");
    assert.equal(E.template("{{ if (false) { }} hide {{ } }}", {x: "foo"}), "");
    E.template.wrapper = "<%?%>";
  });
});
