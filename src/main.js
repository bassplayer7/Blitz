// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Caffeine from '@/lib/caffeine'
import store from './store/index'

Vue.config.productionTip = false

Vue.use(Caffeine)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Always copy/paste the following into sw.js
// const cacheFirst = workboxSW.strategies.cacheFirst({cacheName: 'googleapis'});
//workboxSW.router.registerRoute(new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'), cacheFirst);
