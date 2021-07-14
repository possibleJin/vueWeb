import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 直播相关
import TWebLive from 'tweblive'
Vue.prototype.TWebLive = TWebLive


// 引入随机数据
require('./mock.js')

import trtcCalling from './trtc-calling'
import TRTCCalling from 'trtc-calling-js'

window.TRTCCalling = TRTCCalling
window.trtcCalling = trtcCalling

Vue.prototype.trtcCalling = trtcCalling
Vue.prototype.TRTCCalling = TRTCCalling

import tim from './tim' 
import TIM from 'tim-js-sdk'

window.tim = tim 
window.TIM = TIM

Vue.prototype.tim = tim
Vue.prototype.TIM = TIM

Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。




// element-ui相关
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI)

Vue.config.productionTip = false

console.log(TCPlayer)
Vue.prototype.$TCPlayer = TCPlayer

const livePusher = new TXLivePusher();
Vue.prototype.$livePusher = livePusher







new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
