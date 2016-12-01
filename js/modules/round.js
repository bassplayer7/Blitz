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
        this.partialRound = ko.observable({});
        this.roundCounter = ko.observable({}); // notifier

        function markRoundAsComplete() {
            self.rounds.push(self.partialRound());
            self.partialRound({});
            PubSub.publish('round.complete', self.rounds()[self.rounds().length]);
        }

        this.currentRound = ko.pureComputed(function() {
            self.roundCounter();
            return self.findLowestRecordedRound() + 1;
        });

        this.findLastRecordedRound = function() {
            var topRound = 0;

            game.players().forEach(player => {
                if (player.lastRecordedRound() >= topRound) {
                    topRound = player.lastRecordedRound();
                }
            });

            return topRound;
        };

        this.findLowestRecordedRound = function() {
            var topRound = self.findLastRecordedRound(),
                lowestRound = topRound;

            game.players().forEach(player => {
                if (player.lastRecordedRound() <= topRound) {
                    lowestRound = player.lastRecordedRound();
                }
            });

            return lowestRound;
        };

        this.allPlayersOnCurrentRound = function() {
            var playersOnCurrentRound = true,
                topRound = self.findLastRecordedRound();

            // TODO: fix performance problem
            game.players().forEach(player => {
                if (player.lastRecordedRound() < topRound) {
                    playersOnCurrentRound = false;
                }
            });

            return playersOnCurrentRound;
        };

        this.isRoundFinished = function() {
            // var score = game.score.topScore();
            // self.partialRound.notifySubscribers();

            if (self.allPlayersOnCurrentRound()) {
                markRoundAsComplete();
                return true;
            }

            return false;
        };

        // this.scoreUpdateListener = function(player) {
        //     console.log(`${player.name()} score updated`);
        //
        //     // if (self.allUsersHaveScoresFor()) {
        //     //     markRoundAsComplete();
        //     // }
        //
        //     var partialRound = self.partialRound();
        //     partialRound[player.name()] = player.currentRoundScore();
        //
        //     self.partialRound(partialRound);
        //
        //     // if (self.allUsersHaveScoresFor()) {
        //     //     markRoundAsComplete();
        //     // }
        // };

        this.resetRounds = function() {
            ga('send', 'event', 'Rounds', 'Played', 'One Game', self.rounds().length + 1);
            ga('send', 'event', 'Game', 'Played', 'Score to Win', game.score.gameEndScore());
            ga('send', 'event', 'Players', 'Won', 'Lead Player', game.score.leadPlayerName());
            ga('send', 'event', 'Players', 'Top Score', 'Winning Score', game.score.topScore());


            game.players().forEach(player => { player.lastRecordedRound(0) });
        };

        PubSub.subscribe('round.update', function(evt, player) {
            self.roundCounter.notifySubscribers();

            var partialRound = self.partialRound();
            partialRound[player.name()] = player.lastRecordedRound();
            self.partialRound(partialRound);
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