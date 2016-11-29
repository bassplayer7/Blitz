/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'modules/player', 'modules/score', 'modules/persist'], function(ko, Player, Score, Persist) {
    return function() {
        var self = this;

        this.score = new Score(self);
        this.persist = new Persist(self);

        this.playerCallback = function() {
            self.score.setPlayerRanking();
            self.persist.saveGameData();
        };

        self.players = ko.observableArray(self.persist.loadGameData(this.playerCallback));

        this.addPlayer = function() {
            self.players.push(new Player(null, this.playerCallback));
        };

        this.removePlayer = function(player) {
            if (player.currentScore() < 1) {
                self.players.remove(player);
            } else if (confirm("Are you sure you want to delete this player?")) {
                self.players.remove(player);
            }
        };

        this.clearGame = function() {
            self.persist.clearGameData();
            ga('send', 'event', 'Game', 'New');
            self.players(self.persist.loadGameData(this.playerCallback));
        };

        this.newGame = function() {
            if (self.players().length < 1) {
                self.clearGame(self.players(), this.playerCallback);
            } else if (confirm("Are you sure you want to clear this game and start over?")) {
                self.clearGame(self.players(), this.playerCallback);
            }
        };

        this.resetGame = function() {
            if (confirm("Are you sure you want to clear all scores?")) {
                self.persist.clearGameData();
                ga('send', 'event', 'Game', 'Reset Scores');
                self.score.clearScores(self.players());
            }
        };

        this.gameInSetupMode = function() {
            return (self.players()[0] && !self.players()[0].name() || !self.score.findTopScore());
        };

        this.gameFirstView = function() {
            return (self.players()[0] && !self.players()[0].name());
        };

        self.players.subscribe(self.persist.saveGameData);
        self.score.setPlayerRanking();
    };
});