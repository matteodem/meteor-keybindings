/*jslint nomen: true*/
/*jslint browser: true*/
/*global test, ok, Meteor, console, module, equal */
// Little hack to fake the Meteor Global Object
var Meteor = {};
(function () {
    'use strict';

    /* Helper Functions */
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size += 1;
            }

        }
        return size;
    };

    module("Tests for Meteor.Keybindings", {
        setup: function () {
            // prepare something for all following tests
        },
        teardown: function () {
            Meteor.Keybindings._bindings = {};
        }
    });

    test("Basic functionality of simple keybindings", 10,  function () {
        // Testing add()
        Meteor.Keybindings.add({
            'alt+a' : function () { console.log('alt+a'); },
            'alt+b' : function () { console.log('alt+b'); },
            'alt+c' : function () { console.log('alt+c'); }
        });

        equal(3, Object.size(Meteor.Keybindings._bindings),
                "Added 3 new bindings");
        equal("object", typeof Meteor.Keybindings._bindings['keydown/alt+a/body'],
                "The key is defined correct");
        equal("object", typeof Meteor.Keybindings._bindings['keydown/alt+b/body'].contextNode,
                "Context is a Node Element (object)");
        equal("keydown", Meteor.Keybindings._bindings['keydown/alt+c/body'].event,
                "Event default is keydown");
        equal("function", typeof Meteor.Keybindings._bindings['keydown/alt+c/body'].func,
            "Keydown callback is a function");

        // Testing remove()
        Meteor.Keybindings.remove(['alt+b', 'alt+c']);

        ok("undefined" === typeof Meteor.Keybindings._bindings['keydown/alt+b/body']
            && "undefined" === typeof Meteor.Keybindings._bindings['keydown/alt+c/body'],
            "Bindings successfully removed.");

        // Tesiting replace()
        ok(Meteor.Keybindings.replace('alt+a', function () {
            console.log("I am replaced, really");
        }), "Keybinding succesfully replaced");

        ok(Meteor.Keybindings.isBinded('alt+a'),
            "Keybinding is binded with default values");

        ok(!Meteor.Keybindings.isBinded('alt+a', '#testId', 'keyup'),
            "Keybinding is not binded with different context and event");

        // Testing removeOne()
        Meteor.Keybindings.removeOne('alt+a');
        equal(0, Object.size(Meteor.Keybindings._bindings),
            "All bindings succesfully removed");
    });

    test("Functionality of advanced keybindings", 9, function () {
        // Testing addOne()
        Meteor.Keybindings.addOne('alt+a', function () {
            console.log("I am alt + a");
        }, '#qunit', 'keyup');

        Meteor.Keybindings.addOne('alt+b', function () {
            console.log("I am alt + b");
        }, '#inputTest');

        Meteor.Keybindings.addOne('alt+c', function () {
            console.log("I am alt + c");
        }, 'div', 'keypress');

        ok(
            Meteor.Keybindings._bindings['keyup/alt+a/#qunit']
                && Meteor.Keybindings._bindings['keydown/alt+b/#inputTest']
                && Meteor.Keybindings._bindings['keypress/alt+c/div'],
            'All keybindings have the right keys'
        );

        equal("keyup", Meteor.Keybindings._bindings['keyup/alt+a/#qunit'].event,
            'Event type is right');
        equal("object", typeof Meteor.Keybindings._bindings['keydown/alt+b/#inputTest'].contextNode,
            'Function value is right');

        // Testing remove()
        ok(!Meteor.Keybindings.removeOne('alt+a'),
            "Doesn't work to remove alt + a with default values");

        Meteor.Keybindings.removeOne('alt+b', '#inputTest');
        equal("undefined", typeof Meteor.Keybindings._bindings['keydown/alt+b/#inputTest'],
            "Removes it though with the needed parameteres");

        equal(2, Object.size(Meteor.Keybindings._bindings), "Size of Keybindings are right");

        // Testing removeAll()
        Meteor.Keybindings.removeAll();
        equal(0, Object.size(Meteor.Keybindings._bindings), "Deleted all entries with removeAll");

        // Adding 5 very similiar keys
        Meteor.Keybindings.addOne('alt+a', function () { console.log('context #qunit, keydown'); }, '#qunit');
        Meteor.Keybindings.addOne('alt+a', function () { console.log('context #qunit, keypress'); }, '#qunit', 'keypress');
        Meteor.Keybindings.addOne('alt+a', function () { console.log('context #qunit, body'); }, null, 'keypress');
        Meteor.Keybindings.addOne('alt+a', function () { console.log('context #qunit, body'); }, 'input', 'keypress');
        Meteor.Keybindings.addOne('alt+a', function () { console.log('context #qunit, body'); }, null, undefined);

        equal(5, Object.size(Meteor.Keybindings._bindings), "Got 5 very similiar keybindings set up");

        // Basic checking of properties (from last 5 keybindings)
        ok('#qunit' === Meteor.Keybindings._bindings['keydown/alt+a/#qunit'].context
                && 'keypress' === Meteor.Keybindings._bindings['keypress/alt+a/#qunit'].event
                && 'body' === Meteor.Keybindings._bindings['keypress/alt+a/body'].context
                && 'input' === Meteor.Keybindings._bindings['keypress/alt+a/input'].context
                && 'keydown' === Meteor.Keybindings._bindings['keydown/alt+a/body'].event,
            'The properties of the 5 bindings are right');
    });

    test("Functionality of fancy keybindings (⌃ + ⇧ + P)", 5, function () {
        Meteor.Keybindings.add({
            '⌃+⇧+P': function () {
                console.log("I am ⌃ + ⇧ + P");
            },
            '⌘+⇧+P': function () {
                console.log("I am  ⌘ + ⇧ + P");
            },
            '↑/↓': function () {
                console.log("I am an arrow key");
            }
        }, '#qunit', 'keyup');

        equal(3, Object.size(Meteor.Keybindings._bindings), "Fancy keybindings are added");
        ok(Meteor.Keybindings._bindings['keyup/⌃+⇧+P/#qunit'], 'First keybinding is there');
        ok(Meteor.Keybindings._bindings['keyup/⌘+⇧+P/#qunit'], 'Second is there');
        ok(Meteor.Keybindings._bindings['keyup/↑/↓/#qunit'], 'Third also');
        
        Meteor.Keybindings.remove([
            '⌃+⇧+P',
            '⌘+⇧+P'
        ], '#qunit', 'keyup');
        
        equal(1, Object.size(Meteor.Keybindings._bindings), "Removed 2 fancy keybindings");
    });
}());