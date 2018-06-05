import Vue from 'vue'
import Vuex from 'vuex'
import localStorage from './plugins/local-storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: JSON.parse(window.localStorage.getItem('lift') || '{"breakLimit":90}'),
  mutations: {
    updateBreakLimit(state, breakLimit) {
      state.breakLimit = breakLimit
    },
    updateRoundStatus(state, { rounds, transientBreak }) {
      state.rounds = rounds;
      state.transientBreak = transientBreak;
      state.roundTimestamp = new Date();
    },
    clearRoundStatus(state) {
      Vue.delete(state, ['roundCount', 'transientBreak']);
    }
  },
  plugins: [localStorage]
})