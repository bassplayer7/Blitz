<template>
    <div>
        <div class="name" v-on:click="editName" v-show="!isEditingName">{{ name }}</div>
        <div v-show="isEditingName">
            <input class="name-input" type="text" ref="name" placeholder="Your name" v-model="name" v-on:blur="finishEditName"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'player-name',
        props: ['initialName'],
        data () {
            return {
                name: this.initialName,
                isEditingName: !(this.initialName && this.initialName.length)
            }
        },

        methods: {
            editName: function () {
                this.isEditingName = true;
                Vue.nextTick(() => this.$refs.name.focus() );
            },

            finishEditName: function () {
                if (this.name.length > 0) {
                    this.isEditingName = false;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .name {
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 1.3em);
    }
</style>