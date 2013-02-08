meteor-keybindings
==================

A meteor package for awesome key handling / bindings, with some methods to make the stuff easier. It uses the underscore and jquery meteor packages together with the awesome [jwerty.js](https://github.com/keithamus/jwerty) for key bindings.

How to install
--------------

```
mrt add keybindings
```

You can bind easily bind keys with the **Meteor.Keybindings** as following


```
Meteor.Keybindings.addOne('a', function() { 
	console.log('You pressed a');
});

Meteor.Keybindings.add({
	'alt+a' : function () { console.log('alt+a'); },
	'alt+b' : function () { console.log('alt+b'); },
	'alt+c' : function () { console.log('alt+c'); }
});
```
For more information on how you can specificy the keys, check the [jwerty README](https://github.com/keithamus/jwerty/blob/master/README-DETAILED.md).

####This is an early build (a lot of stuff not tested)! 

There are Qunit tests and yuidocs, if you want to see more examples. This readme will be updated soon.

