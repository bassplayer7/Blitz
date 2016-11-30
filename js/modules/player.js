/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'pubsub'], function(ko, PubSub) {
    var nextId = 0;

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

    return function(player, changeCallback) {
        player = player || {};

        var self = this;

        self.id = getPlayerId(player.id);
        self.name = ko.observable(player.name);
        self.score = ko.observable(player.currentScore || 0); // primary score keeper
        self.color = ko.observable(player.color || getColorForPlayer());
        self.currentRoundScore = ko.observable();

        self.colorVariable = function() {
            return '--player-color: var(--' + self.color() + ')';
        };

        self.changeColor = function() {
            var current = self.color();
            self.color(getColorForPlayer(current));
        };

        self.roundScore = ko.observable(player.roundScore);
        self.scoreFocus = ko.observable(false);

        self.currentScore = ko.pureComputed({
            read: function() {
                self.score(parseInt(self.roundScore() || 0) + parseInt(self.score()));
                self.currentRoundScore(self.roundScore());
                self.roundScore(null);
                return self.score();
            },
            write: function(value) {
                self.score(value);
            }
        });

        self.elementId = function() {
            return 'player_' + self.id;
        };

        self.editingName = ko.observable(self.name() && self.name().length > 0 ? false : true);
        self.editName = function() {
            self.editingName(true);
        };

        self.updateScore = function() {};

        self.scoreInput = ko.observable();

        self.currentScore.subscribe(function() {
            PubSub.publish('score.update', self);
            if (changeCallback) {
                changeCallback(self);
            }
        });

        self.editingName.subscribe(function() {
            if (!self.editingName() && (!self.name() || self.name().length < 1)) {
                self.name('Blitzer #' + self.id);
            }
        });

        self.leadScore = ko.observable(false);
        self.tiedScore = ko.observable(false);

        self.scoreInputIsEmpty = ko.pureComputed(function() {
            return !(self.scoreInput() && self.scoreInput().length > 0);
        });

        /**
         * Because the roundScore is calculated when focus is removed from the input, the score actually changes before
         * this function is called. As a result, it takes the previous value of the input and works with that.
         */
        self.minusScore = function() {
            // Take the actual score, convert it to negative and double it (because it was previously added to score)
            var actualRoundScore = (this.currentRoundScore() * -1) * 2;
            // Update the currentScore by adjusting the roundScore
            self.roundScore(actualRoundScore);
        }
    }
});