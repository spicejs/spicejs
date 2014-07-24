if (typeof jQuery !== "undefined") {
  jQuery.fn.control = function(name, options) {
    if (this.data("control_"+name)) return this;
    this.data("control_"+name, true);
    return E.control(name, this, options);
  };
}
