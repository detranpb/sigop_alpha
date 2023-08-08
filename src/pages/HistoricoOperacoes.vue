<template>
      <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>
  <b-card>
      <h4 style="margin: 15px;" class="card-title text-center titulo-paginas"> Histórico de Equipamentos </h4> 
      <my-modal 
          id="myModal" 
          title="Confirmation" 
          :message="modalMessage" 
          :visible="modalIsVisible" 
          @update:visible="modalIsVisible = $event" 
          @on-close-modal="handleCloseModal()"
          @on-accept-modal="handleAcceptModal()"
          @on-reject-modal="handleRejectModal()"/>

      <!-- Your parent component content here -->
      <my-loading-overlay :is-loading="isLoading">
      </my-loading-overlay>

      <div class="container-historico">
            <div id="FILTROS_ID" style="margin-top: 10px;">
              <b-dropdown text="Filtros de Consulta" class="m-md-2">
                  <b-dropdown-item @click="selecionaFiltro('data')">Data da Operação</b-dropdown-item>
                  <b-dropdown-item @click="selecionaFiltro('id')">ID da Operação</b-dropdown-item>
                  <!-- <b-dropdown-item disabled="true">Agente Responsável</b-dropdown-item>
                  <b-dropdown-item disabled="true">Município</b-dropdown-item>
                  <b-dropdown-item disabled="true">Bairro</b-dropdown-item>-->
              </b-dropdown>
            </div>
            <div id="ID_OPERACAO_ID"   class="elementos-busca" v-if="( filtroSelecionado=='id' )">
                <label class="label"><b> ID da Operação: </b></label>
                <b-form-input type="number" style="width:100px;" autocomplete="off" v-model="filtrosValues.id" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0 custom-input"></b-form-input>
            </div>

            <div id="DATA_OPERACAO_ID" class="elementos-busca" v-if="( filtroSelecionado=='data' )">
              <div>
                <label class="label" for="example-datepicker"><b> Selecione a Data: </b></label>
                <b-form-datepicker style="width:300px;"   id="example-datepicker" v-model="filtrosValues.dataOp" class="mb-2"></b-form-datepicker>
              </div>
            </div>

            <div id="BTN_BUSCAR_OPERACOES_ID" class="elementos-busca" v-if="( ( filtroSelecionado == 'data' ) || ( filtroSelecionado == 'id' ) )">           
              <b-button style="margin-top: 18px;"  class="float-right" @click="buscarOperacoes()">
                      <i class="fa fa-search"></i> Buscar Operações
              </b-button>
            </div>
      </div>
      <div v-if="isTableOperacoesVisible" class="tabela-container" id="LISTA_OPERACOES_ID">
  <div class="content">
    <label class="label"><b>Operações Disponíveis</b></label>
    <b-table :items="tableData" :fields="tableFields" striped hover selectable @row-clicked="handleRowClicked"></b-table>
  </div>
</div>

      <div id="OPERACOES_DETALHES_ID" v-if="isDetalharOperacoesOn">
      <b-tabs card>
        <!-- Render Tabs, supply a unique `key` to each tab -->

        <b-tabs card v-model="activeTab">
            <b-tab title="Operação 1"> 
              <b-form-checkbox v-model="isEditable" switch> Habilitar Edição </b-form-checkbox>
              <!-- key: serve para atualizar o status de um componente, ou criar uma nova instância -->
                <FormOperacoes 
                  :dadosOperacoes="this.responseOperacoesData.data" 
                  :key="filtrosValues.dataOp" 
                  ref="setFormEditableRef"/> <!-- REF MÉTODO USADO para ser chaado no filho-->

                  <!-- {{ this.responseOperacoesData.data }} -->
            </b-tab>

            
            <!--
              <b-tab title="Operação 2"> <FormOperacoes /> </b-tab>
              <b-tab title="Operação 3"> <FormOperacoes /> </b-tab>
              -->
        </b-tabs>

        <template #empty>
          <div class="text-center text-muted">
            Sem operações abertas.<br>
            Abra uma nova aba de operações com o botão acima.
          </div>
        </template>
      </b-tabs>
    </div>
    </b-card>
  

    <!-- Control buttons
    <div class="text-center">
      <b-button-group class="mt-2">
        <b-button @click="activeTab--">Anterior</b-button>
        <b-button @click="activeTab++">Próxima</b-button>
      </b-button-group>
    </div>
    -->
 
  </main>
</template>


<script>
  import FormOperacoes  from '@/pages/FormOperacoes';
  import MyLoadingOverlay from '@/components/MyLoadingOverlay.vue';
  import axios from 'axios';

  export default 
  { 
    components: {
      FormOperacoes,
      MyLoadingOverlay
    },
    computed: 
    {   // CONSTANTE
        IS_PAGE_EDITABLE()      {
           return this.$store.state.isPageEditable;
        },
        LISTA_AGENTES()         {
           return this.$store.state.listaAgentes;
        },
        LISTA_LABELS_AGENTES()  {
          return this.$store.state.listaAgentes;
        },
    },
    watch: 
    {
        /* Essa variável é modificada pelo check-box 'Habilitar Edição' isEditable */
        isEditable( newValue )  {
          this.isEditable = newValue;
          this.$store.commit('setIsPageEditable', this.isEditable );

          console.log("Call set form...");
          this.setFormEditable();
          // var str = this.$store.state.isPageEditable;
          // console.log( "HISTORICO | edit? " + str );
        }
    },
    created()   
    { 
        if ( this.$route.name == "addOperacoes" ) {
             this.isAddOperacoesPage = true;
        } else  {
            this.isAddOperacoesPage = false;
        }
        console.log( "-FormOperacoes || isAddOperacoes? " + this.isAddOperacoesPage );
        this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
        var str = this.$store.state.isPageEditable;
        console.log( "AppEquipamentosGRID | isPageEditable ? " + str );

        this.$store.commit('setIsPageEditable', false );
        // console.log( "teste >>> " + JSON.stringify( this.LISTA_LABELS_AGENTES ) );
    },
    name:'AddOperacoes',
    tabIndex: 1,
    data()  {  
      return  {
          isLoading : false,
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
            dataOp : "2023-01-01",
            id: "1",
            matriculaResponsavel: null,
          },
          /* {"id":"1","nomeOperacao":"Paulo XXXXXnome","data":"2023-01-01","matriculaResponsavel":"0"}*/
          tableData: [
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
             { id: 1, nomeOperacao: " ", data: " ", matriculaResponsavel:0 },
          ],
          tableFields: [
            { key: "id", label: "ID" },
            { key: "nomeOperacao", label: "Nome" },
            { key: "data", label: "Data" },
            { key: "matriculaResponsavel", label: "Matricula" }
          ],
          selectedRowId: null,
      }
    }, 
    methods:          
    {
      handleRowClicked( item, index, event ) 
      {
          this.selectedRowId = item.id;
          console.log( JSON.stringify( item ) + " -- " + index + " -- " + event );
          this.buscaDetalhesOperacaoByID( item.id );
      },
      selecionaFiltro( option )       {
          this.filtroSelecionado = option;
          console.log( "FILTRO = " + this.filtroSelecionado + '|| tipo = ' + typeof this.filtroSelecionado);
      },
      /* Chama no filho,FormOperacoes, o metodo setFormEditable()*/
      setFormEditable()   {
          this.$refs.setFormEditableRef.toggleFormDisabled(); // Call the child method
      },
      handleCloseModal()  {
        this.modalIsVisible = false;  
        console.log("Close ... ");
      },
      handleAcceptModal() {
          // console.log("Accept ... ");
          this.modalIsVisible = false;
      },
      handleRejectModal() {
          // console.log("Reject ... ");
          this.modalIsVisible = false;
      },
      closeTab(x) {
        for ( let i = 0; i < this.tabs.length; i++ ) 
        {
          if ( this.tabs[i] === x )
               this.tabs.splice( i, 1 )
        }
        this.tabCounter--;
      },
      newTab()              
      {
          this.tabs.push(this.tabCounter++)
      },
      activateCurrentTab()  
      {
          this.$refs.tabs.activateTab( this.activeTab ); // Ativa a aba (tab) atual
      },
      activateTabById()     {
          // Obtém o índice da aba (tab) correspondente à variável idTab
          const tabIndex = this.$refs.tabs.tabs.findIndex(
            (tab) => tab.id === `tab-${this.idTab}`
          );
          // Ativa a aba (tab) correspondente
          this.$refs.tabs.activateTab( tabIndex );
      },
      buscarOperacoes()  
      {
        console.log( "-buscarOperacoes ==>> " + JSON.stringify( this.filtrosValues ) + ", " + this.filtroSelecionado );
        var sendData    =    {
          dados: {
              entidade: 'operacao',
              operacao: 'consultar',
              objeto: { 
                filtro: true
              }
          }
        };
        if ( this.filtroSelecionado == 'data' )   {
             sendData.dados.objeto.data = '' + this.filtrosValues.dataOp;
             console.log( "-- SEND data ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        } else if ( this.filtroSelecionado == 'id' ) {
             sendData.dados.objeto.id   = '' + this.filtrosValues.id;
             console.log( "-- SEND id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        }

      axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
            .then( response =>    {
                   var dados = response.data; // -->>> Isso chama o watcher !
                   console.log( "Resposta API = " + JSON.stringify( response.data ) + " || " + JSON.stringify( dados.data ).replace( /\\/g, "" ) );
                   
                   if ( dados.data == null ) {
                        this.modalIsVisible = true;
                        this.modalMessage = "Nenhuma operação encontrada.";
                   }

                   if ( dados.data.length > 0 )
                        this.isTableOperacoesVisible = true;

                   var numOperacoes = dados.data.length;
                   for ( var i=0; i<numOperacoes; i++ )    {
                        this.tableData[i].id = dados.data[i].id; 
                        this.tableData[i].nomeOperacao = dados.data[i].nomeOperacao;
                        this.tableData[i].data = dados.data[i].data;
                        this.tableData[i].matriculaResponsavel = dados.data[i].matriculaResponsavel;
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
        console.log( "-- SEND id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        this.isDetalharOperacoesOn = true;

        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
              .then( response => {
                    // console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
                    // this.responseData = response.data; // 
                    console.log( "Retorno type = " + typeof response.data );
                    this.responseOperacoesData = response.data; // -->>> Isso chama o watcher !
                    // console.log("Response API || Dados Busca ==> " +  JSON.stringify(  this.responseOperacoesData ) );

                    var code = this.responseOperacoesData.code;
                    var msg  = this.responseOperacoesData.message;
                    
                    this.isLoading = false;

                    if ( code != 0 )   
                    {
                         this.modalIsVisible = true;
                         this.modalMessage = msg;
                    } 
                    console.log("BUSCA || Response API ==> " +  JSON.stringify(  this.responseOperacoesData.data ) );
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
.elementos-busca {
  margin-left: 20px;
  margin-right: 20px;
}
.label           {
  font-size: 15px;
}

.tabela-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    width: 50%;
  }
</style>