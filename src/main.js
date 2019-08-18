import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Snotify from 'vue-snotify';
import 'vue-snotify/styles/material.css';

Vue.config.productionTip = false;
axios.defaults.baseURL = 'https://localhost:44360/';
Vue.use(Snotify);

new Vue({
  router,
  store,
  vuetify,
  //Snotify,
  render: h => h(App)
}).$mount('#app')
