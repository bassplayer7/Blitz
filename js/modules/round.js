/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/29/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var roundDuration = 0;

    return function (game) {
        var self = this;

        this.game = game;

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
            self.partialRound = defaultPartial();

            console.log(self.rounds());

            PubSub.publish('round.complete', self.rounds().length + 1);
        }

        function roundInfoFrom(player) {
            return {
                id: player.id,
                round: player.lastRecordedRound(),
                score: player.score()
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

            self.partialRound.players.push(roundInfoFrom(player));
            console.log(self.partialRound);

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
            return !self.partialRound.playersOnCurrentRound && game.score.topScore();
        });

        this.resetRounds = function() {
            var roundsPlayed = self.rounds().length + 1,
                endScore = game.score.gameEndScore(),
                leaderName = game.score.leadPlayerName(),
                winningScore =  game.score.topScore(),
                rounds = self.rounds();

            game.players().forEach(player => { player.lastRecordedRound(0) });
            markRoundAsComplete();
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

        this.incrementRoundDuration = function() {
            setInterval(function() {
                roundDuration++;
            }, 1000);
        };

        PubSub.subscribe('round.update', function(evt, player) {
            self.calculateRound(player);
        });

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('rounds')) {
                self.rounds(loadedGame.rounds);
            }

            self.incrementRoundDuration();
        });

        PubSub.subscribe('round.complete', function() {
            ga('send', 'event', 'Round', 'Duration', roundDuration);
            roundDuration = 0;
        });

        PubSub.subscribe('game.reset', this.resetRounds);
        PubSub.subscribe('game.clear', this.resetRounds);
    }
});