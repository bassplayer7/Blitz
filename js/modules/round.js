/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/29/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var roundLength = 30000;

    return function (game) {
        var self = this;

        this.rounds = ko.observableArray([]);

        var partialRound = {},
            newRoundAllowed = true,
            roundTimer;

        function markRoundAsComplete() {
            self.rounds.push(partialRound);
            partialRound = {};
            newRoundAllowed = false;
        }

        this.allUsersHaveRoundScores = function() {
            var players = game.players(),
                i;

            for (i in players) {
                if (!partialRound[players[i].name()]) {
                    return false;
                }
            }

            return true;
        };

        this.roundIsFinished = function() {
            // roundTimer = setTimeout(function() {
            //     newRoundAllowed = true;
            // }, roundLength);

            // TODO: fix bug that causes first person to pass winning point to get the prize. It needs to wait until all scores are entered

            if (self.allUsersHaveRoundScores()) {
                newRoundAllowed = true;
            }

            return newRoundAllowed;
        };

        this.newScore = function(player) {
            if (self.allUsersHaveRoundScores()) {
                markRoundAsComplete();
            }

            if (partialRound[player.name()] && this.roundIsFinished()) {
                // Save Previous Round
                this.rounds.push(partialRound);
                partialRound = {};
                newRoundAllowed = false;
            }

            partialRound[player.name()] = player.currentRoundScore();
        };

        this.resetRounds = function() {
            ga('send', 'event', 'Rounds', 'Played', 'One Game', self.rounds().length + 1);
            ga('send', 'event', 'Game', 'Played', 'Score to Win', game.score.gameEndScore());
            ga('send', 'event', 'Players', 'Won', 'Lead Player', game.score.leadPlayerName());
            ga('send', 'event', 'Players', 'Top Score', 'Winning Score', game.score.topScore());
            self.rounds.removeAll();
        };

        PubSub.subscribe('score.update', function (evt, player) {
            self.newScore(player);
        });

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('rounds')) {
                self.rounds(loadedGame.rounds);
            }
        });

        PubSub.subscribe('game.reset.before', this.resetRounds);
        PubSub.subscribe('game.clear.before', this.resetRounds);
    }
});