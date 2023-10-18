<template>

    <main>
    <div>
      <div class="id-operacao"  v-if="idValue"> 
           Registro de Equipamentos - ID de Operação: {{ idValue }}
      </div>

      <div class="info" v-if="(idValue && isAddOperacoesPage )" > 
           Adicione a listagem de agentes e seus respectivos equipamentos abaixo.
      </div>
 
      <!-- CASO Página de Adicionar Operações -->
      <div v-if="this.isAddOperacoesPage" class="btn-add-agente"> 
        <!-- Dados gerais -->
         <b-button v-if="( IS_PAGE_EDITABLE && ( this.idOperacao != null ) )" @click="addAccordionItem" variant="success">
              <i class="fas fa-plus"></i> Adicionar Agente
         </b-button>
      </div>
      <!-- CASO Página contrário  -->
      <div v-else class="btn-add-agente"> 
        <!-- Dados gerais -->
         <b-button v-if="( IS_PAGE_EDITABLE )" @click="addAccordionItem" variant="success">
              <i class="fas fa-plus"></i> Adicionar Agente
         </b-button>
      </div>

      <!-- key ==>> É como um id, serve para dar um reload no componenente. -->
      <div v-for="( item, index ) in accordionItems" :key="index">
        <b-card>
          <b-card-header header-tag="header">
              <div class="my-header-elements">
                  <button v-if="( IS_PAGE_EDITABLE && !agentesHasSavedBD[ index ] )" class="btn btn-link" @click="removeAccordionItem( index )">
                       <i class="fas fa-trash-alt"></i>
                  </button>
                  <button v-else class="btn btn-link" disabled>  <i class="fas fa-trash-alt"></i>
                  </button>
                  
                  <b-avatar variant="info" rounded></b-avatar>

                  <!-- -- {{ this.hasAgenteBeenSaved( index ) }} -- -->
                  <b-form-input 
                        :disabled="inputMatriculaAtivo( index )"  
                        autocomplete="off" 
                        @keydown="handleKeyDown"
                        :placeholder=item.placeholder
                        v-model="usuMatricula[ index ]"  
                        id="inline-form-input-name" 
                        style="width: 500px;"
                        list="matriculas-list"
                        @blur="validaAgente( index )">
                  </b-form-input>

                  <!-- <div class="avatarLabel"> {{ item.title }} </div> -->

                  <b-button style="margin-left: 5px;" @click="confirmaMatriculaAgente( index )" >
                         <i v-if="accordionState[index]" class="fa-solid fa-angle-up"></i>
                         <i v-else class="fa-solid fa-angle-down"></i>
                  </b-button>

              </div>
          </b-card-header>

          <b-collapse :id="'accordion-' + index" accordion="my-accordion" v-model="accordionState[ index ]"> 
            <b-card-body>
              <div class="d-flex align-items-center">
              <!-- <label for="inline-form-input-name" size="sm" class="mr-2">Matrícula/Agente:</label>
              
              <b-form-input autocomplete="off" 
                  @keydown="handleKeyDown"
                  v-model="usuMatricula[ index ]"  
                  id="inline-form-input-name" 
                  style="width: 500px;"
                  list="matriculas-list"
                  @blur="validaAgente( index )">
                </b-form-input>-->
              
                <datalist v-if="isAddOperacoesPage" id="matriculas-list">
                    <option v-for="a in getAgentesLabels()" :key="a.nome">{{ a }}</option>
                </datalist>
                
                <AppEquipamentosGrid 
                    :comp-table-itens = "getTabelasPorAgentes( index )" 
                    @data-updated  = "data => handleDataUpdate( data, index, usuMatricula[ index ] )" 
                    :id-operacao   = "idOperacao" 
                    :usu-matricula = "usuMatricula[ index ]"/>
            </div>

            <!-- data - é a variável retornada pelo $emit do método sendDataToParent() 
                 index - é a variável local do pai. -->
            <!-- <AppEquipamentosGrid 
                  :comp-table-itens="getTabelasPorAgentes( index )" 
                  @data-updated="data => handleDataUpdate( data, index, usuMatricula[ index ] )" 
                  :id-operacao="idOperacao" 
                  :usu-matricula="usuMatricula[ index ]"/> -->
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    </main>
  </template>
  
<script>
import AppEquipamentosGrid from '@/components/AppEquipamentosGrid.vue';
import UtilsMixin   from '@/utils/UtilsMixin.js' //--- SE ASSEMELHA A HERANÇA
import axios from 'axios';
export default
{
  mixins: [UtilsMixin],
  computed: {   
      IS_PAGE_EDITABLE()   { return this.$store.state.isPageEditable;    },
      MATRICULAS_VALIDAS() { return this.$store.state.matriculasValidas; },
  },
  props:    {
      idValue:            {
        required: true, 
      },
      tablesAgentes:      {
        type: Array,
      }
  },
  name: 'AppAccordion',
  components:             {
      AppEquipamentosGrid,
  },
  watch:              
  {  
      idValue( newIdValue )               {
          this.idOperacao = newIdValue;
      },
      tablesAgentes( newTables )    
      {
          this.vetTablesData = newTables;
          const matriculas = [...new Set( this.vetTablesData.map( item => item.matriculaAgente ) ) ];
          this.usuMatricula = matriculas;
          // console.log("-- usuMatriculas ?!? ===>>> " + JSON.stringify( this.usuMatricula ) );

          this.nAgentes = matriculas.length;
          // console.log("-- AppAccordion || N° agentes ==>> " + this.nAgentes );
          
          for ( var i=0; i<this.nAgentes; i++ )  {
                const newItem =   {
                      title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
                      placeholder: "Insira matrícula do Agente N°" + ( this.accordionItems.length + 1 ),
                      content: 'Registros de Entrada/Saída de Equipamentos'
                }
                if ( this.accordionItems.length <= this.$TOTAL_AGENTES_POR_OPERACAO )
                     this.accordionItems.push( newItem );
          }
      }, 
    },
    created()
    {
      this.getListaAgentes();
      // this.getAgentesLabelsAPI();
 
      this.agentesHasSavedBD.fill( false );
      // console.log( "TESTE = " + JSON.stringify( this.agentesHasSavedBD ) );
      
      if ( this.$route.name == "addOperacoes" ) 
           this.isAddOperacoesPage = true;
      else
           this.isAddOperacoesPage = false;
      
      this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
      // var str = this.$store.state.isPageEditable;
      // console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
      // console.log( "-AppAccordion || isAddOperacoes? " + this.isAddOperacoesPage );
      // console.log( "accordion - " + JSON.stringify( this.MATRICULAS_VALIDAS ) );
    },
    data()       
    {
      return  {
            /* vetTablesData :  [
            {
              'id_operacao': '1',
              'dataDevolucao': '2023-04-25',
              'horaDevolucao': '00:00:00',
              'idEquipamento': '11',
              'nomeEquipamento': 'Talonário',
              'matriculaAgente': 123,
              'isAvariado': '0'
            }, ...
          ],*/
          modalIsVisible: false,
          modalMessage: "Deseja confirmar a operação?",
          agentesLabelBD: ['teste'],  /* Vetor de strings matricula - nome */
          agentesBD: [],              /* Vetor de objetos do tipo { nome, matricula }   */

          /** Variáveis controle do acordion */
          agentesHasSavedBD: [],
          matriculasValidadas: [], // matriculas que já foram validadas, para ser usado no disabled do input

          /**
           *  vetTablesData - Vetor de objetos, retornado pela consulta JSON da operação detalhada. 
              Cada elemento filho, contem os dados de uma linha da MyEditableTable. 
              vetTablesData[] é quebrado em arrays menores e agrupados de acordo com a matrícula do Agente.
              Esses subarrays são passados para o componente MyEditableTable 
          **/
          vetTablesData : [],
          vetJSON : null,
          idOperacao : null,
          nAgentes : null,
    
          /** ====== MODO DE USO - CONSULTA ====== */
          // Variáveis compartilhadas/públicas com emit
          equipamentosPorAgente : [], // Cada ID, é o ID do agente
          usuMatricula : [],
          inputMatriculasAtivas : [], // Guarda as matriculas atualmente digitadas
          matrix : {},
          isAddOperacoesPage: -1,

          // Variáveis privadas
          accordionItems: [],
          tabitens: [],   // Array de JSONs
          accordionState: {}
      }
    },
    
    methods:  { 
      updateUsuMatricula(index, value)    { 
          this.usuMatricula[index] = value;
      },
      handleKeyDown(event)                {
          //const value = event.target.value;
          //( "AppAcordion || matri = " + value );
          if ( !this.isAddOperacoesPage ) {
                event.preventDefault();

                /*** this.modalMessage   = "Alteração de matrícula não permitida.";
                this.modalIsVisible = true; ***/
                this.showModal( "Alteração de matrícula não permitida." );
          }
      },
      handleCloseModal()            
      {  
         this.modalIsVisible = false;
      },
      handleAcceptModal()           
      { 
         this.modalIsVisible = false;
      },
      handleRejectModal()           
      { 
         this.modalIsVisible = false;
      },
      groupByMatriculaAgente( inputArray )      
      {
         const groupedArrays = inputArray.reduce( ( result, item ) => {
         const matriculaAgente = item.matriculaAgente;

         // Check if there's an array for the current "matriculaAgente" value, if not, create one
         if ( !result[ matriculaAgente ] )  {
            result[matriculaAgente] = [];
          }

          // Push the current object into the corresponding array
          result[matriculaAgente].push(item);

          return result;
        }, {});

        // Convert the grouped object into an array of arrays
        const groupedArray = Object.values(groupedArrays);

        return groupedArray;
      },
      getTabelasPorAgentes( index )
      { 
          // console.log( " -->>> vetTablesData = " + JSON.stringify( this.vetTablesData ) );
          /*** console.log( " -- matriculas = " + JSON.stringify( this.usuMatricula[ index ] ) );
          var vet = this.groupByMatriculaAgente( this.vetTablesData );
          console.log( "ALL>" + JSON.stringify( vet ) );
          return vet; ***/
          var tableMatricula = this.vetTablesData.filter( item => item.matriculaAgente === this.usuMatricula[ index ] );
          // console.log( "-- Data tst = " + JSON.stringify( tableMatricula ) );
          return tableMatricula;
      },
      toggleAccordion( index ) 
      {
          // Toggle the state of the accordion
          this.$set( this.accordionState, index, !this.accordionState[index] );
      },
      confirmaMatriculaAgente( index )
      {
         if ( this.isAddOperacoesPage )      
         {
              var isValid = this.validaAgente( index );
              if ( isValid )
                   this.toggleAccordion( index );
              // ***** alert( "Matricula salva? " +  ); ***** 
              // ***** alert( "usu? " + JSON.stringify( this.usuMatricula ) ); ***** 
              if ( this.hasAgenteBeenSaved( index ) )
                   this.getUsoEquipamentos( index );
         }    else    {
              this.toggleAccordion( index );
         }
      },
      /** getUsoEquipamentos( index ) 
      {
        // alert( "-- Agente ==>>> " + this.usuMatricula[ index ] );
        var usuMatriculaStr = this.usuMatricula[ index ];
        // Remove all non-numeric characters from the string
        var numericString = usuMatriculaStr.replace(/[^0-9]/g, "");
        var matricula = parseInt( numericString, 10 );
        

        var sendData  =  {
            dados:    {
                entidade: 'usoEquipamento',
                operacao: 'consultar',
                objeto: {}
            }
        }
        var obj =        {
            idOperacao: this.idOperacao,
            matriculaAgente: matricula
        }
        sendData.dados.objeto = obj;
        // console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );

        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
             .then( response => {
                    // console.log( "Resposta API ==>>> " +  JSON.stringify( response.data ).replace( /\\/g, "" ) );

                    //var isAvariado = response.data.isAvariado;
                    // alert( "isCheck? " + isAvariado );

                  })
             .catch( error => {
                     this.error = error.message;
             });
      },**/
      inputMatriculaAtivo( index ) 
      {
          return ( !( this.IS_PAGE_EDITABLE && !this.agentesHasSavedBD[ index ] ) ) || 
                 ( this.matriculasValidadas[ index ] ) ||
                 ( !this.isAddOperacoesPage );  //*** CASO SEJA PAGINA DE CONSULTA ***
      },
      addAccordionItem()       
      { 
        if ( this.idOperacao == null )    {
             this.showModal( "Dados gerais da operação ainda não foram salvos." );
        }    else    {
              const newItem = {
                    title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
                    placeholder: "Insira matrícula do Agente N°" + ( this.accordionItems.length + 1 ),
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
          this.matriculasValidadas[ index ] = false;
          this.accordionState[ index ] = false;

          // console.log( "->> Acc. Items: " + JSON.stringify(  this.accordionItems )  );
          for( var i=0; i<this.accordionItems.length; i++ )   {
               this.accordionItems[i].title = "Agente N° " + ( i + 1 );
               this.accordionItems[i].placeholder = "Insira matrícula do " + this.accordionItems[i].title;
          }
      },

      /**** updatedData : 1 String formatada em JSON, correspondendo a cada linha da Table
       * SEMPRE QUE HOUVER ATUALIZAÇÃO NA TABELA, RECEBO AQUI OS DADOS  ****/  
      handleDataUpdate( status , index , usuMatricula )   
      {
          // console.log( "-- STATUS >> " + status + " i = " + index + " || matri = " + usuMatricula[ index ] );
          console.log( usuMatricula[ index ] );
          this.agentesHasSavedBD[ index ] = status;
          this.accordionState[ index ] = false;
          // console.log( "-LISTA FLAGS >> " + JSON.stringify( this.agentesHasSavedBD ) );
      },
      hasAgenteBeenSaved( index )                         
      {
          // console.log("-- OK" + index );
          // console.log( "-ALL SAVED?? " + JSON.stringify( this.agentesHasSavedBD ) );

          return this.agentesHasSavedBD[ index ];
      },
      validaAgente( indexMatricula )
      {
          var isValid = false;

          if ( this.isAddOperacoesPage )          
          {
                const userInput = this.usuMatricula[ indexMatricula ];       
                isValid = this.agentesLabelBD.some(a => a === userInput );
                this.inputMatriculasAtivas[ indexMatricula ] = userInput;

                // alert("Valida agente!! " + userInput + " || " + isValid );

                // console.log( JSON.stringify( this.agentesHasSavedBD ) );
                 if ( !isValid )   {
                      /**this.modalIsVisible = true;
                      this.modalMessage = "Matrícula/Agente inválida.";**/
                      // alert("ERRO");
                      this.showModal( "Matrícula/Agente inválida." );
                } else {
                      this.matriculasValidadas[ indexMatricula ] = true;
                }
                /* else {  
                    const index = this.agentesLabelBD.indexOf( userInput );
                    if ( index !== -1 ) 
                          this.agentesLabelBD.splice( index, 1 ); // Remove elemento.
                  }*/
          }
          return isValid;
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
  .btn-add-agente   {
      margin: 10px;
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
  .id-operacao      {
    margin: 20px;
    color: rgb(5, 76, 104);
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
  .my-header-elements {
    display: flex;
    justify-content: left;
  }

  .info                       {
    font-size: 16px; 
    color:rgb(118, 121, 122);
    display: flex;
    justify-content: center;
    margin:10px;
  }
  .avatarLabel                {
    font-size: 12px;
    color: rgb(32, 32, 32);
    font-weight: bold;
  }
  </style>