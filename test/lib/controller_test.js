describe("#controller", function() {
  E.controller("increment", function(element, options){
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

  function assertBind(controller, element, expected) {
    E.control(controller, element, {});
    assert.deepEqual(element, expected);
  }
});
