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

        this.loadGameData = function(changeCallback) {
            var data = localStorage.getItem(storageKey),
                loadedGame, players;

            if (!data) {
                return [new Player(null, changeCallback)];
            }

            loadedGame = JSON.parse(data);
            PubSub.publish('perist.load', loadedGame);

            if (loadedGame.hasOwnProperty('players')) {
                players = loadedGame.players;

                for (var item in players) {
                    players[item] = new Player(players[item], changeCallback);
                }
            }

            return players.length > 0 ? players : [new Player(null, changeCallback)];
        };

        window.onbeforeunload = function() {
            self.saveGameData();
        };
    };
});