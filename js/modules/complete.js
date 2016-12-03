/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/30/16
 */

define(['knockout', 'pubsub'], function (ko, PubSub) {
    return function (game) {
        var self = this;

        this.calculateWinnerModal = ko.observable(false);
        this.closeModal = ko.observable(false);
        this.gameLeaders = ko.observableArray([]);

        this.isGameComplete = function() {
            var gameOver = false,
                gameCanComplete = false;

            if (game.score.remainingPoints() <= 0) {
                gameOver = true;
            }

            if (game.round.isRoundFinished()) {
                gameCanComplete = true;
            }

            if (self.gameLeaders().length > 1) {
                gameCanComplete = false;
            }

            // console.log("Calc: Game Complete");

            return gameOver && gameCanComplete;
        };

        this.showWinnerModal = ko.pureComputed(function() {
            self.calculateWinnerModal();
            return self.isGameComplete() && !self.closeModal();
        });

        this.winnerModalClosing = ko.pureComputed(function() {
            return self.closeModal() === true;
        });

        this.closeModalAction = function () {
            self.closeModal(true);

            setTimeout(function() {
                self.modalCanOpenAgain();
            }, 1000);
        };

        this.modalCanOpenAgain = ko.pureComputed(function() {
            if (game.score.topScore() <= game.score.gameEndScore()) {
                self.closeModal(false);
            }
        });

        this.closeAndReset = function() {
            self.closeModalAction();
            game.resetGame(true);
        };

        PubSub.subscribe('round.complete', function(evt, roundNumber) {
            if (roundNumber > 1) {
                self.calculateWinnerModal.notifySubscribers();
            }
        });

        PubSub.subscribe('score.leaders', function(evt, leaders) {
            self.gameLeaders(leaders);
        });
    }
});