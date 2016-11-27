/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

/**
 * TODO: fix bug that causes name input to disappear if focus is lost when there is no value
 */

define(['knockout'], function(ko) {
    let nextId = 0;

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
        var totalScore = player.currentScore || 0;

        self.id = getPlayerId(player.id);
        self.name = ko.observable(player.name);

        self.color = ko.observable(player.color || getColorForPlayer());

        self.colorVariable = function() {
            return '--player-color: var(--' + self.color() + ')';
        };

        self.changeColor = function() {
            var current = self.color();
            self.color(getColorForPlayer(current));
        };

        self.roundScore = ko.observable(player.roundScore);
        self.scoreFocus = ko.observable(false);

        self.currentScore = ko.pureComputed(() => {
            totalScore = parseInt(self.roundScore() || 0) + parseInt(totalScore);
            return totalScore;
        });

        self.elementId = function() {
            return 'player_' + self.id;
        };

        self.editingName = ko.observable(self.name() && self.name().length > 0 ? false : true);
        self.editName = function() {
            self.editingName(true);
        };

        self.updateScore = function() {
            self.roundScore(null);
        };

        self.currentScore.subscribe(function() {
            if (changeCallback) {
                changeCallback(self);
            }
        });

        self.leadScore = ko.observable(false);

        /**
         * Because the roundScore is calculated when focus is removed from the input, the score actually changes before
         * this function is called. As a result, it takes the previous value of the input and works with that.
         */
        self.minusScore = function() {
            // Take the actual score, convert it to negative and double it (because it was previously added to score)
            var actualRoundScore = (self.roundScore() * -1) * 2;
            // Update the currentScore by adjusting the roundScore
            self.roundScore(actualRoundScore);
            // Clear the input
            self.roundScore(null);
        }
    }
});