/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/29/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    return function (game) {
        var self = this;
        var defaultPartial = function() {
            return {
                players: [],
                lowestRound: 0,
                topRound: 0,
                playersOnCurrentRound: true,
            }
        };

        this.rounds = ko.observableArray([]);
        this.notifier = ko.observable();
        this.partialRound = defaultPartial();

        function markRoundAsComplete() {
            self.rounds.push(self.partialRound);
            console.log("Round #" + self.rounds()[self.partialRound.topRound - 1].topRound + ' was saved');
            self.partialRound = defaultPartial();

            PubSub.publish('round.complete', self.rounds()[self.rounds().length]);
        }

        function roundInfoFrom(player) {
            return {
                id: player.id,
                round: player.lastRecordedRound()
            }
        }

        function finishPreviousRoundAndCreateNew() {
            var players = game.players(),
                match;

            players.forEach(player => {
                match = ko.utils.arrayFirst(self.partialRound.players, function(item) {
                    return player.id === item.id;
                });

                if (!match) {
                    player.incrementRound(true);
                    console.log(roundInfoFrom(player));
                    self.partialRound.players.push(roundInfoFrom(player));
                }
            });

            markRoundAsComplete();
        }

        this.currentRound = ko.pureComputed(function() {
            return self.rounds().length + 1;
        });

        this.calculateRound = function (player) {
            if (player.lastRecordedRound() === 0) {
                return false;
            }

            if (ko.utils.arrayFirst(self.partialRound.players, item => player.id === item.id) && self.partialRound.topRound !== 0) {
                finishPreviousRoundAndCreateNew();
            }

            console.log(roundInfoFrom(player));
            self.partialRound.players.push(roundInfoFrom(player));

            self.partialRound.players.forEach(playerRound => {
                if (playerRound.round >= self.partialRound.topRound) {
                    self.partialRound.topRound = playerRound.round;
                }

                if (playerRound.round <= self.partialRound.topRound) {
                    self.partialRound.lowestRound = playerRound.round;
                }

                self.partialRound.playersOnCurrentRound = !(playerRound.round < self.partialRound.topRound);
            });

            if (self.partialRound.players.length < game.players().length) {
                self.partialRound.playersOnCurrentRound = false;
            }

            if (self.partialRound.playersOnCurrentRound && self.partialRound.topRound !== 0) {
                markRoundAsComplete();
            }

            this.notifier.notifySubscribers();
        };

        this.isRoundFinished = function() {
            return self.partialRound.playersOnCurrentRound === true;
        };

        this.roundCompleteAction = function() {
            finishPreviousRoundAndCreateNew()
        };

        this.canMarkRoundAsComplete = ko.pureComputed(function() {
            self.notifier();
            return !self.partialRound.playersOnCurrentRound;
        });

        this.resetRounds = function() {
            var roundsPlayed = self.rounds().length + 1,
                endScore = game.score.gameEndScore(),
                leaderName = game.score.leadPlayerName(),
                winningScore =  game.score.topScore(),
                rounds = self.rounds();

            game.players().forEach(player => { player.lastRecordedRound(0) });
            self.rounds.removeAll();
            self.partialRound = defaultPartial();

            setTimeout(function() {
                ga('send', 'event', 'Rounds', 'Played', 'One Game', roundsPlayed);
                ga('send', 'event', 'Game', 'Played', 'Score to Win', endScore);
                ga('send', 'event', 'Players', 'Won', 'Lead Player', leaderName);
                ga('send', 'event', 'Players', 'Top Score', 'Winning Score', winningScore);
                ga('send', 'event', 'Game', 'Played', 'Info', ko.toJSON(rounds));
            }, 100);
        };

        PubSub.subscribe('round.update', function(evt, player) {
            self.calculateRound(player);
        });

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('rounds')) {
                self.rounds(loadedGame.rounds);
            }
        });

        PubSub.subscribe('game.reset', this.resetRounds);
        PubSub.subscribe('game.clear', this.resetRounds);
    }
});