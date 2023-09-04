<template>

    <main>
    <div>
        <my-modal id="myModal" title="Confirmação" :message="modalMessage" 
            :visible="modalIsVisible"
            @update:visible="modalIsVisible = $event"
            @on-close-modal="handleCloseModal()"
            @on-accept-modal="handleAcceptModal()"
            @on-reject-modal="handleRejectModal()">
        </my-modal>

      <div class="id-operacao"  v-if="idValue">  ID de Operação: {{ idValue }} </div>

      <div class="btn-add-agente"> 
        <!-- Dados gerais -->
         <b-button v-if="IS_PAGE_EDITABLE" @click="addAccordionItem" variant="success">
              <i class="fas fa-plus"></i> Adicionar Novo Agente
         </b-button>
      </div>

      <!-- key ==>> É como um id, serve para dar um reload no componenente. -->
      <div v-for="(item, index) in accordionItems" :key="index">
        <b-card>
          <b-card-header header-tag="header">
            <b-button v-b-toggle="'accordion-' + index" >
                <i class="fa fa-sort"></i> 
                <b-avatar variant="info" rounded></b-avatar>
                {{ item.title }} <!-- - {{ index }} -->
            </b-button>
            <button v-if="IS_PAGE_EDITABLE" class="btn btn-link" @click="removeAccordionItem( index )">
                <i class="fas fa-trash-alt"></i>
            </button>
          </b-card-header>

          <b-collapse :id="'accordion-' + index" accordion="my-accordion" v-model="accordionState[index]">
            <b-card-body>
              <div class="accordion-content">{{ item.content }}</div>
              <br>
              <!-- <MyEditableTable @data-updated="handleDataUpdate" /> -->
              <div class="d-flex align-items-center">
              <label for="inline-form-input-name" class="mr-2">Matrícula/Agente:</label>
              
              <!-- :disabled="!IS_PAGE_EDITABLE" :disabled="!isAddOperacoesPage" -->

              <b-form-input autocomplete="off" 
                  @keydown="handleKeyDown"
                  v-model="usuMatricula[ index ]"  
                  id="inline-form-input-name" 
                  style="width: 500px;"
                  list="matriculas-list"
                  @blur="validaAgente( index )">
                </b-form-input>
              
                <datalist v-if="isAddOperacoesPage" id="matriculas-list">
                    <option v-for="a in getAgentesLabels()" :key="a.nome">{{ a }}</option>
                </datalist>
                
            </div>
            <AppEquipamentosGrid 
              :comp-table-itens="getTabelasPorAgentes( index )" 
              @data-updated="data => handleDataUpdate( data, index, usuMatricula[ index ] )" 
              :id-operacao="idOperacao" 
              :usu-matricula="usuMatricula[ index ]"/>
            <!-- <MyEditableTable :comp-table-itens="getTabelasPorAgentes( index )" @data-updated="data => handleDataUpdate( data, index, usuMatricula[ index ] )" :id-operacao="idOperacao" :usu-matricula="usuMatricula[ index ]"/> -->
            <!-- <MyEditableTable @data-updated="data => handleDataUpdate( data, index, usuMatricula[ index ] )" :id-operacao="idOperacao" :usu-matricula="usuMatricula[ index ]" /> -->
            
            <!-- data - é a variável retornada pelo $emit do método sendDataToParent() 
                 index - é a variável local do pai.
              -->

            <!-- Dados gerais -->
              <!-- <b-button class="btn-add" variant="primary"  @click="cadastrarBD( usuMatricula[ index ], index )">
                <i class="fa fa-database"></i> Cadastrar Operação
              </b-button>
            -->
              
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    </main>
  </template>
  
  <script>
/*  import MyEditableTable from '@/components/MyEditableTable.vue';*/
  import AppEquipamentosGrid from '@/components/AppEquipamentosGrid.vue';
  import axios from 'axios';
  export default
  {
    computed: 
    {  // CONSTANTE
       IS_PAGE_EDITABLE()   {
          return this.$store.state.isPageEditable;
       },
       MATRICULAS_VALIDAS() {
          return this.$store.state.matriculasValidas;
      },
    },
    props: {
      idValue: {
        required: true, // Optional, specify if the prop is required or not
      },
      tablesAgentes:  {
        type: Array,
      }
    },
    name: 'AppAccordion',
    components: {
        AppEquipamentosGrid
    },
    watch: { 
      idValue( newIdValue )         {
        this.idOperacao = newIdValue;
      },

      // !!!!!! !!!!!! !!!!!! !!!!!!TODO: IMPOR LIMITE !!!!!! !!!!!! !!!!!! !!!!!!
      tablesAgentes( newTables )    
      {
          this.vetTablesData = newTables;
          const matriculas = [...new Set( this.vetTablesData.map( item => item.matriculaAgente ) ) ];
          this.usuMatricula = matriculas;
          //console.log("-- usuMatriculas ===>>> " + JSON.stringify( this.usuMatricula ) );

          this.nAgentes = matriculas.length;
          //console.log("-- AppAccordion || N° agentes ==>> " + this.nAgentes );

          
          for ( var i=0; i<this.nAgentes; i++ )  {
                const newItem = {
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
      this.getListaAgentes();

      
      if ( this.$route.name == "addOperacoes" ) {
             this.isAddOperacoesPage = true;
        } else  {
            this.isAddOperacoesPage = false;
        }
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
            },
            {
              'id_operacao': '1',
              'dataDevolucao': '2023-04-25',
              'horaDevolucao': '00:00:00',
              'idEquipamento': '1',
              'nomeEquipamento': 'Talonário X',
              'matriculaAgente': 123,
              'isAvariado': '0'
            },
            {
              'id_operacao': '1',
              'dataDevolucao': '2023-04-25',
              'horaDevolucao': '00:00:00',
              'idEquipamento': '1',
              'nomeEquipamento': 'Talonário X',
              'matriculaAgente': 2,
              'isAvariado': '0'
            }
          ],*/
          modalIsVisible: false,
          modalMessage: "Deseja confirmar a operação?",

          agentesLabelBD: ['teste'],  /* Vetor de strings matricula - nome */
          agentesBD: [],       /* Vetor de objetos do tipo { nome, matricula }   */

          agentesHasSavedBD: [],

          /* Vetor de objetos, retornado pela consulta JSON da operação detalhada. 
          Cada elemento filho, contem os dados de uma linha da MyEditableTable. 
          vetTablesData[] é quebrado em arrays menores e agrupados de acordo com a matrícula do Agente.
          Esses subarrays são passados para o componente MyEditableTable */
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
      /*getAgenteData( index ) {
        const itemId = this.vetTablesData[ index ].matriculaAgente;
        var x = this.vetTablesData.filter( item => item.matriculaAgente === itemId );
        console.log( JSON.stringify( x ) );
      },*/ 
      updateUsuMatricula(index, value)      { 
          this.usuMatricula[index] = value;
      },
      handleKeyDown(event)                  {
          //const value = event.target.value;
          //( "AppAcordion || matri = " + value );
          if ( !this.isAddOperacoesPage )    {
                event.preventDefault();

                this.modalMessage   = "Alteração de matrícula não permitida.";
                this.modalIsVisible = true;
                
          }
      },
      handleCloseModal()  {
          //console.log("Close ... ");
          this.modalIsVisible = false;
      },
      handleAcceptModal() {
          //console.log("Accept ... ");
          this.modalIsVisible = false;
      },
      handleRejectModal() {
          //console.log("Reject ... ");
          this.modalIsVisible = false;
      },
      getTabelasPorAgentes( index )
      { 
          var tableMatricula = this.vetTablesData.filter( item => item.matriculaAgente === this.usuMatricula[ index ] );
          // console.log( "data tst = " + JSON.stringify( tableMatricula ) );
          return tableMatricula;
      },
      toggleAccordion( index ) {
        // Toggle the state of the accordion
        this.$set( this.accordionState, index, !this.accordionState[index] );
      },
      addAccordionItem()    {
        
        /*if ( this.idOperacao == null )    {
             this.modalIsVisible = true;
             this.modalMessage   = "Dados gerais da operação ainda não foram salvos.";
        } else  {
            const newItem = {
              title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
              content: 'Registros de Entrada/Saída de Equipamentos'
            }
            this.accordionItems.push( newItem )
         }*/
         const newItem = {
              title: 'Agente N° ' + ( this.accordionItems.length + 1 ),
              content: 'Registros de Entrada/Saída de Equipamentos'
            }
            this.accordionItems.push( newItem );
      },

      removeAccordionItem( index )  
      {
        this.$delete( this.accordionItems, index );
      },

      /**
       * updatedData : 1 String formatada em JSON, correspondendo a cada linha da Table
       * 
       * SEMPRE QUE HOUVER ATUALIZAÇÃO NA TABELA, RECEBO AQUI OS DADOS 
       * */  
      handleDataUpdate( status, index, usuMatricula ) 
      { 
          // console.log( "STATUS >>> " + status + " i= " + index + "|| matri = " + usuMatricula[ index ] );
          console.log( usuMatricula[ index ] );
          this.agentesHasSavedBD[ index ] = status;
      },

      /* sendDataToParent()         
      {
          this.$emit( 'data-updated', this.equipamentosPorAgente );
          //this.$emit('data-updated', { data: this.equipamentosPorAgente, usuMatricula: this.usuMatricula });
      },*/
      addToMatrix( UserKeyID , value ) 
      {
        if ( !Object.prototype.hasOwnProperty.call( this.matrix, UserKeyID )  ) 
        {
          this.matrix[ UserKeyID ] = [];
        } 
        value = value.split('[').join('').split(']').join('');
        // console.log( "Val = " + value );
        this.matrix[ UserKeyID ].push( value );
        // console.log("[ " + UserKeyID + "] == " + this.matrix[ UserKeyID ] );
      },
   /*   validaAgente( matricula )
    {
      const matr = Number( matricula );
      const isValid = this.MATRICULAS_VALIDAS.includes( matr );
      // console.log("Valida agente!! " + JSON.stringify( this.MATRICULAS_VALIDAS ) + " || " + isValid);
      // isValid = this.MATRICULAS_VALIDAS.some(a => a === matricula );
      // console.log( "Teste = " + isValid + " || " + matricula  );
      if ( !isValid ) 
      {
          this.modalIsVisible = true;
          this.modalMessage = "Matrícula/Agente inválida.";
          this.agenteResponsavel = "";
      }  
    },*/
    validaAgente( indexMatricula )
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

    getAgentesLabels()  {
      // console.log(  "CHAMOU DATALIST!!! " + this.agentesLabelBD[0] );
        return this.agentesLabelBD.filter( item => !this.inputMatriculasAtivas.includes( item ) );
    },

    async getListaAgentes() 
    {
      var sendData =  {
          dados: {
              entidade: 'agente',
              operacao: 'consultar'
          }
      };
      //console.log( "SEND >>> " + JSON.stringify( sendData ));

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
      margin-left: -100px;
      padding: 10px;
      display: flex;
      justify-content: center; 
      align-items: center;
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