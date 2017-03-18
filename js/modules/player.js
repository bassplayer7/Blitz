/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var nextId = 0,
        recentScore = 0,
        subscribersActive = true;

    function getPlayerId(id) {
        if (id) {
            nextId = id;
        }

        var playerId = nextId++;

        if (nextId === 0) {
            playerId = 0;
        }

        // Always increment to prepare for next id
        nextId++;
        return playerId;
    }

    var colors = [
        'blue', 'yellow', 'green', 'orange'
    ],
        colorIndex = 0;

    function getColorForPlayer(currentColor) {
        if (currentColor) {
            var index = colors.indexOf(currentColor);

            colorIndex = index + 1;
        }

        if (colorIndex >= colors.length) {
            colorIndex = 0;
        }

        var color = colors[colorIndex];
        colorIndex++;

        return color;
    }

    return function(player) {
        player = player || {};

        var self = this;

        self.id                 = getPlayerId(player.id);
        self.name               = ko.observable(player.name);
        self.score              = ko.observable(player.currentScore || 0); // primary score keeper
        self.color              = ko.observable(player.color || getColorForPlayer());
        self.currentRoundScore  = ko.observable();
        self.leadScore          = ko.observable(false);
        self.tiedScore          = ko.observable(false);
        self.scoreInput         = ko.observable();
        self.roundScore         = ko.observable(player.roundScore);
        self.roundScoreVisible  = ko.observable(false);
        self.lastRecordedRound  = ko.observable(player.lastRecordedRound || 0);
        self.allScores          = ko.observableArray(player.allScores || []);
        self.allScoresVisible   = ko.observable(false);
        self.swipeResult        = ko.observable(false);

        self.colorVariable = function() {
            return `--player-color: var(--${self.color()}); --player-color-r: var(--${self.color()}-r); --player-color-g: var(--${self.color()}-g); --player-color-b: var(--${self.color()}-b)`;
        };

        self.changeColor = function() {
            var current = self.color();
            self.color(getColorForPlayer(current));
        };

        self.currentScore = ko.pureComputed({
            read: () => self.score(),
            write: value => self.score(value)
        });

        self.elementId = function() {
            return 'player_' + self.id;
        };

        self.editingName = ko.observable(!(self.name() && self.name().length > 0));
        self.editName = function() {
            self.editingName(true);
        };

        self.score.subscribe(function() {
            if (subscribersActive) {
                self.incrementRound();
                self.roundScoreVisible(true);
                self.allScores.push({
                    total: self.score(),
                    round: self.roundScore()
                });
                PubSub.publish('score.update', self);
                PubSub.publish('game.save', {});
            }
        });

        self.silentScoreUpdate = function(value) {
            subscribersActive = false;
            self.score(value);
            subscribersActive = true;
        };

        self.editingName.subscribe(function() {
            if (!self.editingName() && (!self.name() || self.name().length < 1)) {
                self.name('Blitzer #' + self.id);
            }
        });

        self.scoreInputIsEmpty = ko.pureComputed(function() {
            return !(self.scoreInput() && self.scoreInput().length > 0);
        });

        self.renderRoundScore = ko.pureComputed(function() {
            self.roundScore();

            if (recentScore > 0) {
                return `+${recentScore}`;
            }

            return recentScore;
        });

        self.toggleAllScoreVisibility = function() {
            if (self.allScores().length > 0) {
                self.allScoresVisible(!self.allScoresVisible());
            }
        };

        self.showRoundScore = ko.pureComputed(function(){
            self.currentScore();

            if (self.roundScoreVisible()) {
                setTimeout(function() {
                    self.roundScoreVisible(false);
                }, 1500);

                return true;
            } else {
                return false;
            }
        });

        var canUpdateRound = true;

        self.incrementRound = function(quiet) {
            var currentRoundNumber = self.lastRecordedRound();

            if (canUpdateRound) {
                self.lastRecordedRound(currentRoundNumber + 1);
                canUpdateRound = false;

                if (!quiet) {
                    PubSub.publish('round.update', self);
                }
            }

            setTimeout(function() {
                canUpdateRound = true;
            }, 60000); // 1m
        };

        self.addScore = function() {
            self.score(parseInt(self.roundScore() || 0) + parseInt(self.score()));
            recentScore = self.roundScore();
            self.roundScore(null);
        };

        self.minusScore = function(model, event) {
            event.currentTarget.focus();

            self.roundScore(self.roundScore() * -1);
            self.score(parseInt(self.roundScore() || 0) + parseInt(self.score()));
            recentScore = self.roundScore();
            self.roundScore(null);
        };

        const RIGHT_SWIPE = 1,
              LEFT_SWIPE = 2;

        self.swipeGesture = function(model, event) {
            if (event.direction === LEFT_SWIPE && self.swipeResult() !== 'left') {
                self.swipeResult('left');
            } else {
                self.swipeResult(false);
            }

            if (event.direction === RIGHT_SWIPE && self.swipeResult() === 'left') {
                self.swipeResult(false);
            }

            event.preventDefault();
        };

        self.resetScores = function() {
            self.allScores([]);
            self.allScoresVisible(false);
        };

        PubSub.subscribe('round.complete', function () {
            canUpdateRound = true;
        });

        PubSub.subscribe('game.reset', this.resetScores);
        PubSub.subscribe('game.clear', this.resetScores);
    }
});