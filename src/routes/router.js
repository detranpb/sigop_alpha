import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use( VueRouter );

import AppLogin from '@/pages/AppLogin'; // pra não usar ../ usa @ p/ acessar a src
import FormOperacoes from '@/pages/FormOperacoes';
import AddOperacoes from '@/pages/AddOperacoes';
import HistoricoOperacoes from '@/pages/HistoricoOperacoes';
import HistoricoEquipamentos from '@/pages/HistoricoEquipamentos';
import RelatoriosOperacoes from '@/pages/RelatoriosOperacoes';
import AppHome from '@/pages/AppHome';

const routes = [
    {
        path:'/login',
        name: 'appLogin',
        component:AppLogin,
        default: true
    },
    {
        path:'/home',
        name: 'appHome',
        component:AppHome,
    },
    {
        path:'/busca',
        name: 'formOperacoes',
        component:FormOperacoes
    },
    {
        path:'/add-operacoes',
        name: 'addOperacoes',
        component:AddOperacoes
    },
    {
        path:'/historico-operacoes',
        name: 'historicoOperacoes',
        component:HistoricoOperacoes
    },
    {
        path:'/relatorios-operacoes',
        name: 'relatoriosOperacoes',
        component:RelatoriosOperacoes
    },
    {
        path:'/historico-equipamentos',
        name: 'historicoEquipamentos',
        component:HistoricoEquipamentos
    }, 
    {
        path: '/',
        redirect: '/login', // Redirect to the login page by default
      },
];

const router = new VueRouter({
    routes,    
    mode:'hash'
});
 
/*router.beforeEach( ( to, from, next ) =>  {
    
    // Check if the user is authenticated
     // router.app.$store.state.auth.isAuthenticated;
     const isAuthenticated = this.$store.state.isAuthenticated;
  
    // If the route requires authentication and the user is not authenticated,
    // redirect them to the login page
    if ( to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated )  {
        next('/login');
    }   else    {
        next();
    }
});*/


export default router; // É exportado, mas deve ser importado no vue (main.js)