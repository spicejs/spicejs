init:
	echo '(function(E) { "use strict";' > index.js
	cat lib/* >> index.js
	echo '})(typeof window !== "undefined" ? window.E = {} : exports);' >> index.js

jshint: init
	jshint index.js

min: init
	uglifyjs index.js --comments --mangle -o min.js

ext = ""
custom: init
	cat index.js > custom.js
	for e in $(ext) ; do cat "ext/$$e.js" >> custom.js ; done
	uglifyjs custom.js --comments --mangle -o custom.min.js

test: min
	node test/node.js

.PHONY: test jshint
