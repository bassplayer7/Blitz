<template>
    <li class="player" v-bind:style="colorSettings">
        <player-name v-bind:initialName="name"></player-name>
        <button type="button" v-on:click="changeColor" class="change-color"></button>
        <player-score v-bind:initialScore="initialScore"></player-score>

        <button type="button" class="delete" v-on:click="$emit('remove')">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 21 21" class="delete-icon">
                <title>close</title><path d="M2.37,18.63,18.63,2.37M19,19,2,2" style="stroke-linecap: square; stroke-width: 5px;"/>
            </svg>
        </button>

        <score-history v-bind:scoreSheet="scoreSheet"></score-history>
    </li>
</template>

<script>
    import Vue from 'vue';
    import Name from './Player/Name.vue';
    import PlayerScore from "./Player/RoundScore.vue";
    import ScoreHistory from './Player/ScoreHistory.vue';
    import Score from './Score.vue';

    export default {
        name: 'game-player',
        props: ['player', 'index'],
        data() {
            return {
                name: this.player.name || '',
                id: this.player.id,
                score: this.player.score || 0,
                color: this.player.color || this.$parent.getColor(this.index),
                scoreSheet: []
            }
        },
        methods: {
            changeColor() {
                this.color = this.$parent.getNextColor(this.color);
            }
        },
        computed: {
            initialScore() {
                return this.score || 0
            },
            colorSettings() {
                return {
                    '--player-color': `var(--${this.color})`,
                    '--player-color-r': `var(--${this.color}-r)`,
                    '--player-color-g': `var(--${this.color}-g)`,
                    '--player-color-b': `var(--${this.color}-b)`
                };
            }
        },
        components: {
            'score-ref': Score,
            'player-score': PlayerScore,
            'player-name': Name,
            'score-history': ScoreHistory
        }
    }
</script>

<style lang="css" scoped>
    .player {
        border-left: 4px solid var(--player-color);
        padding: 0.5em calc(1em + 1vw);
        z-index: 10;
        margin-bottom: 1em;
        display: grid;
        grid-template-rows: min-content min-content;
        grid-template-columns: minmax(15rem, min-content) min-content;
        grid-column-gap: 2em;
        background-color: rgba(var(--player-color-r), var(--player-color-g), var(--player-color-b), 0.2);
    }

    .change-color {
        width: 1em;
        height: 1.4em;
        border-radius: 2px;
        background-color: var(--player-color);
    }

    .delete {
        grid-area: 1 / 2 / -1 / -1;
        align-self: center;
    }

    .delete-icon {
        stroke: var(--red);
    }
</style>