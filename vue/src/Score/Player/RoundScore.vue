<template>
    <div class="score">
        <button type="button" v-on:click="decreaseScore">-</button>
        <div class="input-container">
            <label for="round-score" v-bind:class="{ 'is-active': offsetLabel }">Points</label>
            <input class="score-input" id="round-score" type="text" title="Round Score" ref="roundScore" v-model="roundScore" v-on:update="roundScore = 0" v-on:focus="moveLabel" v-on:blur="moveLabel"/>
        </div>
        <button class="score-button" type="button" v-on:click="increaseScore">+</button>
        <div class="total-score" v-model="score">{{ score }}</div>
    </div>
</template>

<script>
    export default {
        name: 'player-score',
        props: ['initialScore'],
        data () {
            return {
                score: this.initialScore || 0,
                roundScore: null,
                activeLabel: false
            }
        },

        computed: {
            offsetLabel() {
                return this.activeLabel || (this.roundScore && this.roundScore.length > 0);
            }
        },

        methods: {
            increaseScore: function () {
                this.score = this.score + parseInt(this.roundScore || 1);
                this.scoreUpdate();
            },

            decreaseScore: function () {
                this.score = this.score - parseInt(this.roundScore || 1);
                this.scoreUpdate();
            },

            scoreUpdate: function () {
                this.$emit('updateScore', this.roundScore);
                this.roundScore = null;
            },

            moveLabel() {
                this.activeLabel = !this.activeLabel;
            },

            replaceLabel() {
                this.activeLabel = !this.activeLabel;
            }
        }
    }
</script>

<style lang="scss" scoped="player-score">
    .score {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .input-container {
        position: relative;
        background-color: var(--white);
    }

    label {
        position: absolute;
        font-size: 1.1em;
        transition: transform 150ms ease-in-out, opacity 150ms ease-in-out;
        top: 50%;
        transform: translateY(-50%);
        padding: 0.5em;
        color: var(--mid-gray);
        z-index: 1;

        &.is-active {
            opacity: 0.85;
            transform: translate(-0.4em, -90%) scale(0.7);
        }
    }

    input {
        display: block;
        border-radius: 0;
        border-width: 0 1px var(--border-heavy);
        background-color: transparent;
        width: 6rem;
        -webkit-appearance: none;
        font-size: 1.1em;
        padding: 0.8em 0.5em 0.6em;
        position: relative;
        z-index: 2;
    }

    button {
        background-color: #fff;
        border: 0 solid var(--mid-gray);
        transition: opacity 200ms ease-out, width 200ms ease-out, padding 200ms ease-out, border 200ms ease-out;
        overflow: hidden;
    }
</style>