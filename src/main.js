import Vue from 'vue'
import App from './App'
//引入elementui
import './plugins/elementui'
//引入路由
import router from './router'
//引入vuex
import store from './store'
//图片懒加载
import VueLazyload from 'vue-lazyload'
//引入dayjs
import * as dayjs from 'dayjs'
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

Vue.config.productionTip = false

Vue.use(VueLazyload,{
  /* preload:1.3,//预加载的宽高
  loading:"img的加载中的显示的图片的路径",
  error:"img加载失败时现实的图片的路径", */
  attempt:3  //尝试加载的次数
})

//过滤器,时间戳-->日期
Vue.filter('dayFormat',function(value) {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
})
//过滤器,秒-->时-分-秒
Vue.filter('duration',function(value) {
  // value = value * 1000
  let miao = dayjs.duration(value).seconds()
  miao = (Array(2).join(0) + miao).slice(-2)
  let fen = dayjs.duration(value).minutes()
  fen = (Array(2).join(0) + fen).slice(-2)
  let shi = dayjs.duration(value).hours()
  shi = (Array(2).join(0) + shi).slice(-2)
  if(shi <= 0) {
    return fen+':'+miao
  }else {
    return shi+':'+fen+':'+miao
  }
})
//过滤器,播放次数十万以上就显示中文
Vue.filter('playCountFormat',function(value) {
  if(value<99999) {
    return value
  }else {
    return (value / 10000).toFixed(1) + '万'
  }
})

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
