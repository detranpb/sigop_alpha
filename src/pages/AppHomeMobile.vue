<template>
<main>
    <AppEquipamentosGrid 
              :comp-table-itens="this.listaEquipamentos" 
              @data-updated="data => handleDataUpdate( data )" 
              :id-operacao="idOperacao" 
              :usu-matricula="usuMatricula"/>
</main>
</template>

<script>
import AppEquipamentosGrid from '@/components/AppEquipamentosGrid.vue' //--- SE ASSEMELHA A HERANÇA
import UtilsMixin from '@/utils/UtilsMixin.js' //--- SE ASSEMELHA A HERANÇA
export default
{ 
    mixins: [ UtilsMixin ],
    components:                 {
        AppEquipamentosGrid
    },
    data()                      {  
        return  {
            idOperacao: 0,
            agenteHasSavedBD: false,
            usuMatricula: 0,
            listaEquipamentos:[]
        }
    },
    methods:    
    {
        /**** updatedData : 1 String formatada em JSON, correspondendo a cada linha da Table
        * SEMPRE QUE HOUVER ATUALIZAÇÃO NA TABELA, RECEBO AQUI OS DADOS  ****/  
        handleDataUpdate( status )   
        {
          //console.log( "-- STATUS >> " + status + " i = " + index + " || matri = " + usuMatricula[ index ] );
          this.agenteHasSavedBD = status;
          //console.log( "-LISTA FLAGS >> " + JSON.stringify( this.agentesHasSavedBD ) );
        },
        getTabelasPorAgentes()
        { 
 
          var tableMatricula = this.listaEquipamentos.filter( item => item.matriculaAgente === this.usuMatricula );
          // console.log( "data tst = " + JSON.stringify( tableMatricula ) );
          return tableMatricula;
        },
        buscaOperacoes()                                    {
            
                // this.changeGlobalVariable();
                var sendData    =    {
                    dados: {
                        entidade: 'operacaoDetalhada',
                        operacao: 'consultar',
                        objeto: { 
                        data: ''
                        }
                    }
                }; 
                sendData.dados.objeto.id = idOperacao;
                console.log( "-- SEND Busca Detalhas Operation id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
                this.isDetalharOperacoesOn = true;

                axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
                    .then( response => {
                            // console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
                            // this.responseData = response.data; // 
                            // console.log( "Retorno type = " + typeof response.data );
                            this.responseOperacoesData = response.data; // -->>> Isso chama o watcher !
                            // console.log("Response API || Dados Busca ==> " +  JSON.stringify(  this.responseOperacoesData ) );

                            var code = this.responseOperacoesData.code;
                            var msg  = this.responseOperacoesData.message;
                            
                            this.isLoading = false;

                            if ( code != 0 )
                            {
                                this.showModal( msg ); 
                            } 
                            // console.log("BUSCA || Response API ==> " +  JSON.stringify(  this.responseOperacoesData.data ) );
                    })
                    .catch( error => {
                            this.error = error.message;
                    } );
        }
      }
    }
 </script>

 <style>
 </style>