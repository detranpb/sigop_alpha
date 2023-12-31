import Vue from 'vue'
import App from './App.vue'
import router from './routes/router.js';
import store  from './store/store.js';
import VueCookies from 'vue-cookies';
import MyModal from '@/components/MyModal.vue';
import KnobControl from 'vue-knob-control'
  
Vue.use( KnobControl )
Vue.component( 'my-modal', MyModal );
Vue.use( store );
Vue.use( VueCookies );

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
console.log( Vue.version );

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use( BootstrapVue )
// Optionally install the BootstrapVue icon components plugin
Vue.use( IconsPlugin  )
Vue.mixin({
  methods: {
    helloWorld()   {
        alert("Hello world");
    }
  }
});

// ---- Constantes da Aplicação ----
Vue.prototype.$appName = 'My App'
Vue.prototype.$TOTAL_AGENTES_POR_OPERACAO = 30 // TODO: IMPOR LIMITE !!!!!!
Vue.prototype.$SERVICES_ENDPOINT_URL = 'http://184.72.238.232/policiamento/policiamento-services.php'

// Vue.prototype.$SERVICES_ENDPOINT_URL = 'http://localhost/policiamento/policiamento-services.php'
Vue.prototype.$IS_MOBILE_APP = ( document.documentElement.clientWidth < 620 ) ? true : false;	

/* --------------------- FORT AWESOME ICONS -----------------------*/
import { library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-free/css/all.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faSignOutAlt, faPlus, faSearch, faTimeline, faChartBar, faSort, faTrashAlt, faDatabase, faLock } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add( faUserSecret )
library.add( faSignOutAlt )
library.add(  faPlus  )
library.add( faSearch )
library.add( faTimeline )
library.add( faChartBar )
library.add( faSort )
library.add( faTrashAlt )
library.add( faDatabase )
library.add( faLock )

/* add font awesome icon component */
Vue.use( 'font-awesome-icon', FontAwesomeIcon )
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