global.S = require("../index");

[
  "../bdd",
  "./lib/route_test",
  "./lib/observable_test",
  "./lib/controller_test",
  "./lib/template_test"
].forEach(function(file){
  require("./" + file + ".js");
});
