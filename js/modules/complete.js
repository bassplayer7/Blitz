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

        this.isGameComplete = ko.pureComputed(function() { // TODO: Make sure it's not a tie
            self.calculateWinnerModal();

            var gameOver = false,
                gameCanComplete = false;

            if (game.score.remainingPoints() <= 0) {
                gameOver = true;
            }

            if (game.round.isRoundFinished()) {
                gameCanComplete = true;
            }

            if (game.score.leadPlayers().length > 1) {
                gameCanComplete = false;
            }

            return gameOver && gameCanComplete;
        });

        this.showWinnerModal = ko.pureComputed(function() {
            return self.isGameComplete() && !self.closeModal();
        });

        this.winnerModalClosing = ko.pureComputed(function() {
            return self.closeModal() === true;
        });

        this.closeModalAction = function () {
            self.closeModal(true);
        };

        this.closeAndReset = function() {
            self.closeModal(true);
            game.resetGame(true);
        };

        PubSub.subscribe('round.complete', function() {
            self.calculateWinnerModal.notifySubscribers();
        });
    }
});