<template>
<!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>
  <b-card>
      <h4 style="margin: 15px;" class="card-title text-center titulo-paginas"> Histórico de Operações </h4> 
      <!-- <div>
          <b-button size="sm" variant="primary" class="float-center" @click="novaConsulta()">
                Nova Consulta
          </b-button> </div>-->
      
      <!-- Consulta de Operações
      <ConsultaOperacoes @table-updated="rowData => handleOperacaoSelected( rowData )" /> -->

      <ConsultaOperacoes
          @table-updated="rowData => handleOperacaoSelected( rowData )"
          @nova-consulta="data => handleNovaConsulta(data)"/>

      <!-- Detalhes de Operações -->
      <div v-if="isDetalharOperacoesOn">
            <b-tabs card>
                <b-tabs card v-model="activeTab">
                    <b-tab title="Operação 1"> 

                        <ToogleSwitch class="habilita-edicao" :checked="this.isEditable" @toogle-update="data => toggle( data )" label="Habilitar Edição"/>

                        <!-- key: serve para atualizar o status de um componente, ou criar uma nova instância -->
                        <FormOperacoes 
                          :dadosOperacoes="this.responseOperacoesData.data" 
                          :key="filtrosValues.dataOp" ref="setFormEditableRef"/> <!-- REF MÉTODO USADO para ser chaado no filho-->

                      </b-tab>
                  </b-tabs>
                  <template #empty>
                    <div class="text-center text-muted"> 
                        Sem operações abertas.<br>  Abra uma nova aba de operações com o botão acima.
                    </div>
                  </template>
              </b-tabs>
        </div>
  </b-card>
  </main>
</template>
<script>
import FormOperacoes  from '@/pages/FormOperacoes';
import ToogleSwitch from '@/components/ToogleSwitch.vue';
import ConsultaOperacoes from '@/components/ConsultaOperacoes.vue';
import axios from 'axios';
import UtilsMixin from '@/utils/UtilsMixin.js' //--- SE ASSEMELHA A HERANÇA
 
export default
{ 
    mixins: [UtilsMixin],
    components:                     {
        FormOperacoes,
        ConsultaOperacoes,
        ToogleSwitch
    },
    computed: 
    {    
    },
    watch: 
    {
        /* Essa variável é modificada pelo check-box 'Habilitar Edição' isEditable */
        isEditable( newValue )          {
              this.isEditable = newValue;
              this.$store.commit('setIsPageEditable', this.isEditable );
              this.setFormEditable();
              // var str = this.$store.state.isPageEditable;
              // console.log( "HISTORICO | edit? " + str );
        }
    },
    mounted() 
    {
      document.addEventListener( 'keydown', this.myFunction );
    }, 
    created()   
    { 
        if ( this.$route.name == "addOperacoes" )
             this.isAddOperacoesPage = true;
        else  
             this.isAddOperacoesPage = false;
        
        // console.log( "-FormOperacoes || isAddOperacoes? " + this.isAddOperacoesPage );
        this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
        // var str = this.$store.state.isPageEditable;
        // console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
        // this.$store.commit('setIsPageEditable', false );
        // console.log( "teste >>> " + JSON.stringify( this.LISTA_LABELS_AGENTES ) );
    },
    name:'AddOperacoes',
    tabIndex: 1,
    data()  {  
      return  {
          // isLoading : false,
          modalIsVisible : false,
          modalMessage: "Deseja confirmar a operação?",
          isAddOperacoesPage: -1,
          // dataOp: "2023-01-01",
          activeTab: 0, // Tab ativa por padrão
          idTab: 1, // ID da Tab que deve ser ativada
          tabs: [],
          tabCounter: 0,
          responseOperacoesData: Object,
          isEditable: false,
          isTableOperacoesVisible: false,
          isDetalharOperacoesOn: false,
          filtroSelecionado: '',
          filtrosValues : {
              dataOp : "",
              id: "1",
              matriculaResponsavel: null,
          },
      }
    }, 
    methods:          
    {
      handleNovaConsulta( data )                            {
        if ( this.isDetalharOperacoesOn )
             this.isDetalharOperacoesOn = false;
        console.log( data );


        this.$router.push({
              path: '/historico-operacoes',
              replace: true // reload page
        }); 

      },
      myFunction( event )                     
      { 
          if ( event.keyCode == 32 )                        {
               if ( process.env.NODE_ENV === 'development') 
               {
                    this.filtroSelecionado = 'id';
                    this.filtrosValues.id = 375;
                    this.buscarOperacoes();
               }
          }
      },
      handleOperacaoSelected( data )        {
          if ( data != undefined )  {
               // alert( "Aqui = " + JSON.stringify( data ) ); 
               this.isDetalharOperacoesOn = !this.isDetalharOperacoesOn;
               this.buscaDetalhesOperacaoByID( data.id );
          }
      }, 
      toggle()                              {
          this.isEditable = !this.isEditable;
      },
      /* Chama no filho,FormOperacoes, o metodo setFormEditable()*/
      setFormEditable()       {
          this.$refs.setFormEditableRef.toggleFormDisabled(); // Call the child method
      },   
      buscarOperacoes()  
      {
        //console.log( "-buscarOperacoes ==>> " + JSON.stringify( this.filtrosValues ) + ", " + this.filtroSelecionado );
        var sendData = {
            dados: {
                entidade: 'operacao',
                operacao: 'consultar',
                objeto: {   filtro: true  }
            }
        };
        if ( this.filtroSelecionado == 'data' )       {
             sendData.dados.objeto.data = '' + this.filtrosValues.dataOp;
             // console.log( "-- SEND data ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        } else if ( this.filtroSelecionado == 'id' )  {
             sendData.dados.objeto.id   = '' + this.filtrosValues.id;
             // console.log( "-- SEND id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        }
        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
             .then( response =>    {
                   var dados = response.data; // -- -->>> Isso chama o watcher !
                   //  --- console.log( "Resposta API = " + JSON.stringify( response.data ) + " || " + JSON.stringify( dados.data ).replace( /\\/g, "" ) );
                   
                   if ( dados.data == null )        {
                        this.modalIsVisible = true;
                        this.modalMessage = "Nenhuma operação encontrada.";
                   }
                   if ( dados.data.length > 0 )
                        this.isTableOperacoesVisible = true;

                   var numOperacoes = dados.data.length;
                   for ( var i=0; i<numOperacoes; i++ )                
                   {
                         var strNomeOp = dados.data[i].nomeOperacao;
                         // --- console.log( "Nome Op. = " + strNomeOp ); --- 
                         var novoNome = this.replaceSubstrings( strNomeOp );
                         // --- console.log( "-Nova St? " + novoNome ); --- 

                         this.tableData[ i ].id = dados.data[ i ].id; 
                         this.tableData[ i ].nomeOperacao = novoNome;
                         this.tableData[ i ].data = dados.data[ i ].data;
                         this.tableData[ i ].matriculaResponsavel = dados.data[ i ].matriculaResponsavel;
                   }
                   this.tableData.splice(numOperacoes, this.tableData.length - numOperacoes);
            })
            .catch(error => {
                  this.error = error.message;
            });
      },
      buscaDetalhesOperacaoByID( idOperacao )   {
           // var dataOperacao = "2023-01-02";
          this.isLoading = true;
          
          // this.changeGlobalVariable();
          var sendData    =    {
            dados: {
                entidade: 'operacaoDetalhada',
                operacao: 'consultar',
                objeto: { 
                  id: ''
                }
            }
        }; 
        sendData.dados.objeto.id = idOperacao;
        console.log( "-- SEND Busca Detalhas Operation id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        this.isDetalharOperacoesOn = true;

        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
              .then( response => {
                    console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
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
              .catch(error => {
                    this.error = error.message;
              });
        } // END-FOR
        
    }
  }
</script>

<style>
.container-historico      {
  background-color: var(--color-background);
  margin: 40px;
  display: flex;
  justify-content: center;
}
.container-historico > div {
  margin-right: 1px;
}
.container-historico > div:last-child {
  margin-right: 0;
}
.elementos-busca          {
  margin-left: 20px;
  margin-right: 20px;
}
.label                    {
  font-size: 15px;
}
.tabela-container         {
    display: flex;
    justify-content: center;
    align-items: center;
}
.content          {
    width: 50%;
    background-color: var(--color-background);
}

.habilita-edicao  {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>