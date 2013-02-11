/*jslint nomen: true*/
/*jslint browser: true*/
/*global Meteor, _, $, jwerty, document */
(function () {
    'use strict';

    $(document).ready(function () {

        /**
         * This is the main class Keybindings. It has important properties like the
         * document body and all the active bindings, together with awesome methods.
         *
         * The keys in the _bindings object is seperated with a / because you need two
         * keys to get to that key, so you'll never get to bind a key with it
         * (;, :, #... etc would also work).
         *
         * @class Keybindings
         * @constructor
         */
        var Keybindings = function () {
            /**
             * Contains informations of the document's body for
             * dom manipulation (binding the keys)
             * @property _body
             * @type Node Element
             */
            this._body = document.body;
            /**
             * A list with all the bindings active / used
             * @property bindings
             * @type Object
             */
            this._bindings = {};
        };

        /**
         * A method to clean up values for the bindingName
         * Nearly nothing to process until now
         *
         * @method unfancy
         *
         * @param value {String} String which should be processed
         * @return {String} The unfancied String
         */

        Keybindings.prototype.unfancy = function (value) {
            // Remove unsupported values
            return value.replace(/[\+]+/g, '');
        };

        /**
         * Adds a new binding to a key event
         *
         * @method addOne
         *
         * @param key {String} Key which the function should be bound to
         * @param binding {Function} Function which should be executed when
         * calling the event on the key
         * @param context {String} CSS3 selector for active context of binding
         * @param event {String} Event type for key
         */
        Keybindings.prototype.addOne = function (key, binding, context, event) {
            /* Brief Overview of all Variables defined here
             * --------------------------------------------
             * keyEvent is a String of the jquery key event http://api.jquery.com/category/events/keyboard-events/
             * keyContext is a jquery selector or document.body (mostly input fields)
             * bindName is the first parameter of bind() http://api.jquery.com/bind/
             * contextString is the jquery selector in String format
             * bindingKey is the key for the _bindings object (all important infos are  in there)
             *
             */
            var keyEvent = 'string' !== typeof event ? 'keydown' : event,
                keyContext = 'string' !== typeof context ? this._body : $(context),
                bindName = this.unfancy(keyEvent + '.' + key),
                contextString = this._body === keyContext ? 'body' : context,
                bindingKey = keyEvent + '/' + key + '/' + contextString;

            if ('string' === typeof key  && 'function' === typeof binding) {
                // process / unfancy() the binding name (for fancy keybinding)
                $(keyContext).bind(bindName, jwerty.event(key, binding));
                this._bindings[bindingKey] = {
                    key: key,
                    func: binding,
                    context: contextString,
                    contextNode: keyContext,
                    event: keyEvent
                };
            }
        };

        /**
         * Add multiple new bindings with one method
         * @method add
         *
         * @param bindings {Object} Object with key as keyboard key / value as function
         * @param context {String} CSS3 selector for active context of binding
         * @param event {String} Event type for key
         */
        Keybindings.prototype.add = function (bindings, context, event) {
            var thisObj = this;
            if (_.isObject(bindings)) {
                _.each(bindings, function (binding, key) {
                    thisObj.addOne(key, binding, context, event);
                });
            }
        };

        /**
         * Check if the keys are binded to the document
         * or if context and event given, for that
         * @method isBinded
         *
         * @param key {String} Key which needs to be checked
         * @param context {String} CSS3 selector for defining where the binding is active
         * @param event {String} Event type for key
         *
         * @return {boolean} True if the key is binded
         */
        Keybindings.prototype.isBinded = function (key, context, event) {
            var keyEvent = 'string' !== typeof event ? 'keydown' : event,
                keyContext = 'string' !== typeof context ? this._body : $(context),
                contextString = this._body === keyContext ? 'body' : context,
                bindingKey = keyEvent + '/' + key + '/' + contextString,
                returnValue = false;

            if (!('undefined' === typeof context && 'undefined' === typeof event)) {
                _.find(this._bindings, function (value, keyValue) {
                    if (value.contextNode.selector === keyContext.selector
                            && value.event === keyEvent && keyValue === bindingKey) {
                        returnValue = true;
                    }
                });
            } else {
                returnValue = _.has(this._bindings, bindingKey);
            }

            return returnValue;
        };

        /**
         * Removes a binding to a key
         *
         * @method removeOne
         *
         * @param key {String} Key which the function should be bound to
         * @param context {String} CSS3 selector for active context of binding
         * @param event {String} Event type for key
         * @return {Boolean} If the key was really binded, successful deletion
         */
        Keybindings.prototype.removeOne = function (key, context, event) {
            var returnValue = false,
                keyEvent = 'string' !== typeof event ? 'keydown' : event,
                keyContext = 'string' !== typeof context ? this._body : $(context),
                bindName = this.unfancy(keyEvent + '.' + key),
                contextString = this._body === keyContext ? 'body' : context,
                bindingKey = keyEvent + '/' + key + '/' +    contextString;

            if (this.isBinded(key, context, event)) {
                $(keyContext).unbind(bindName);
                this._bindings = _.omit(this._bindings, bindingKey);
                returnValue = true;
            }

            return returnValue;
        };

        /**
         * Same like addOne / add, remove multiple bindings at once
         *
         * @method remove
         *
         * @param bindings {Array} Object with value as the keyboard keys
         * @param context {String} CSS3 selector for active context of binding
         * @param event {String} Event type for key
         */
        Keybindings.prototype.remove = function (bindings, context, event) {
            var thisObj = this;
            if (_.isArray(bindings)) {
                _.each(bindings, function (key) {
                    thisObj.removeOne(key, context, event);
                });
            }
        };

        /**
         * And to make removing all easier, a method for that
         *
         * @method removeAll
         */
        Keybindings.prototype.removeAll = function () {
            var thisObj = this;
            _.each(this._bindings, function (obj) {
                thisObj.removeOne(obj.key, obj.context, obj.event);
            });
        };


        /**
         * Replaces current binding with new binding,
         * keeps the context and event the same
         *
         * @method replace
         *
         * @param key {String} Key which the function should be bound to
         * @param newBinding {Function} Function which should be executed
         * @param context {String} CSS3 selector for active context of binding
         * @param event {String} Event type for key
         * @return {Boolean} Succesful replacement
         */
        Keybindings.prototype.replace = function (key, newBinding, context, event) {
            var returnValue = false;

            if (this.isBinded(key, context, event)) {
                // Use removeOne and then addOne
                this.removeOne(key, context, event);
                this.addOne(key, newBinding, context, event);
                returnValue = true;
            }

            return returnValue;
        };

        // Add it to the global Meteor Object
        Meteor.Keybindings = new Keybindings();
    });
}
());