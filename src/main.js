import Vue from 'vue';
import vueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';	

import 'font-awesome/css/font-awesome.min.css'
import 'common/less/index.less';

// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts 

Vue.use(ElementUI);
Vue.use(vueResource);
Vue.config.productionTip = false;

//路由守卫，每页跳转到顶部
router.beforeEach((to,from,next) => {
  window.scrollTo(0, 0);
  next();
})
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
