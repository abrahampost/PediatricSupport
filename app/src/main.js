import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import axios from './config/axiosInstance';

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
