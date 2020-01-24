import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueSweetalert2 from "vue-sweetalert2";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://localhost:53280/"; //dev
//axios.defaults.baseURL = 'https://vmsweb20191012024111.azurewebsites.net/'; //publish dev
//axios.defaults.baseURL = 'http://192.168.1.2:53280'; //prod

axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

// axios.interceptors.response.use(
//   response => {
//     console.log("response successfull", response);
//     return response;
//   },
//   err => {
//     const {
//       config,
//       response: { status, data }
//     } = err;
//     console.log("response error",err.response.data);

//   }
// );

Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
