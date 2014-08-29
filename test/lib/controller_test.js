describe("#controller", function() {
  S.controller("increment", function(element, options){
    element.count++;
  });

  it("binds the controller to an element", function() {
    assertBind("increment", {count: 0}, {count: 1});
    assertBind("increment", {count: 1}, {count: 2});
    assertBind("increment", {count: 2}, {count: 3});
  });

  it("binds only once per element", function() {
    var element = {count: 0};
    assertBind("increment", element, {count: 1});
    assertBind("increment", element, {count: 1});
    assertBind("increment", element, {count: 1});
    assertBind("increment", element, {count: 1});
  });

  it("silently fail for undefined controllers", function() {
    S.control("the-bugged", {});
    S.control("nobody", {});
  });


  it("allows a custom prefix", function() {
    var element = {count: 0}, prefix = S.control.prefix;

    assertBind("increment", element, {count: 1});
    assert(element._control_increment);

    S.control.prefix = "_cutom_prefix_";
    assertBind("increment", element, {count: 2, _control_increment: true});
    S.control.prefix = prefix;
  });

  function assertBind(controller, element, expected) {
    expected[S.control.prefix + controller] = true;
    S.control(controller, element, {});
    assert.deepEqual(element, expected);
  }
});
