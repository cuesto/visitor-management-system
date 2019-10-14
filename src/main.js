import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueSweetalert2 from 'vue-sweetalert2';


Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://localhost:44360/'; //dev
//axios.defaults.baseURL = 'https://vmsweb20191012024111.azurewebsites.net/'; //publish dev
//axios.defaults.baseURL = 'http://192.168.1.2:53280'; //prod

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");;

Vue.use(VueSweetalert2);

new Vue({
  router, 
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
