/**
 * @by SwiftOtter, Inc. 2/12/18
 * @website https://swiftotter.com
 **/

import NoSleep from 'nosleep.js'

export default {
  install(Vue) {
    const noSleep = new NoSleep();


    const activateStayAlert = () => {
      noSleep.enable();
      document.removeEventListener('click', activateStayAlert, false);
    };

    Vue.prototype.stayAwake = activateStayAlert;
    Vue.prototype.allowSleep = () => noSleep.disable();
  }
}
