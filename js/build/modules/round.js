"use strict";define(["knockout","pubsub"],function(n,r){var o=0;return function(e){function t(){d.rounds.push(d.partialRound),d.partialRound=i(),r.publish("round.complete",d.rounds().length+1)}function u(n){return{id:n.id,round:n.lastRecordedRound()}}function a(){var r,o=e.players();o.forEach(function(o){r=n.utils.arrayFirst(d.partialRound.players,function(n){return o.id===n.id}),r||(o.incrementRound(!0),d.partialRound.players.push(u(o)))}),t()}var d=this,i=function(){return{players:[],lowestRound:0,topRound:0,playersOnCurrentRound:!0}};this.rounds=n.observableArray([]),this.notifier=n.observable(),this.partialRound=i(),this.currentRound=n.pureComputed(function(){return d.rounds().length+1}),this.calculateRound=function(r){return 0!==r.lastRecordedRound()&&(n.utils.arrayFirst(d.partialRound.players,function(n){return r.id===n.id})&&0!==d.partialRound.topRound&&a(),d.partialRound.players.push(u(r)),d.partialRound.players.forEach(function(n){n.round>=d.partialRound.topRound&&(d.partialRound.topRound=n.round),n.round<=d.partialRound.topRound&&(d.partialRound.lowestRound=n.round),d.partialRound.playersOnCurrentRound=!(n.round<d.partialRound.topRound)}),d.partialRound.players.length<e.players().length&&(d.partialRound.playersOnCurrentRound=!1),d.partialRound.playersOnCurrentRound&&0!==d.partialRound.topRound&&t(),void this.notifier.notifySubscribers())},this.isRoundFinished=function(){return d.partialRound.playersOnCurrentRound===!0},this.roundCompleteAction=function(){a()},this.canMarkRoundAsComplete=n.pureComputed(function(){return d.notifier(),!d.partialRound.playersOnCurrentRound&&e.score.topScore()}),this.resetRounds=function(){var r=d.rounds().length+1,o=e.score.gameEndScore(),u=e.score.leadPlayerName(),a=e.score.topScore(),s=d.rounds();e.players().forEach(function(n){n.lastRecordedRound(0)}),t(),d.rounds.removeAll(),d.partialRound=i(),setTimeout(function(){ga("send","event","Rounds","Played","One Game",r),ga("send","event","Game","Played","Score to Win",o),ga("send","event","Players","Won","Lead Player",u),ga("send","event","Players","Top Score","Winning Score",a),ga("send","event","Game","Played","Info",n.toJSON(s))},100)},this.incrementRoundDuration=function(){setInterval(function(){o++},1e3)},r.subscribe("round.update",function(n,r){d.calculateRound(r)}),r.subscribe("perist.load",function(n,r){r.hasOwnProperty("rounds")&&d.rounds(r.rounds),d.incrementRoundDuration()}),r.subscribe("round.complete",function(){ga("send","event","Round","Duration",o),o=0}),r.subscribe("game.reset",this.resetRounds),r.subscribe("game.clear",this.resetRounds)}});