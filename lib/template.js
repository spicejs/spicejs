// Generates a template function
S.template = (function() {
  var cache = {};

  function template(str, data){
    str = str.trim();
    cache[str] = cache[str] || generate(str);
    return data ? cache[str](data) : cache[str];
  }

  function generate(str) {
    var wrap = getWrap(), prefix = wrap[0], sufix = wrap[1];

    return new Function("obj",
      "var p=[];" +
      "with(obj){p.push('" + str
        .replace(/[\r\t\n]/g, " ")
        .split(prefix).join("\t")
        .replace(new RegExp("((^|" + sufix +")[^\t]*)'", "g"), "$1\r")
        .replace(new RegExp("\t=(.*?)" + sufix, "g"), "',$1,'")
        .split("\t").join("');")
        .split(sufix).join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");
  }

  function getWrap() {
    return (typeof template.wrapper === "string") ?
      template.wrapper = template.wrapper.replace(/\s+/, "").split("?") :
      template.wrapper;
  }

  template.wrapper = "<%?%>";
  return template;
}());

