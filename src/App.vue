<template>
  <div id="app">
      <my-modal id="myModal" message="Página não autorizada. Acesso restrito." 
            :visible="modalIsVisible"
            @on-close-modal="handleCloseModal()"
            @on-accept-modal="handleAcceptModal()"
            @on-reject-modal="handleRejectModal()">
      </my-modal>

      <MyHeader/>
      <router-view path="$router.key"/>
      <MyFooter/>
  </div>
</template>

<script>
import './styles/global.css';

import MyHeader from './components/MyHeader';
import MyFooter from './components/MyFooter';
import { ChartPlugin } from '@syncfusion/ej2-vue-charts';

Vue.use( ChartPlugin )

export default      {
    name: 'App',
    components: {
      MyHeader,
      MyFooter,
    },
    data() {
      return {
        userIsLoggedIn: false,
        modalIsVisible: false
      }
    },
    created()		      {
        this.checkAuthentication();
    },
    updated() 	      {
        this.checkAuthentication();
    },
    computed:   {
      isLoggedIn() {
          return this.userIsLoggedIn
      }
    },
    methods:    {
        handleLoginResult( { loginResult } )  {
            this.userIsLoggedIn = loginResult;
        },
        handleCloseModal()              {
            this.modalIsVisible = false;
        },
        checkAuthentication()           {
            
            console.log("- Page name = " + this.$route.name  );
            const cookieAuth = this.$cookies.get('isAuthenticated');
            console.log( "-Cookie? " + cookieAuth );
            
              if ( this.$route.name != "appLogin" )      {
                  if ( ( cookieAuth == false )||( cookieAuth == null ) )       {
                        this.$router.push({
                          path: '/login',
                          replace: true // reload page
                        });
                        this.modalIsVisible = true;
                  }
              }
        }
    }
} 
</script>