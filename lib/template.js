// Generates a template function
E.template = (function() {
  var cache = {};

  function template(str, data){
    cache[str] = cache[str] || generate(str);
    return data ? cache[str](data) : cache[str];
  }

  function generate(str) {
    return new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" + str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");
  }

  return template;
}());

