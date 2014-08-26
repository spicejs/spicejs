describe("#template", function() {
  it("generates a template function", function() {
    var tmpl = S.template("<%= x %>");
    assert.equal(tmpl({x: "foo"}), "foo");
    assert.equal(tmpl({x: 1}), "1");
    assert.equal(tmpl({x: true}), "true");
    assert.equal(tmpl({x: false}), "false");
    assert.equal(tmpl({x: null}), "");
  });

  it("renders a template directly", function() {
    assert.equal(S.template("<%= x %>", {x: "foo"}), "foo");
    assert.equal(S.template("<p><%= x %></p>", {x: "foo"}), "<p>foo</p>");
    assert.equal(S.template("<%= x.y.z %>", {x: {y: {z: "bar"}}}), "bar");
    assert.equal(S.template("<%= 10 %>", {}), "10");
    assert.equal(S.template("hi", {}), "hi");
  });

  it("compiles javascript code", function() {
    var tmpl = S.template(
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
    S.template.wrapper = "{{?}}";
    assert.equal(S.template("{{= x }}", {x: "foo"}), "foo");
    assert.equal(S.template("<p>{{= x }}</p>", {x: "foo"}), "<p>foo</p>");
    assert.equal(S.template("{{ if (false) { }} hide {{ } }}", {x: "foo"}), "");

    S.template.wrapper = "<luiz?luiz>"
    assert.equal(S.template("<luiz= x luiz>", {x: "foo"}), "foo");
    S.template.wrapper = "<%?%>";
  });
});
