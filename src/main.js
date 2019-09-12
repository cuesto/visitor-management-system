import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueSweetalert2 from 'vue-sweetalert2';


Vue.config.productionTip = false;
axios.defaults.baseURL = 'https://127.0.0.1/';
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
