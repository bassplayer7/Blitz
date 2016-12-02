/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/28/16
 */

define(['knockout', 'pubsub', 'modules/player'], function(ko, PubSub, Player) {
    var storageKey = 'blitz';

    return function(game) {
        var self = this;

        this.clearGameData = function() {
            localStorage.setItem(storageKey, '');
        };

        this.saveGameData = function() {
            var dataObj = {};
            dataObj.players = game.players();
            dataObj.score = game.score.gameEndScore();
            dataObj.rounds = game.round.rounds();

            localStorage.setItem(storageKey, ko.toJSON(dataObj));
        };

        this.loadGameData = function() {
            var data = localStorage.getItem(storageKey),
                loadedGame,
                players = [];

            if (!data) {
                return [new Player()];
            }

            loadedGame = JSON.parse(data);
            PubSub.publish('perist.load', loadedGame);

            return players.length > 0 ? players : [new Player()];
        };

        window.onbeforeunload = function() {
            self.saveGameData();
        };

        PubSub.subscribe('game.save', function() {
            self.saveGameData();
        });

        /**
         * Primary entry point
         */
        PubSub.subscribe('game.load', function() {
            self.loadGameData();
        });
    };
});