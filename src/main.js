import Vue from 'vue'
import App from './App.vue'
import router from './routes/router.js';
import store  from './store/store.js';

import MyModal from '@/components/MyModal.vue';
import KnobControl from 'vue-knob-control'

Vue.use( KnobControl )
Vue.component('my-modal', MyModal);

Vue.use( store );

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

console.log(Vue.version);

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use( BootstrapVue )
// Optionally install the BootstrapVue icon components plugin
Vue.use( IconsPlugin )


// -------- Constantes da Aplicação --------
Vue.prototype.$appName = 'My App'
Vue.prototype.$TOTAL_AGENTES_POR_OPERACAO = 2 // TODO: IMPOR LIMITE !!!!!!

Vue.prototype.$SERVICES_ENDPOINT_URL = 'http://localhost/policiamento/policiamento-services.php'

/* --------------------- FORT AWESOME ICONS -----------------------*/
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-free/css/all.css'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)
/* add font awesome icon component */
Vue.use('font-awesome-icon', FontAwesomeIcon)



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')


/*new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})*/