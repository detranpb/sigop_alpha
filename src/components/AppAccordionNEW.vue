<template>

    <main>
    <div>
        <!-- <my-modal id="myModal" title="Confirmação" 
            :message="modalMessage" 
            :visible="modalIsVisible"
            @update:visible="modalIsVisible = $event"
            @on-close-modal="handleCloseModal()"
            @on-accept-modal="handleAcceptModal()"
            @on-reject-modal="handleRejectModal()">
        </my-modal>-->

      <div class="id-operacao"  v-if="idValue">  ID de Operação: {{ idValue }} </div>

      <div class="btn-add-agente"> 
        <!-- Dados gerais -->
         <b-button v-if="IS_PAGE_EDITABLE" @click="addAccordionItem" variant="success">
              <i class="fas fa-plus"></i> Adicionar Novo Agente
         </b-button>
      </div> 

      <!-- key ==>> É como um id, serve para dar um reload no componenente. -->
      <div v-for="( item, index ) in accordionItems" :key="index">
        <b-card>
          <b-card-header header-tag="header">
            <b-button v-b-toggle="'accordion-' + index" >
                <i class="fa fa-sort"></i>  <b-avatar variant="info" rounded></b-avatar> {{ item.title }} <!-- - {{ index }} -->
            </b-button>
            <!-- -- -- {{ this.hasAgenteBeenSaved( index ) }} -- -- -->

            <button v-if="( IS_PAGE_EDITABLE && !agentesHasSavedBD[ index ] )" class="btn btn-link" @click="removeAccordionItem( index )"> <i class="fas fa-trash-alt"></i>
            </button>
          </b-card-header>

          <b-collapse :id="'accordion-' + index" accordion="my-accordion" v-model="accordionState[index]">
            <b-card-body>
                <div class="accordion-content"> {{ item.content }} </div>
                <br>
                <div class="d-flex align-items-center">
                <label for="inline-form-input-name" class="mr-2"> Matrícula/Agente: </label>
              
              <b-form-input autocomplete = "off" 
                  @keydown = "handleKeyDown"
                  v-model = "usuMatricula[ index ]"  
                  id = "inline-form-input-name" 
                  style = "width: 500px;"
                  list = "matriculas-list"
                  @blur = "validaAgenteOnInput( index )">
              </b-form-input>
              
              <datalist v-if="isAddOperacoesPage" id="matriculas-list">
                 <option v-for="a in this.getAgentesLabels()" :key="a.nome"> {{ a }} </option>
              </datalist>
                
            </div>
            <!-- data - é a variável retornada pelo $emit do método sendDataToParent() 
                 index - é a variável local do pai.-->
            <AppEquipamentosGrid 
              :comp-table-itens="getTabelasPorAgentes( index )" @data-updated="data => handleDataUpdate( data, index, usuMatricula[ index ] )" 
              :id-operacao="idOperacao" :usu-matricula="usuMatricula[ index ]"/>
              
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    </main>
  </template>
  
<script>
import AppEquipamentosGrid from '@/components/AppEquipamentosGrid.vue';
import UtilsMixin          from '@/utils/UtilsMixin.js' // --- SE ASSEMELHA A HERANÇA
import axios               from 'axios';
export default
{
  mixins: [UtilsMixin],
  computed:           {   
        IS_PAGE_EDITABLE()     { 
            return this.$store.state.isPageEditable; 
        },
        MATRICULAS_VALIDAS()   { 
            return this.$store.state.matriculasValidas; 
        },
  },
  props:                  {
      idValue: {
        required: true, 
      },
      tablesAgentes:      {
        type: Array,
      }
  },
  name: 'AppAccordion',
  components:              {
        AppEquipamentosGrid
  },
  watch:              
  {  
      idValue( newIdValue )         
      {
          this.idOperacao = newIdValue;
      },
      tablesAgentes( newTables )    
      {
          this.vetTablesData = newTables;
          const matriculas   = [...new Set( this.vetTablesData.map( item => item.matriculaAgente ) ) ];
          this.usuMatricula  = matriculas;     //---- console.log("--usuMatriculas ===>>> " + JSON.stringify( this.usuMatricula ) );
          this.nAgentes      = matriculas.length;  //---- console.log("--AppAccordion || N° agentes ==>> " + this.nAgentes );
          
          for ( var i=0; i<this.nAgentes; i++ )  {
                const newItem =         {
                      title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
                      content: 'Registros de Entrada/Saída de Equipamentos'
                }
                if ( this.accordionItems.length <= this.$TOTAL_AGENTES_POR_OPERACAO )
                     this.accordionItems.push( newItem );
          }
      }, 
    },
    created()
    {
        //var vet = this.getAgentesLabelsAPI();
        var vet = this.getAgentesLabelsAPI();
        console.log( "- VET ===>>> " + JSON.stringify( vet ) );
        this.agentesHasSavedBD.fill( false );
        // console.log( "TESTE = " + JSON.stringify( this.agentesHasSavedBD ) );
        
        if ( this.$route.name == "addOperacoes" ) 
             this.isAddOperacoesPage = true;
        else 
             this.isAddOperacoesPage = false;
        
        this.$store.commit( "setIsPageEditable", this.isAddOperacoesPage );
        //-var str = this.$store.state.isPageEditable;
        //-console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
        //-console.log( "-AppAccordion || isAddOperacoes? " + this.isAddOperacoesPage );
        //-console.log( "accordion - " + JSON.stringify( this.MATRICULAS_VALIDAS ) );
    },
    data()       
    {
      return    {
          /**** vetTablesData : [
          { 'id_operacao': '1', 'dataDevolucao': '2023-04-25', 'horaDevolucao': '00:00:00', 'idEquipamento': '11', 'nomeEquipamento': 'Talonário', 'matriculaAgente': 123, 'isAvariado': '0' },
          ], ****/
          modalIsVisible: false,
          modalMessage: "Deseja confirmar a operação?",

          agentesLabelBD: ['teste'],  /* Vetor de strings matricula - nome */
          agentesBD: [],              /* Vetor de objetos do tipo { nome, matricula }   */
          agentesHasSavedBD: [],

       /* vetTablesData - Vetor de objetos, retornado pela consulta JSON da operação detalhada. Cada elemento filho, contem os dados de uma linha da MyEditableTable. 
          vetTablesData[] é quebrado em arrays menores e agrupados de acordo com a matrícula do Agente. Esses subarrays são passados para o componente MyEditableTable */
          vetTablesData : [],
          vetJSON : null,
          idOperacao : null,
          nAgentes : null,
    
          /* ====== MODO DE USO - CONSULTA ====== */
          // Variáveis compartilhadas/públicas com emit
          equipamentosPorAgente : [], // Cada ID, é o ID do agente
          usuMatricula : [],

          /* Guarda a lista de matriculas atualmente digitadas, em cada aba do Accordion... */
          inputMatriculasAtivas : [],
          matrix : {},
          isAddOperacoesPage: -1,

          // Variáveis privadas
          accordionItems: [],
          tabitens: [],   // Array de JSONs
          accordionState: {}
      }
    },
    
    methods:  { 
      updateUsuMatricula( index, value )          { 
          this.usuMatricula[index] = value;
      },
      handleKeyDown( event )                       {
          // *** const value = event.target.value; *** 
          // *** ( "AppAcordion || matri = " + value ); *** 
          console.log( "X? " + JSON.stringify( this.AGENTES_LABELS_BD ) );
          if ( !this.isAddOperacoesPage )    {
                event.preventDefault();
                this.modalMessage   = "Alteração de matrícula não permitida.";
                this.modalIsVisible = true;
          }
      },
      handleCloseModal()              { 
          alert("close");
          this.modalIsVisible = false;
      },
      handleAcceptModal()             { 
          alert("accept");
          this.modalIsVisible = false;
      },
      handleRejectModal()             { 
          alert("reject");
          this.modalIsVisible = false;
      },
      getTabelasPorAgentes( index )
      { 
          var tableMatricula = this.vetTablesData.filter( item => item.matriculaAgente === this.usuMatricula[ index ] );
          // console.log( "data tst = " + JSON.stringify( tableMatricula ) );
          return tableMatricula;
      },
      toggleAccordion( index ) 
      {
          // Toggle the state of the accordion
          this.$set( this.accordionState, index, !this.accordionState[index] );
      },
      addAccordionItem()       
      { 
        
        if ( this.idOperacao == null )    {
             this.modalIsVisible = true;
             this.modalMessage   = "Dados gerais da operação ainda não foram salvos.";
        } else  {
              const newItem = {
                title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
                content: 'Registros de Entrada/Saída de Equipamentos'
              }
              this.accordionItems.push( newItem )
         }
      },
      removeAccordionItem( index )  
      {
          // var last = this.accordionItems.pop(); ------ console.log( "ACC? " + JSON.stringify(  last ) );
          // console.log( JSON.stringify( this.agentesHasSavedB ) + " || index = " + index );
          this.$delete( this.accordionItems, index );
          // console.log( "->> Acc. Items: " + JSON.stringify(  this.accordionItems )  );

          for( var i=0; i<this.accordionItems.length; i++ )   {
               this.accordionItems[i].title = "Agente N° " + ( i + 1 );
          }


      },

      /**** updatedData : 1 String formatada em JSON, correspondendo a cada linha da Table
       * SEMPRE QUE HOUVER ATUALIZAÇÃO NA TABELA, RECEBO AQUI OS DADOS  ****/  
      handleDataUpdate( status , index , usuMatricula )   
      {
          //console.log( "-- STATUS >> " + status + " i = " + index + " || matri = " + usuMatricula[ index ] );
          console.log( usuMatricula[ index ] );
          this.agentesHasSavedBD[ index ] = status;
          //console.log( "-LISTA FLAGS >> " + JSON.stringify( this.agentesHasSavedBD ) );
      },
      hasAgenteBeenSaved( index )                         
      {
          //console.log("-- OK" + index );
          //console.log( "-ALL SAVED?? " + JSON.stringify( this.agentesHasSavedBD ) );

          return this.agentesHasSavedBD[ index ];
      },
      validaAgenteOnInput( indexMatricula )
      {

      if ( this.isAddOperacoesPage )    {
          const userInput = this.usuMatricula[ indexMatricula ];         
          const isValid = this.agentesLabelBD.some(a => a === userInput );
          this.inputMatriculasAtivas[ indexMatricula ] = userInput;

          //console.log("Valida agente!! " + userInput );
          //console.log( JSON.stringify( this.agentesHasSavedBD ) );
          if ( !isValid )   {
              this.modalIsVisible = true;
              this.modalMessage = "Matrícula/Agente inválida.";
          }  /* else {  
            const index = this.agentesLabelBD.indexOf( userInput );
            if ( index !== -1 ) 
                  this.agentesLabelBD.splice( index, 1 ); // Remove elemento.
          }*/
        }
      },
      getAgentesLabels()  
      {
        //alert( this.Globals.AGENTES_LABELS_BD );
        // console.log(  "CHAMOU DATALIST!!! " + this.agentesLabelBD[0] );
        return this.agentesLabelBD.filter( item => !this.inputMatriculasAtivas.includes( item ) );
        // return this.Globals.AGENTES_LABELS_BD.filter( item => !this.inputMatriculasAtivas.includes( item ) );
       },
      
    async getListaAgentes() 
    {
      var sendData =  {
          dados: {
              entidade: 'agente',
              operacao: 'consultar'
      } }; 

      try {
          var response = await axios.post( this.$SERVICES_ENDPOINT_URL , sendData );

          // console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
          var agentes = response.data; // -->>> Isso chama o watcher !
          // console.log("Dados retornados = " +  this.responseData.dados );
          // console.log('-DATA == ' + JSON.stringify(  agentes ).replace( /\\/g, "" )  );
          
          this.agentesBD = agentes.data;
          for( var i=0; i<this.agentesBD.length; i++)  
          {
               this.agentesLabelBD[i] = this.agentesBD[ i ].matricula + " - " + this.agentesBD[ i ].nome;               
               // console.log(  "K =>> " + this.agentesLabelBD[i] );
          }
      }  catch (error) {
        console.error(error);
      }    
      }
   
     
  }
}
</script>

  <style>
  .btn-add-agente {
      display: flex;
      justify-content: center;
  }
  .accordion-content    {
      color: rgb(5, 76, 104);
      font-size: 15px;
      font-weight: bold;
  }
  .matricula-input  {
    width: 20px;
  }
  .id-operacao  {
    margin: 20px;
    color: rgb(5, 76, 104);
    font-size: 18px;
    font-weight: bold;
  }
  
  </style>