/** Classe Singleton, que retorna os dados do servidor */  // import SIGOP_API from '@/services/SIGOP_API.js';

import axios from "axios";

export default class ApiService              {
    
    static getInstance()          {
        if ( !ApiService._instance )    {   
              ApiService._instance = new ApiService();
        }
        return ApiService._instance;
    }
  
    async fetchUsernames()        {
      // ...
    }
  
    async fetchPreferences()      {
      // ...
    }
  
    getUsernames()                {
      return this.usernames;
    }
  
    /* Retorna o vetor de tuplas [ MATRICULA - NOME DO AGENTE ]*/
    async getAgentesLabels()      { 
          
          var agentesLabelsVet;
          // alert("- CHAMA AGENTES !!");
          var sendData =    {
              dados:  {
                  entidade: 'agente',
                  operacao: 'consultar'
              }
          };
          try         {
              // ----- var response = await SIGOP_API.post( sendData ); ----- 
              // console.log("-->> ENVIO ... ");
              var response = await axios.post( this.$SERVICES_ENDPOINT_URL, sendData );

              // console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
              var agentes = response.data; // -->>> Isso chama o watcher !
              // console.log( "- Envio... " );
              // console.log("Dados retornados = " +  this.responseData.dados );
              // ---- console.log('-DATA == ' + JSON.stringify(  agentes ).replace( /\\/g, "" )  ); ---- 
               
              var agentesBD = agentes.data;
              //console.log( "-->> agentesBD = " + JSON.stringify( agentesBD ) + "|| tam = " + agentesBD.length );
              for ( var i=0; i<agentesBD.length; i++ )  
              {
                agentesLabelsVet[ i ] = agentesBD[ i ].matricula + " - " + agentesBD[ i ].nome;               
                   // console.log(  "K =>> " + this.Globals.AGENTES_LABELS_BD[i] );
              }
          }  catch ( error )  {
                console.error(error);
          } 
          // console.log( "-- AGENTES = " + JSON.stringify( agentesLabelsVet ) );
    } 
}