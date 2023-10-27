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

    bairrosJP : 
    [ 
      "OUTRO",
      "AEROCLUBE",
      "AGUA FRIA",
      "ALTIPLANO",
      "ALTO DO CEU",
      "ANATOLIA",
      "BAIRRO DAS INDUSTRIAS",
      "BANCARIOS",
      "BESSA",
      "BRISAMAR",
      "CABO BRANCO",
      "CASTELO BRANCO",	
      "CENTRO",	
      "CIDADE DOS COLIBRIS",
      "CIDADE VERDE",
      "DISTRITO INDUSTRIAL",
      "ERNANI SATIRO",
      "ESPLANADA",
      "ESTADOS",
      "EXPEDICIONARIOS",
      "FUNCIONARIOS",
      "GRAMAME",
      "ILHA DO BISPO",
      "IPES",
      "JARDIM 13 DE MAIO",
      "JARDIM LUNA",
      "JARDIM OCEANIA",
      "JOAO AGRIPINO",
      "MANAIRA",
      "MANDACARU",
      "MANGABEIRA",	
      "MIRAMAR",
      "PEDRO GONDIM",
      "PORTAL DO SOL",
      "ROGER",
      "SAO JOSE",
      "TAMBAU",	
      "TAMBAUZINHO",
      "TORRE",
      "VALENTINA FIGUEIREDO",
      "VARADOURO"
    ],
    matriculasNomesAgentes: [
      "41416 - ADSON CICERO SOUZA DE MENEZES",
      "41441 - ALEX RIBEIRO DO NASCIMENTO",
      "42650 - ALVARO CABRAL DE MELO JUNIOR",
      "41483 - ANDERSON AMADEU DA SILVA",
      "41491 - ANDERSON DOS SANTOS DIAS",
      "42641 - ANDERSON SOUTO DA SILVA",
      "41521 - ARTHUR CHARLES RODRIGUES CARVALHO LINS",
      "41556 - CARLOS EDSON DE ARAUJO GOMES",
      "41602 - DANIEL MAIA LACERDA",
      "42234 - DANIEL NASCIMENTO SOUZA",
      "41611 - DANIELA GOMES ARAUJO",
      "41629 - DEILTON CICERO DE SOUZA",
      "41637 - DENIELE APOLINARIO BAZILIO DA SILVA",
      "42552 - DENISON GUEDES LIMA CALHEIROS",
      "41653 - DIANA MABELA SOUZA DA SILVA",
      "41700 - EDIJEFFERSON ROSAL FREIRE DE SANTANA",
      "41718 - EDNALDO ALVES DA SILVA",
      "42749 - EMANUEL GOMES DE ASSIS",
      "42714 - EMERSON ALVES BARBOSA",
      "41751 - EMMANUEL RENATO CAVALCANTI DOS SANTOS",
      "41777 - ERIDEYWYD HENRIQUE OMENA F. DA SILVA",
      "42692 - FELIPE AUGUSTO DE PAIVA FLORENCIO",
      "41742 - FELIPE DA SILVA FRAGOSO",
      "41823 - FERNANDO SOUZA DA SILVA MELO",
      "41858 - GERSON OLAVO NUNES",
      "41866 - GISELLY AURELIO DE ARAUJO",
      "41874 - JAMISON ARAUJO DAS NEVES",
      "31909 - JOSE CELESTINO",
      "41939 - JOSE FELIPE DA COSTA SOUZA",
      "41947 - JOSE HILDEMAR PIRES FILHO",
      "41955 - JOSE MARCONE ALVES DE JESUS",
      "41980 - JOSENILDO GOMES RIBEIRO",
      "41998 - JOUBERTH HENRY DE ANDRADE CORREIA",
      "42722 - JULIO CABRAL",
      "42005 - LEONARDO FRANCELINO DOS SANTOS",
      "42030 - LUIS ANTHONY CARDOSO RODRIGUES",
      "42676 - MAILSON SOARES DA SILVA",
      "42579 - MARCONE SAMUEL DE SOUSA",
      "34371 - MARCOS ANTONIO BRITO BEZERRA",
      "40517 - MARIA CELMA DE LIMA RODRIGUES",
      "42072 - MICHELLE FERREIRA GONCALVES",
      "42145 - PEDRO JANSEN DE SOUSA",
      "42153 - PLACIDO DA SILVA SANTOS",
      "42161 - RENATA LEITAO SALLES",
      "42218 - ROSIVAL CARVALHO DE FIGUEIREDO FILHO",
      "42226 - SAULO JOELMIR QUEIROZ DO BU",
      "41432 - THIAGO DIAS DE SOUZA",
      "42684 - VALMIR RODRIGUES DA SILVA",
      "42242 - VERA MARIA DIAS PEREIRA",
      "42277 - WILHAM VAGNER ALVES DA SILVA",
      "42706 - WILLIAM DOS SANTOS MELO",
    ],
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
    setIsPageEditable( state , data )         {
        state.isPageEditable = data;
        // console.log( "No Mutation || isPageEditable " + state );
    },
    setIsAutenticated( state , data )         {
      state.isAutenticated = data;
      // console.log( "No Mutation || isAutenticated " + state );
    },
    setUser( state , data )                   {
        state.user = data;
        // console.log( "Mutation SET USER ===>>> " + JSON.stringify( state.user ) );
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