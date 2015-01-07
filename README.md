![Spice.js](http://spicejs.github.io/spicejs/images/spicejs.png)
[![Build Status](https://travis-ci.org/spicejs/spicejs.svg?branch=master)](https://travis-ci.org/spicejs/spicejs)

# What is _Spice.js_?

_Spice_ is a super minimal (< 3k) and flexible MVC framework for JavaScript. _Spice_ was built to be easily added to any existing application and plays well with other technologies such as _jQuery_, _Pjax_, _Turbolinks_, _Node_ or whatever else you are using. 

## Why yet another MVC framework?

Currently all major MVC frameworks for JavaScript have a huge API and you end up writing more code to satisfy the framework requirements than on your own business logic. This leads to code that is tightly coupled to the framework and hard to reuse, sometimes even hard to update for newer versions of the framework.

In _Spice_ most of the code you write is pure JavaScript. The framework API is minimal (just 5 methods), to make your code easier to write, reuse and test. The core of _Spice_ is pure JavaScript (without any external dependency), it is fully unit-tested and can be easily extended. This documentation will explain with examples how you can use _Spice_ to build cool web-apps.

_Spice_ was inspired by [the SOLID Principles](http://en.wikipedia.org/wiki/SOLID_(object-oriented_design)), [jQuery](http://jquery.com/) and [Riot.js](https://github.com/muut/riotjs).

### The Good

* **Easy to learn**: _Spice_ will feel very straight-forward to developers familiar with jQuery and JavaScript.
* **Unobtrusive JavaScript**: _Spice_ makes [progressive enhancement](http://en.wikipedia.org/wiki/Progressive_enhancement) simpler, you can load your views on the server and use _Spice_'s controllers to add front-end features.
* **Powerful template engine**: _Spice_ comes with `S.template` which creates a pre-compiled template that is super-fast. You can also write any JavaScript code in your template without having to learn a different syntax.
* **Routes**: You can use routes to bind controllers and plugins, on pages where they are needed, and you can have more than one callback matching the same route.
* **Observables**: You can turn any JavaScript object, or function, into an observable that can listen to and trigger events.
* **Super Flexible**: You can use any JavaScript lib or _jQuery_ plugin with _Spice_, there are extensions for _jQuery_ controllers and _Turbolinks_ and it is easy to write other extensions for the features you need.
* **Write once, Use everywhere**: _Spice_ promotes reuse, it is easy to create generic controllers and models that can be reused in different parts of the same app or on different apps.
* **Testable**: Its very simple to test _Spice_ code, controllers are just a function, templates are just a string and observables are just objects. _Spice_ also comes out of the box with a simple BDD framework.

### The Bad

* **Too Flexible**: There is no restriction on your code structure so you can make a very good architecture with _Spice_ or a very bad one.
* **Too Young**: It is a new project so there is not much documentation yet.

### The Ugly

* **Using with other MVC Frameworks**: It is possible to use _Spice_ with other JavaScript frameworks but is NOT recommended, since it could lead to confusing code.


# Install

The best way to install _Spice_ is using _[Bower](http://bower.io/)_

```
$ bower install _Spice_
```

By default bower will install packages in `./bower_components` so you can add _Spice_ and the extensions you need using:

```html
<script src="bower_components/spicejs/min.js"></script>
<!-- or "bower_components/spicejs/index.js" for the uncompressed version -->

<!-- Polyfill extension for compatibility with older browsers (IE 7) -->
<script src="bower_components/spicejs/ext/polyfill.js"></script>

<!-- Route extension for browser navigation and push state -->
<script src="bower_components/spicejs/ext/route_browser.js"></script>

<!-- Add other extensions as needed... -->
```

If you don't want to use _Bower_ you can just copy the files you need from https://github.com/spicejs/spicejs.

## _Spice_ in Node

You can use _Spice_ in _Node_, just include:

```js
var S = require('./bower_components/spicejs');

// now you can user _Spice_ on the backend
```

# Test Driven Development

Testability was the main focus of _Spice_, the framework was built to be decoupled and easy to test since it started. That is why it also includes a mini [BDD](https://github.com/spicejs/spicejs/blob/master/bdd.js) (Behaviour Driven Development) framework that was inspired by [jasmine](http://jasmine.github.io/) but is **only 30 lines of code** and works in _Node_ and the Browser.


## BDD in the Browser

```html
<!doctype html>
<html>
  <head>
    <title>My Test</title>
    <script src="bower_components/spicejs/bdd.js"></script>

    <!-- the BDD framework can be used with or without Spice -->
    <script src="bower_components/spicejs/index.js"></script>

    <!-- Add all source files the you are testing here -->
    <script src="js/some_file_that_will_be_tested.js"></script>
    ...
  </head>

  <body>
    <!-- The test results will be displayed in the Browser Console %>
    <p>Open console to view the results</p>

    <!-- Add all test files here -->
    <script src="test/some_file_that_will_be_tested_test.js"></script>
    ...
  </body>
</html>
```

For example, check the [test/index.html](https://github.com/spicejs/spicejs/blob/master/test/index.html) used in _Spice_.

## BDD in Node

```js
// This is needed if the app you are testing uses Spice
global.S = require('bower_components/spicejs/index');

[
  'bower_components/spicejs/bdd',
  // require all your test files after the BDD framework
  'test/your_awesome_test',
].forEach(function(file){
  require('./' + file + '.js');
});
```

For example, check the [test/node.js](https://github.com/spicejs/spicejs/blob/master/test/node.js) used in _Spice_.

## Writing tests

```js
// Some object
var counter = {
  index: 0,
  add: function() { this.index++; }
};

// Testing the object
describe('counter', function() {
  it('starts with index === 0', function() {
    assert.equal(counter.index, 0);
  });

  describe('#add', function() {
    var c = Object.create(counter);

    it('increments the index', function() {
      c.add(); assert.equal(c.index, 1);
      c.add(); assert.equal(c.index, 2);
      c.add(); assert.equal(c.index, 3);
    });
  });
});
```


# S.observable(object)

This method turns any object or function into an `observable` by adding some methods for dealing with events properties and inheritance. The `observable` can be considered the M (Model) in MVC, because it deals with the data and business logic.

```js
// Example of a a Search model
var Search = S.observable({
  query: undefined,
  page: 1,

  search: function(path, query) {
    var self = this;

    $.get(path, {
      format: 'json',
      search: query
    }).done(function(data) {
      self.query = query;
      self.page = 1;

      // Triggers an event on the Search object.
      self.trigger('search', data, query);
    });
  }
});
```
Check the [unit tests](https://github.com/spicejs/spicejs/blob/master/test/lib/observable_test.js) for `S.observable`.

## observable.on(event, callback)

Observables can listen to events using the the `on` callback.

```js
Search.on('search', function(data, query) {
  console.log(data); // prints the data returned by the search
  console.log(data); // prints the query used to search
});
```

## observable.one(event, callback)

Does the same as `observable.on` but the callback is automatically removed after it's called the first time.

## observable.off(event, callback)

Allows you to remove event listeners.

```js
// Removes all callbacks
Search.off();

// Removes the 'search' callbacks
Search.off('search');

// Removes just the `someCallback` function 'search' callbacks
Search.off('search', someCallback);
```

## observable.trigger(event, arg1, arg2...)

Triggers an event, the arguments are passed to the callback listener.

```js
var data = [{id: 1, name: 'Borderlands'}, {id: 2, name: 'Doom 3'}]
  , query = 'games';

// This will call all callbacks attached to the 'search' event
// passing `data` and `query` as the arguments.
Search.trigger('search', data, query);
```

## observable.set(key, value)

Sets the value of a property and triggers the events `set` and `key`, passing

```js
var Order = S.observable({
  subtotal: 0,
  total: 0,
  shipping: 0
}).on('subtotal shipping', function(value, oldValue) {
  console.log('changed from ' + oldValue + ' to ' + value);
  this.set('total', this.subtotal + this.shipping);
}).on('set', function(attr, value, oldValue) {
  console.log(attr + ' changed from ' + oldValue + ' to ' + value);
});

// Updates the subtotal to 10,
// the total will be automatically set to 10
Order.set('subtotal', 10);

// Updates the shipping to 2.50,
// the total will be automatically set to 12.50
Order.set('shipping', 10);
```

## observable.get(key)

Returns the value of a property.

```js
Order.total === Order.get('total');
```

## observable.create(properties)

Creates a new object based on the observable, _Spice_ uses prototypal inheritance to ensure changes made on the parent object are inherited by new instances but changes on the child don't mess up the parent.

```js
var TaxableOrder = Order.create({
  tax: 0

}).off(
  // Removes the subtotal and shipping callbacks
  'subtotal shipping'

).on('subtotal shipping tax', function() {
  // Adds the new callback
  this.set('total', this.subtotal + this.shipping + this.tax);

});

// Setting the tax updates the total
TaxableOrder.set('tax', 1)
TaxableOrder.total === Order.total + 1

// Overriding a property dont touch the parent
TaxableOrder.set('subtotal', 5)
TaxableOrder.subtotal !== Order.subtotal
```


# S.template(text [, object])

The `S.template` method can return either a pre-compiled template function (if only the first argument is passed), or the string if the `object` argument is passed. The `text` is a string that can contain any JavaScript code inside wrapper tags `<% if(something === somethingElse) { %> blabla <% } %>` and can have JavaScript output on wrapper return tags `<%= name %>`.

```js
// Creates a pre-compiled template
var tmpl = S.template('<p><%= name ? name : "?" %></p>');

// This will return '<p>joe</p>';
tmpl({name: "joe"});

// This will return '<p>?</p>';
tmpl({name: null});

// If a template will be used only once you can pass the options directly.
// This will return '<p>Dude</p>'
S.template('<p><%= name %></p>', {name: "Dude"});
```

In practice its very common to get the template from the Html.

```html
<ul id='users'>
</ul>

<template id='users-template'>
  <% for(var i = 0; i < users. length; i++) { %>
    <li><%= users[i].name %></li>
  <% } %>
</template>
```

Using it in your JavaScript code is very simple.

```js
// Some list of users
var users = [
  {name: "Luiz"},
  {name: "Eden"} ];

// Pre-compile the template
var tmpl = S.template(document.getElementById('users-template').innerHTML);

// Just update the html of the element you want.
document.getElementById('users').innerHTML = tmpl({users: users});
```

Check the [unit tests](https://github.com/spicejs/spicejs/blob/master/test/lib/template_test.js) for `S.template`.

## S.template.wrapper

The default template wrapper is `<%?%>` but you can easily customize it to whatever you need.

```js
// change the wrappers to '{{ code }}' and '{{= 'output' }}'.
S.template.wrapper = '{{?}}';
S.template('<p>{{= x }}</p>', {x: "foo"}) === '<p>foo</p>';

// change the wrappers to "<t code t>" and "<t= 'output' t>".
S.template.wrapper = '<t?t>'
S.template('<p><t= x t></p>', {x: "bar"}) === '<p>bar</p>';
```

# S.controller(name, callback)

A `S.controller` method which creates a organized, performing and stateful control with declarative event-binding. Use this method to create UI controls and organize them into higher-order business rules with `S.route`. It can serve as both a traditional view and/or a traditional controller.

```js
S.controller('increment', function(item) {
  item.on('click', increment);

  function increment(e) {
    var input = e.target;
    input.value = parseInt(input.value, 10) + 1;
  }
});
```

If you want, you can add some options on controller callback.

```js
S.controller('increment', function(item, options) {
  var target = options.target || item;

  item.on('click', increment);

  function increment(e) {
    var input = document.getElementById(e.target);
    target.value = parseInt(input.value, 10) + 1;
  }
});
```

Check the [unit tests](https://github.com/spicejs/spicejs/blob/master/test/lib/controller_test.js) for `S.controller` and `S.control`.

## S.control(name, element [, options])

A `S.control` method which can be used to bind a controller. Usually used inside a routes callback.

```js
// Increments the count on the `#increment-btn`
S.control('increment', document.getElementById('increment-btn'));

// Increments the `#count` element
S.control('increment', document.getElementById('increment-count-btn'), {
  tagert: document.querySelector('#count')
});
```

# S.route

The `S.route` method can do different things depending on what arguments are passed to it (following the _jQuery_ sytle). The route matcher can have params `/search?q={query}` and wildcards `/users*`, and it is possible to have many callbacks triggered for a given path.

Routes should be used to bind controllers, plugins or to trigger actions on a model. This will help to keep your code well-organized and to respond correctly to changes on the page.

Check the [unit tests](https://github.com/spicejs/spicejs/blob/master/test/lib/route_test.js) for `S.route`.

## S.route(callback)

This defines a generic route that will be called for all paths. This is usefull for binding plugins that will be used on all pages.

```js
S.route(function(params) {
  // binds select2 plugin to all `select` tags
  // http://ivaynberg.github.io/select2/
  $('select').select();

  // prints the path of the current page.
  console.log(params.path);
});
```

## S.route(path, callback)

The given `callback` will be called for all routes that match the given `path` expression.

```js
// Sets a callback that will bind the 'search' controller
// on all paths that start with '/search'.
S.route('/search*', function(params) {
  S.controll('search', document.getElementById('search-field'), {
    target: document.getElementById('search-results'),
    model: Search
  });
});

// Sets a callback that will call the 'Search.search'
// with the current path and given query
// for routes that match '/search?q={query}'
S.route('/search?q={query}', function(params) {
  Search.search(params.path, params.query);
});
```

## S.route(object)

This syntax alows to set many route callbacks at once.

```js
// This code will do exactly the same as the previous example.
S.route({
  // Sets a callback that will bind the 'search' controller
  // on all paths that start with '/search'.
  '/search*': function(params) {
    S.controll('search', document.getElementById('search-field'), {
      target: document.getElementById('search-results'),
      model: Search
    });
  },

  // Sets a callback that will call the 'Search.search' method
  // with the current path and given query
  // for routes that match '/search?q={query}'
  '/search?q={query}': function(params) {
    Search.search(params.path, params.query);
  }
});
```

## S.route(path [, triggersVisit = true])

Triggers all callbacks that match the given path. If `triggersVisit` is set to `false`, it will NOT send a push state to update the browser.

```js
// Triggers all callbacks that match '/somepath'
// and also calls 'route.trigger('visit', '/somepath')'
// that will send a push state to the browser updating
// the url if `ext/route_browser.js` was included.
S.route('/somepath');

// Triggers all callbacks that match '/somepath'
// but do NOT call `route.trigger('visit', '/somepath')`
// so the browser URL wont change
S.route('/somepath', false);
```

## S.route.update(path [, callsVisit = true])

Updates a portion of the current URL and calls all callbacks that match the new path, if `callsVisit` is set to `false` it will update the URL without triggering the callbacks.

```js
// visits the '/search' and triggers all callbacks that match that route.
S.route('/search');

// Updates the current path to '/search?q=spice'
// and triggers all callbacks for visiting that route.
S.route.update('?q=spice');

// Updates the current path to '/search?q=spice#doc'
// WITHOUT triggering the callbacks for visiting that route
S.route.update('#doc', false);

// Does exactly the same as `S.route('/search');`
S.route.update('/search');
```

# Extensions

The core of _Spice_ is very minimal but super flexible. With extensions it is easy to add powerful features to _Spice_ and also to simplify the use of _Spice_ with other technologies.

All _Spice_ extensions work out-of-the-box without any settup, all you need to do is to include it on your app, and thats it!

_Spice_ already comes with some useful extensions that will be explained in this chapter.

## ext/polyfill.js

Add this if you need compatibility with old browsers (like IE7), if you don't care about old browsers you won't need it.

```html
<!--makes _Spice_ compatible with older browsers -->
<script src="bower_components/spicejs/ext/polyfill.js"></script>
```

## ext/route_browser.js

Enables the `S.route` to change, and listen to changes, on the Browser URL. It will automatically use `pushState` or fallback to `#/` if the browser dont support `pushState`.

This extension should be used on the frontend of any app that needs the router.

```html
<!-- adds route extension for browser navigation -->
<script src="bower_components/spicejs/ext/route_browser.js"></script>
```

Check the [tests](https://Github.com/spicejs/spicejs/blob/master/test/ext/route_browser.html) for `ext/route_browser`.

## ext/route_turbolinks.js

This is a complementary route extension that is only needed on apps that use [Turbolinks](https://github.com/rails/turbolinks) and it must be added after the `ext/route_browser.js`. It will enable the _Spice_ router to listen to URL changes that are triggered by _Turbolinks_.
`
```html
<!-- router will listen to Turbolinks navigation -->
<script src="bower_components/spicejs/ext/route_browser.js"></script>
<script src="bower_components/spicejs/ext/route_turbolinks.js"></script>
```

## ext/jquery.control.js

This super cool extension will add a _jQuery_ plugin that makes it much easier to bind controllers to _jQuery_ elements. It makes sure that the controller binds only once to an element and hence avoids issues of having the same element listening to duplicated events.

```html
<!-- adds the `.control` plugin to jquery -->
<script src="bower_components/spicejs/ext/jquery.control.js"></script>
```

With this you can bind controllers using a _jQuery_ plugin.

```js
// Creates a controller that logs when fields change
S.controller('log-change', function(elements, function(element) {
  elements.on('change', function(e) {
    var target = $(e.target);
    console.log(target, 'changed to => '+ target.val());
  });
});

// Binds all inputs with [data-log-change] to the 'log-change' controller
$('input[data-log-change]').control('log-change')
```

Check the [tests](https://github.com/spicejs/spicejs/blob/master/test/ext/jquery.control.html) for `ext/route_browser`.

# Examples

* [Connect4](https://github.com/spicejs/spicejs-connect4): A simple _Connect4_ game built with _Spice_.
* [SnapGallery](https://github.com/spicejs/snapguide): A _Spice_ example using routes and _Sinatra_.

