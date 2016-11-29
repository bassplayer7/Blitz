/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

require.config({
    paths: {
        knockout: './lib/knockout-3.4.1',
        pubsub: './lib/pubsub.min'
    }
});

requirejs(['knockout', 'modules/game'], function(ko, Game) {
    ko.applyBindings(new Game);
});