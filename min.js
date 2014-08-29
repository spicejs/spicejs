(function(r){"use strict";r.observable=function(t){return e(t,r.observable.proto.create({}))};r.observable.proto={_callbacks:{},on:function(r,e){var t=this._callbacks;if(typeof e==="function"){r.replace(/\S+/g,function(r){(t[r]=t[r]||[]).push(e)})}return this},off:function(r,e){var t=this;if(!r||r==="*"){t._callbacks=Object.create(this._parent._callbacks);return this}r.replace(/\S+/g,function(r){var n,i=t._callbacks[r]||[];if(!e)return t._callbacks[r]=[];for(n=0;i[n];++n)if(i[n]===e)i.splice(n,1)});return this},one:function(r,e){if(e)e.one=true;return this.on(r,e)},trigger:function(r){var e,t,n=[].slice.call(arguments,1),i=this._callbacks[r]||[];for(e=0;t=i[e];++e){if(!t.busy){t.busy=true;t.apply(this,n);if(t.one)i.splice(e--,1);t.busy=false}}return this},create:function(r){r._parent=this;r._callbacks=Object.create(this._callbacks);return e(Object.create(this),r)}};function e(r,e){for(var t in e)r[t]=e[t];return r}r.template=function(){var r={};function e(e,n){r[e]=r[e]||t(e);return n?r[e](n):r[e]}function t(r){var e=n(),t=e[0],i=e[1];return new Function("obj","var p=[];"+"with(obj){p.push('"+r.replace(/[\r\t\n]/g," ").split(t).join("	").replace(new RegExp("((^|"+i+")[^	]*)'","g"),"$1\r").replace(new RegExp("	=(.*?)"+i,"g"),"',$1,'").split("	").join("');").split(i).join("p.push('").split("\r").join("\\'")+"');}return p.join('');")}function n(){return typeof e.wrapper==="string"?e.wrapper=e.wrapper.replace(/\s+/,"").split("?"):e.wrapper}e.wrapper="<%?%>";return e}();r.route=function(){var e=[],t;function n(r,e){var t;if(typeof r==="function"){n("*",r)}else if(typeof e==="function"){i(r,e)}else if(typeof r==="object"){for(t in r)r.hasOwnProperty(t)&&i(t,r[t])}else c(r,e);return n}function i(r,t){var n=["path"],i,c;i="^#?!?"+r.replace(/[\/\=\?\$\^]/g,"\\$&").replace(/\*/g,".*").replace(/\{(\w+)\}/g,function(r,e){n.push(e);return"([\\w\\-]+)"})+"$";e.push({regex:new RegExp(i),keys:n,callback:t})}function c(r,i){var c=e.length,o;if(t===r)return;for(o=0;o<c;o++)a(r,e[o]);if(i!==false)n.trigger("visit",r);t=r}function a(r,e){var t=r.match(e.regex),n=e.callback;if(!t||!n)return;if(typeof n!=="function")return c(n,false);n(o(r,e.keys,t))}function o(r,e,t){var n={},i=e.length,c;for(c=0;c<i;c++)n[e[c]]=t[c];return n}function u(r){switch(r[0]){case"?":return t.replace(/\?.*/g,"")+r;case"&":return t.replace(/\&.*/g,"")+r;case"#":return t.replace(/\#.*/g,"")+r}}n.clear=function(){e=[];n.trigger("clear");return n};n.load=function(){n.trigger("load");return n};n.update=function(r,e){r=u(r);e===false?n.trigger("visit",r):c(r)};n.map=e;return r.observable(n)}();r.controller=function(){function e(r,t){e.on(r,t)}return r.observable(e)}();r.control=function(){function e(e,n,i){t(e,n)||r.controller.trigger(e,n,i);return n}function t(r,t){var n=e.prefix+r;if(t[n])return true;t[n]=true;return false}e.prefix="_control_";return e}()})(typeof window!=="undefined"?window.S={}:exports);