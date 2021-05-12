import Vue from 'vue'
import VApp from './App.vue';
import App from "@/classes/App";
import router from "@/router";
import store from "@/store";
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'
import i18n from "@/plugins/i18n";
import VueClipboard from 'vue-clipboard2'

Vue.use(Vuetify);
Vue.use(VueClipboard)

App.init();
Vue.prototype.$sdk = App.sdk();

/* eslint-disable no-new */
new Vue({
  vuetify : new Vuetify(),
  i18n,
  el: '#app',
  router,
  store,
  render: h => h(VApp)
})