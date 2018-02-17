define([], function () {
    'use strict';

    return function (ko) {
        var knockouch = function(library, options) {
            knockouch.options = options || {};
        };

        knockouch.touchLib = {
            isLoaded: function () {
                console.log(window.Hammer);
                return window.Hammer ? true : false;
            },
            optionsList: ['doubletap_distance', 'doubletap_interval', 'drag',
                'drag_block_horizontal', 'drag_block_vertical', 'drag_lock_to_axis',
                'drag_max_touches', 'drag_min_distance', 'hold',
                'hold_threshold', 'hold_timeout', 'prevent_default',
                'release', 'show_touches', 'stop_browser_behavior',
                'swipe', 'swipe_max_touches', 'swipe_velocity',
                'tap', 'tap_max_distance', 'tap_max_touchtime',
                'touch', 'transform', 'transform_always_block',
                'transform_min_rotation', 'transform_min_scale'],
            setMoreOptions: function (bindings) {
                var extendedOptions = knockouch.options;
                var i;
                var optionName;

                for (i in this.optionsList) {
                    if (this.optionsList.hasOwnProperty(i)) {
                        optionName = this.optionsList[i];
                        if (bindings[optionName] !== undefined && bindings[optionName].constructor !== Function) {
                            knockouch.options[optionName] = bindings[optionName];
                        }
                    }
                }
                return extendedOptions;
            },
            wrapper: function (element, touchEventName, handler, bindings) {
                var extendedOptions = this.setMoreOptions(bindings);

                Hammer(element, {threshold: 1, pointers: 0}).on(touchEventName, handler);
            }
        };

        knockouch.touchEvents = ['swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];

        knockouch.makeTouchHandlerShortcut = function (touchEventName) {
            ko.bindingHandlers[touchEventName] = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var handler = valueAccessor();
                    var allBindings = allBindingsAccessor();

                    var wrappedHandler = function(e) {
                        handler(viewModel, e);
                    };

                    knockouch.touchLib.wrapper(element, touchEventName, wrappedHandler, allBindings);
                }
            };
        };

        knockouch.init = function () {
            knockouch.touchEvents.forEach(event => knockouch.makeTouchHandlerShortcut(event));
        };

        //Setting one of the predefined libraries as selected touch library.
        knockouch.init();

        window.knockouch = knockouch;
    };
});
