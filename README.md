meteor-keybindings
==================

A meteor package for awesome key handling / bindings, with some methods to make the stuff easier. It uses the [underscore](http://underscorejs.org/) and [jquery](http://jquery.com/) meteor packages together with the awesome [jwerty.js](https://github.com/keithamus/jwerty) for key bindings.

How to install
--------------

```
mrt add keybindings
```

Overview
--------
You can easily `add`, `remove` and `replace` keys with **Meteor.Keybindings**

```
Meteor.Keybindings.addOne('a', function() { 
	console.log('You pressed a');
});

Meteor.Keybindings.add({
	'alt+a' : function () { console.log('alt+a'); },
	'alt+b' : function () { console.log('alt+b'); },
	'alt+c' : function () { console.log('alt+c'); }
});

Meteor.Keybindings.remove(['alt+a', 'alt+b']);

Meteor.Keybindings.replace('a', function() {
	console.log('You pressed the new a');
});
```

The keys are bound to the body and the event is keydown if the values are not defined.

```
Meteor.Keybindings.addOne(key, function, context, event);
Meteor.Keybindings.removeOne(key, context, event);
```


For more information on how you can specificy the keys, check the [jwerty README](https://github.com/keithamus/jwerty/blob/master/README-DETAILED.md).

####This is an early build (some stuff not tested)! 

There are Qunit tests and yuidoc available for more informations.

