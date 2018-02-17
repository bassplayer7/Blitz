import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Lift/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'launchpad',
      component: Home
    },
    {
      path: '/lift',
      name: 'lift',
      component: Dashboard
    }
  ]
})
