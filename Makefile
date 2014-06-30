init:
	bower install
	echo '(function(E) { "use strict";' > index.js
	cat lib/* >> index.js
	cat ext/* >> index.js
	echo '})(typeof window !== "undefined" ? window.E = {} : exports);' >> index.js

jshint:
	jshint lib/*.js

min: init
	uglifyjs index.js --comments --mangle -o min.js

test: init
	node test/node.js

.PHONY: test
