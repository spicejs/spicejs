init:
	echo '(function(S) { "use strict";' > index.js
	cat lib/observable.js >> index.js
	cat lib/template.js >> index.js
	cat lib/route.js >> index.js
	cat lib/controller.js >> index.js
	echo '})(typeof window !== "undefined" ? window.S = {} : exports);' >> index.js

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
