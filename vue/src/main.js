import Vue from 'vue'
import Score from './Score.vue'
import Teams from './Teams.vue'

const NotFound = { template: '<p>There\'s nothing to see here.</p>'};

const routes = {
  '/': Score,
  '/teams': Teams
};

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent() {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
});
