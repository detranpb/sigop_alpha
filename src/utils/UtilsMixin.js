import axios from 'axios';

const UtilsMixin = {
    data()      {
      return {
            msg: 'Você clicou no botão',
            DATA_ATUAL:'',
            AGENTES_LABELS_BD: [],  /* Vetor de strings matricula - nome */
            
            /**modalIsVisible: false,
            modalMessage: "Página não autorizada. Acesso restrito."**/
      }
    }, 
    created: async function ()          {
        this.globalDate = await this.fetchGlobalDate();
        this.DATA_ATUAL = this.globalDate.toLocaleDateString();
        // alert( "datin: " + this.Globals.DATA_ATUAL );
    },
    methods:                                          {   
        async fetchGlobalDate()         {
              const response = await fetch("https://worldtimeapi.org/api/timezone/UTC");
              const data = await response.json();
              const date = new Date( data.datetime );
              return date;
        },  
        convertUSToBRDate( usDateString ) 
        {
            const parts = usDateString.split("-");
            const day = parts[2];
            const month = parts[1];
            const year = parts[0];
            return `${day}/${month}/${year}`;
        },
        /* Habilita o Modal disponível na App.vue */
        showModal( msg )      
        {
            this.$root.$emit( "showModal", msg );
        },
        replaceSubstrings( STR )
        {
            const V1 = [ "u00c7u00c3O", "u00d5", "u00e1", "u00e9", "u00ed", "u00f3", "u00fa", "u00e3", "u00f5" ];
            const V2 = [ "ÇÃO", "Õ", "á", "é", "í", "ó", "ú", "ã", "õ" ];
            for ( let i = 0; i < V1.length; i++ )
                  STR = STR.split( V1[i] ).join(V2[i] );
            return STR;
        },
        /* Será chamada esta função sempre que for alterada a página atual */
        getDataOnUpdatePageAPI()                {

            // alert( this.$route.name ); 
            switch ( this.$route.name )  {
                case 'addOperacoes':
                      this.getAgentesLabelsAPI();
                      console.log( "-- AGENTES ??? " + JSON.stringify( this.AGENTES_LABELS_BD ) );
                      break;
                case 'appHome':
                      break;
                case 'historicoOperacoes':
                      break;
                case 'relatoriosOperacoes':
                      break;
                case 'addRelatorioOperacao':
                      break;
            }
            
        },
        /*convertKmToFloat( inputString )          {

            // Remove spaces from the input string
            //const stringWithoutSpaces = inputString.replace(/\\s/g, '');
            var stringWithoutSpaces = inputString.replace(/\\s/g, '');
            
            // Replace the comma with a period (for decimal separator)
            const stringWithDecimalPoint = stringWithoutSpaces.replace( ',', '.' );
            
            // Parse the resulting string to a float
            const resultFloat = parseFloat( stringWithDecimalPoint );
            return isNaN(resultFloat) ? null : resultFloat;
        },**/

        /* get<dado>API - Nomenclatura oficial do projeto */
        /* Métodos aproveitáveis ao longo do projeto para acesso ao BANCO DE DADOS */
        async getAgentesLabelsAPI() 
        { 
          var sendData   =   {
              dados: {
                  entidade: 'agente',
                  operacao: 'consultar'
              }
          };
          try {
               var response = await axios.post( this.$SERVICES_ENDPOINT_URL , sendData );
               console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
               var agentes = response.data; // -->>> Isso chama o watcher !
               // ---- console.log("Dados retornados = " +  this.responseData.dados ); ---- 
               // ---- console.log('-DATA == ' + JSON.stringify(  agentes ).replace( /\\/g, "" )  ); ---- 
               
               var agentesBD = agentes.data;
               //console.log( "-->> agentesBD = " + JSON.stringify( agentesBD ) + "|| tam = " + agentesBD.length );
               for ( var i=0; i<agentesBD.length; i++ )  
               {
                 this.AGENTES_LABELS_BD[ i ] = agentesBD[ i ].matricula + " - " + agentesBD[ i ].nome;               
                    // console.log(  "K =>> " + this.Globals.AGENTES_LABELS_BD[i] );
               }
          }    catch (error)    {
                console.error(error);
          } 
          console.log( "-- AGENTES = " + JSON.stringify( this.AGENTES_LABELS_BD ) );
        }

    }
   };
export default UtilsMixin;