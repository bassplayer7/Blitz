/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define(['knockout', 'modules/player'], function(ko, Player) {
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

    return function() {
        var self = this,
            leadPlayer;

        this.setLeadPlayer = function() {
            var i,
                players = self.players(),
                highestPlayer = players[0];

            for (i in players) {
                players[i].leadScore(false);
                if (players[i].currentScore() > highestPlayer.currentScore()) {
                    highestPlayer = players[i];
                }
            }

            highestPlayer.leadScore(true);
        };

        this.playerCallback = function() {
            self.setLeadPlayer();
        };

        self.players = ko.observableArray(loadGameData(this.playerCallback));

        this.addPlayer = function() {
            self.players.push(new Player(null, this.playerCallback));
        };

        this.newGame = function() {
            if (self.players().length < 1) {
                // TODO: fix duplicate
                localStorage.setItem('blitz', '');
                self.players(loadGameData(this.playerCallback));
            } else if (confirm("Are you sure you want to clear this game and start over?")) {
                localStorage.setItem('blitz', '');
                self.players(loadGameData(this.playerCallback));
            }
        };

        this.removePlayer = player => {
            if (player.currentScore() < 1) {
                self.players.remove(player);
            } else if (confirm("Are you sure you want to delete this player?")) {
                self.players.remove(player);
            }
        };

        this.scoring = ko.observable();

        this.scoring.highestPlayer = function(player) {
            return player === leadPlayer;
        };

        self.players.subscribe(saveGameData);
        window.onbeforeunload = function() {
            saveGameData(self.players());
        };

        this.setLeadPlayer();
    };
});