/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var winPoints = 75;

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    return function(game) {
        var self = this;

        this.leadPlayers = ko.observableArray([]);
        this.gameEndScore = ko.observable(winPoints);

        function calculatePlayerRanking() {
            var i,
                players = game.players(),
                leadScore = this.topScore();

            this.leadPlayers.removeAll();

            for (i in players) {
                players[i].leadScore(false);
                players[i].tiedScore(false);
                if (players[i].currentScore() >= leadScore) {
                    this.leadPlayers.push(players[i]);
                }
            }

            if (!leadScore) {
                return false;
            }

            if (this.leadPlayers().length > 1) {
                for (i in this.leadPlayers()) {
                    this.leadPlayers()[i].tiedScore(true);
                }
            } else {
                this.leadPlayers()[0].leadScore(true);
            }
        };

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
            // When they win show a modal for that
        });

        this.gameEndScore.subscribe(function() {
            game.wasChanged();
        });

        this.remainingPoints = ko.pureComputed(function() {
            var remaining = self.gameEndScore() - self.topScore();
            return remaining > 0 ? remaining : 0;
        });

        this.gameOver = ko.pureComputed(function() {
            return self.remainingPoints() <= 0; // Make sure it's not a tie
        });

        this.fireworks = ko.pureComputed(function() {
            var numberFireworks = 20,
                variations = 6,
                currentVariant = 1,
                fireworkArray = [],
                i = 0;

            for (i; i <= numberFireworks; i++) {
                if (currentVariant > variations) {
                    currentVariant = 1;
                }

                fireworkArray.push({
                    className: 'circle-' + currentVariant,
                    itemStyle: 'animation-delay: ' + i * getRandomArbitrary(100, 170) + 'ms'
                });

                currentVariant++;
            }

            return fireworkArray;
        });

        PubSub.subscribe('score.update', calculatePlayerRanking.bind(this));
        PubSub.subscribe('game.load', calculatePlayerRanking.bind(this));

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('score')) {
                self.gameEndScore(loadedGame.score);
            }
        });
    }
});