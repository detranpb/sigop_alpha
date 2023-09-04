import Vue from 'vue';
import Vuex from 'vuex';

Vue.use( Vuex );

const store = new Vuex.Store( {
  state:      {
    /* true  - pág. Cadastro OU Edição em Historico/Busca. 
       false - Historico/Busca 
       sempre setado no created() de cada componente
       */
    isPageEditable: -1, 
    isAutenticated: false,
    user: {
        nome:null,
        sobrenome: null,
        matricula: null,
        cpf: null,
    },
    listaAgentes: [],
    listaLabelAgentes: [], /*Strings: MATRICULA - NOME */

    matriculasValidas: [ 
        41416, 
        41441, 
        42650, 
        41483, 
        41491, 
        42641, 
        41521, 
        41556, 
        41602, 
        42234, 
        41611, 
        41629, 
        41637, 
        42552, 
        41653, 
        41700, 
        41718, 
        42749, 
        42714, 
        41751, 
        41777, 
        42692, 
        41742, 
        41823, 
        41858, 
        41866, 
        41874, 
        31909, 
        41939, 
        41947, 
        41955, 
        41980, 
        41998, 
        42722, 
        42005, 
        42030, 
        42676, 
        42579, 
        34371, 
        40517, 
        42072, 
        42145, 
        42153, 
        42161, 
        42218, 
        42226, 
        41432, 
        42684, 
        42242, 
        42277, 
        42706
    ],
  },
  mutations:  {

    setEquipsSelecionadosIDs( state , data )  {
        state.equipsSelecionadosIDs = data;
    },
    setIsPageEditable( state , data )   {
        state.isPageEditable = data;
        // console.log( "No Mutation || isPageEditable " + state );
    },
    setIsAutenticated( state , data )   {
      state.isAutenticated = data;
      console.log( "No Mutation || isAutenticated " + state );
    },
    setUser( state , data )             {
        state.user = data;
        console.log( "Mutation SET USER ===>>> " + JSON.stringify( state.user ) );
    },
    setListaAgentes( state , data ) 
    {
      state.listaAgentes = data;
      /***** console.log( "Lista Agentes !! = " + state );
      console.log( state.listaAgentes[0].nome + " - " + state.listaAgentes[0].matricula ); *****/
      
      for( var i=0; i<state.listaAgentes.length; i++ ) 
      {
        state.listaLabelAgentes[ i ] = state.listaAgentes[ i ].matricula + " - " + state.listaAgentes[ i ].nome; 
        // console.log( state.listaLabelAgentes[ i ] );
      }                    
      
    }
  },
  actions: {
    updateMessage({ commit }, newMessage) {
         commit('setMessage', newMessage);
    }
  }
});

export default store;