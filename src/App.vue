<template>
  <div id="app">
      <my-modal id="myModal" 
            :message="appModalMessage" 
            :visible="appModalIsVisible"
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
import MyHeader   from './components/MyHeader';
import MyFooter   from './components/MyFooter';
import UtilsMixin from '@/utils/UtilsMixin.js' // --- SE ASSEMELHA A HERANÇA

export default                  
{
    name: 'App',
    mixins: [ UtilsMixin ],
    components:       {
        MyHeader,
        MyFooter,
    },
    data()            {
        return {
          userIsLoggedIn: false,
          appModalIsVisible: false,
          appModalMessage: "Página não autorizada. Acesso restrito."
        }
    },
    created()		                {
        this.checkAuthentication();
    },
    updated() 	                    {
        this.checkAuthentication();
        // alert( "-PAGE: " + this.$route.name );
        // this.getDataOnUpdatePageAPI();
    },
    computed:                       {
      isLoggedIn() {
          return this.userIsLoggedIn
      }
    },
    mounted()       {
        this.$root.$on('showModal', ( modalMsg ) => {
            this.appModalIsVisible = true;
            this.appModalMessage = modalMsg;
        })
    },
    methods:    {
        
        handleLoginResult( { loginResult } )  {
            this.userIsLoggedIn = loginResult;
        },
        /*appTeste()             {
            console.log( "appTESTE !!!! !!!! !!!! " );
        },*/
        handleCloseModal()     {
            this.appModalIsVisible = false;
        },
        checkAuthentication()  {
            
            console.log("- Page name = " + this.$route.name  );
            const cookieAuth = this.$cookies.get('isAuthenticated');
            console.log( "-Cookie? " + cookieAuth );
            
              if ( this.$route.name != "appLogin" )      {
                   /*** if ( ( cookieAuth == false )||( cookieAuth == null ) )       {
                        this.$router.push({
                          path: '/login',
                          replace: true // reload page
                        });
                        this.modalIsVisible = true;
                   }***/
              }
        }
    }
} 
</script>