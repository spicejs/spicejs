[![Build Status](https://travis-ci.org/3den/spicejs.svg?branch=master)](https://travis-ci.org/3den/spicejs)

# What is Spice.js?

Spice is a super minimal (< 3k) and flexible MVC framework for javascript. Spice was built to be easily added to any existent application and play well with other technologies such as jQuery, pjax, turbolinks, node or whatever else you are using.

## Why yet an other MVC framework?

Currently all major MVC frameworks for javascript have a huge APIs and you end up writing more code to satisfy the the framework requirements than your own business logic, that leads to code that is tightly coupled to the framework and hard to reuse, sometimes even hard to update for new versions of the framework.

On Spice most of the code you write is pure javascript the framework API is minimal (just 5 methods) that helps you to make your code easier to reuse and test. The core of Spice is pure javascript (without any external dependency) that is fully unit tested and can be easily extended.

Spice.js was inspired by [the SOLID Principles](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)), [jQuery](http://jquery.com/) and [Riot.js](https://github.com/muut/riotjs).

## The Good

* Easy to learn: Spice will few very straight forward for developers are familiar with jQuery and JavaScript.
* Unobtrusive JavaScript: Spice makes [progressive enhancement](http://en.wikipedia.org/wiki/Progressive_enhancement) simpler, you can load your views on the server and use Spice's controllers to add frontend features.
* Powerful template engine: Spice comes with `S.template` which creates a precompiled template that is supper fast, you can also write any javascript code in your template without having to learn different syntaxes.
* Routes: You can use routes to bind controllers and plugins, on pages where they are needed and you can have more than one route callback matching the same path.
* Observables: You can turn any javascript object, or function, into an observable that can listen and trigger events.
* Supper Flexible: You can use any javascript lib or jQuery plugin with spice, there is extensions for jQuery controllers, turbolinks and it is easy to write other extensions for the features you need.
* Testable: Is very simple to test spice code, controllers are just a function, templates are just a string and observables are just objects. Spice also comes out of the box with a simple BDD framework.

## The Bad

* To Flexible: There is no restriction on your code structure so you can make a very good architecture with Spice or a very bad one.
* To Young: It is a new project so there is not much documentation yet.

## The Ugly

* Using with other MVC Frameworks: It is possible to use Spice with other javascript frameworks but that is not recommended since it could lead to a  confusing code.

# Documentation

This documentation will explain with examples how to build cool web apps with Spice.

## Install

The best way to install `Spice.js`, and most js packages, is using bower:

```
$ bower install spicejs
```

By default bower will install packages in `./bower_components` so you can add spice and the extensions you need using:

```html
<script src="bower_components/spicejs/min.js"></script>
<!-- or "bower_components/spicejs/index.js" for the uncompressed version -->

<!-- Polyfill extension for compatibility with older browsers (IE 7) -->
<script src="bower_components/spicejs/ext/polyfill.js"></script>

<!-- Route extension for browser navigation and push state -->
<script src="bower_components/spicejs/ext/route_browser.js"></script>

<!-- Add other extensions as needed... -->
```

If you don't want to use bower you can just copy the files you need from https://github.com/3den/spicejs but bower is highly recommended.

## Spice on Node.js

You can use Spice.js on node, to include spice do:

```js
var S = require("./bower_components/spicejs");

// now you can user spice on the backend
```

## S.observable
