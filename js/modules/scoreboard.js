/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'modules/player'], function(ko, Player) {
    function clearGameData() {
        localStorage.setItem('blitz', '');
    };

    function saveGameData(players) {
        var playerJSON = ko.toJSON(players);
        localStorage.setItem('blitz', playerJSON);
    };

    function loadGameData(changeCallback) {
        var data = localStorage.getItem('blitz'),
            players;

        if (data) {
            players = JSON.parse(data);

            for (var item in players) {
                players[item] = new Player(players[item], changeCallback);
            }
        }

        return players || [new Player(null, changeCallback)];
    }

    function clearScores(players) {
        var i;

        for (i in players) {
            players[i].currentScore(0);
        }
    }

    return function() {
        var self = this,
            leadPlayer;

        /**
         * Returns top score unless all are 0
         * Returns false if all scores are 0
         */
        this.findTopScore = function() {
            var i,
                players = self.players(),
                topScore = players[0].currentScore(),
                zeroScore = true;

            for (i in players) {
                if (players[i].currentScore() !== 0) {
                    zeroScore = false;
                }

                if (players[i].currentScore() > topScore) {
                    topScore = players[i].currentScore();
                }
            }

            return zeroScore ? false : topScore;
        };

        this.setPlayerRanking = function() {
            var i,
                players = self.players(),
                highestPlayers = [],
                leadScore = this.findTopScore();

            for (i in players) {
                players[i].leadScore(false);
                players[i].tiedScore(false);
                if (players[i].currentScore() >= leadScore) {
                    highestPlayers.push(players[i]);
                }
            }

            if (!leadScore) {
                return false;
            }

            if (highestPlayers.length > 1) {
                for (i in highestPlayers) {
                    highestPlayers[i].tiedScore(true);
                }
            } else {
                highestPlayers[0].leadScore(true);
            }
        };

        this.playerCallback = function() {
            self.setPlayerRanking();
            saveGameData(self.players());
        };

        self.players = ko.observableArray(loadGameData(this.playerCallback));

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
            clearGameData();
            this.players(loadGameData(this.playerCallback));
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
                clearGameData();
                clearScores(self.players());
            }
        };

        this.scoring = ko.observable();
        this.scoring.highestPlayer = function(player) {
            return player === leadPlayer;
        };

        self.players.subscribe(saveGameData);
        this.setPlayerRanking();

        window.onbeforeunload = function() {
            saveGameData(self.players());
        };
    };
});