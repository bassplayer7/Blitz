/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

define([
    'knockout',
    'pubsub',
    'hammerjs',
    'modules/player',
    'modules/score',
    'modules/persist',
    'modules/round',
    'modules/complete',
    'modules/undo'
], function(ko, PubSub, HammerJS, Player, Score, Persist, Round, Complete, Undo) {
    return function() {
        var self = this;

        self.players = ko.observableArray([new Player()]);

        this.persist = new Persist(self);
        this.score = new Score(self);
        this.round = new Round(self);
        this.complete = new Complete(self);
        this.undo = new Undo(self);
        this.entryInProgress = true;

        this.addPlayer = function() {
            self.players.push(new Player());
        };

        this.removePlayer = function(player) {
            if (player.currentScore() < 1) {
                self.players.remove(player);
            } else if (confirm("Are you sure you want to delete this player?")) {
                self.players.remove(player);
            }
        };

        this.undoLastScore = function() {
            self.undo.execute();
        };

        this.clearGame = function() {
            PubSub.publish('game.clear', {});
            self.persist.clearGameData();
            ga('send', 'event', 'Game', 'New');
            self.players(self.persist.loadGameData());
        };

        this.newGame = function() {
            if (self.players().length < 1) {
                self.clearGame(self.players());
            } else if (confirm("Are you sure you want to clear this game and start over?")) {
                self.clearGame(self.players());
            }
        };

        this.resetGame = function(noConfirm) {
            if (noConfirm === true || confirm("Are you sure you want to clear all scores?")) {
                ga('send', 'event', 'Game', 'Reset Scores');
                PubSub.publish('game.reset', {});
                self.persist.clearGameData();
            }
        };

        this.gameInSetupMode = function() {
            return (self.players()[0] && !self.players()[0].name() || !self.score.topScore());
        };

        this.gameFirstView = function() {
            return (self.players()[0] && !self.players()[0].name());
        };

        var scoreTimeout = null;

        this.scoreBeingEntered = function() {
            self.entryInProgress = true;
            window.clearTimeout(scoreTimeout);

            scoreTimeout = window.setTimeout(function() {
                self.entryInProgress = false;
            }, 1000);
        };

        this.centerGame = function() {
            setTimeout(function() {
                if (!self.entryInProgress) {
                    window.scroll({
                        top: document.getElementsByClassName('scoreboard__block')[0].offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        };

        this.tipsVisible = ko.observable(false);

        this.toggleUserHelp = function() {
            self.tipsVisible(!self.tipsVisible());
        };

        self.players.subscribe(self.persist.saveGameData);

        PubSub.subscribe('perist.load', function(name, loadedGame) {
            if (loadedGame.hasOwnProperty('players')) {
                var players = loadedGame.players;

                for (var item in players) {
                    players[item] = new Player(players[item]);
                }

                self.players(players);
            }

            PubSub.publish('game.ready', {});
        });

        PubSub.publish('game.load', self);

        [].forEach.call(document.getElementsByClassName('js-vote'), voteEl => {
            voteEl.addEventListener('click', vote => {
                vote.removeAttribute('onclick');
                vote.textContent = 'Thanks!';
            });
        });
    };
});