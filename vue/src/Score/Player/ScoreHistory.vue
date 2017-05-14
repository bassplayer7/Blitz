<template>
    <div class="score-history">
        <h4>Scores:</h4>
        <div class="score-table">
            <div class="item">
                <strong class="value">Round</strong>
                <strong class="value">Total</strong>
            </div>
            <ul v-for="score in scoreHistory">
                <li>
                    <span class="value round">{{ round }}</span>
                    <span class="value total">{{ total }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'score-history',
        props: ['score-history'],
        data() {
            return {
                round,
                total
            }
        }
    }
</script>