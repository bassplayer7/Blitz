/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var winPoints = 75;

    return function(game) {
        var self = this;

        this.leadPlayers = ko.observableArray([]);
        this.gameEndScore = ko.observable(winPoints);
        this.closeModal = ko.observable(false);

        function calculatePlayerRanking() {
            var i,
                players = game.players(),
                leadScore = self.topScore();

            self.leadPlayers.removeAll();

            for (i in players) {
                players[i].leadScore(false);
                players[i].tiedScore(false);
                if (players[i].currentScore() >= leadScore) {
                    self.leadPlayers.push(players[i]);
                }
            }

            if (!leadScore) {
                return false;
            }

            if (self.leadPlayers().length > 1) {
                for (i in self.leadPlayers()) {
                    self.leadPlayers()[i].tiedScore(true);
                }
            } else {
                self.leadPlayers()[0].leadScore(true);
            }
        }

        /**
         * Returns top score unless all are 0
         * Returns false if all scores are 0
         */
        this.topScore = ko.pureComputed(function() {
            if (!game.players()[0]) {
                return false;
            }

            var i,
                players = game.players(),
                topScore = players[0].currentScore(),
                zeroScore = true;

            for (i in players) {
                if (players[i].currentScore() !== 0) {
                    zeroScore = false;
                }

                if (players[i].currentScore() > topScore) {
                    topScore = players[i].currentScore();
                }
            }

            return zeroScore ? false : topScore;
        });

        this.clearScores = function() {
            var players = game.players(), i;

            for (i in players) {
                players[i].currentScore(0);
            }
        };

        this.leadPlayerName = ko.pureComputed(function() {
            var lead = self.leadPlayers();

            if (lead.length > 0) {
                return lead[0].name();
            }
        });

        this.gameEndScore.subscribe(function() {
            PubSub.publish('game.save', {});
        });

        this.remainingPoints = ko.pureComputed(function() {
            var remaining = self.gameEndScore() - self.topScore();
            return remaining > 0 ? remaining : 0;
        });

        PubSub.subscribe('score.update', function() {
            calculatePlayerRanking.call(this);
        });

        PubSub.subscribe('game.ready', calculatePlayerRanking.bind(this));

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('score')) {
                self.gameEndScore(loadedGame.score);
            }

            calculatePlayerRanking.call(self);
        });

        PubSub.subscribe('game.reset', function() {
            self.clearScores();
        });
    }
});