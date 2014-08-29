if (typeof jQuery !== "undefined") {
  jQuery.fn.control = function(name, options) {
    if (!this.length) return this;
    var dataControl = "data-control-" + name.replace(/\W+/g, "-");
    if (this.attr(dataControl)) return this;
    this.attr(dataControl, true);
    return S.control(name, this, options);
  };
}
