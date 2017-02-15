/**
 * Created by bassplayer7 on 2/14/17.
 */

define(['knockout'], function() {
    return function(game) {
        var self = this;

        this.game = game;
        this.round = game.round;

        this.execute = function(players) {
            var playerId = self.getLastPlayerId();

            var player = players.find(player => player.id === playerId);

            // need to get incrementally move beyond just the last player's score
            // need to fix the slide over number when undoing a score
            player.score(player.score() + (self.getLastScoreFor(player) * -1));
            console.log(player);
        };

        this.getLastPlayer = function() {
            console.log(self.game.players());
        };

        this.getLastScoreFor = function (player) {
            var round = self.getRecentPlayers().reverse().find(round => round.id === player.id);
            return parseInt(round.score);
        };

        this.getLastPlayerId = function() {
            var playerArray = self.getRecentPlayers(),
                player = playerArray[playerArray.length - 1];

            if (player && player.id) {
                return player.id;
            }

            return false;
        };

        this.getRecentPlayers = function () {
            var rounds = this.round.rounds(),
                partial = this.round.partialRound;

            if (partial && partial.players.length > 0) {
                return partial.players;
            }

            return rounds[rounds.length - 1].players;
        }
    }
});