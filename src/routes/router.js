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
        path:'/',
        name: 'appLogin',
        component:AppLogin
    },
    {
        path:'/home',
        name: 'appHome',
        component:AppHome
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
    /*{
      path: '/login', //criação da rota
      component: Login
    },*/
];

const router = new VueRouter({
    routes,
    mode:'history'
});
 

export default router; // É exportado, mas deve ser importado no vue (main.js)