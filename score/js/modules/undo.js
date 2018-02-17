/**
 * Created by jessemaxwell on 3/18/17.
 */

/**
 * Created by bassplayer7 on 2/14/17.
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    return function(game) {
        var self = this;

        this.game = game;
        this.plays = ko.observableArray([]);

        this.execute = function() {
            let lastId = self.plays.pop();

            let player = ko.utils.arrayFirst(this.game.players(), function(item) {
                return lastId === item.id;
            });

            if (!player) {
                return false;
            }

            let score = player.score();

            player.silentScoreUpdate(score + (self.getLastScoreFor(player) * -1));
        };

        this.getLastScoreFor = function (player) {
            let lastScore = player.allScores.pop();

            if (lastScore) {
                return parseInt(lastScore.round);
            }

            return 0;
        };

        this.resetPlays = function () {
            self.plays.removeAll();
        };

        PubSub.subscribe('score.update', function (event, data) {
            self.plays.push(data.id);
        });

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('undo')) {
                self.plays(loadedGame.undo);
            }
        });

        PubSub.subscribe('game.reset', this.resetPlays);
        PubSub.subscribe('game.clear', this.resetPlays);
    }
});