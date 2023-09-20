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
        <!-- BTN02, IPT01, IPT02 ] -->

        <div style="width:300px;" >
          <!---  <label class="rotulos" for="example-datepicker"> Data de Retirada de Tablet: </label>
          <b-form-datepicker id="example-datepicker" v-model="dataAtual" class="mb-2"></b-form-datepicker> --->
          <FormDateComp label="Data de Retirada de Tablet:" width="100px"  @updateDate="onDateUpdate" />
        </div>

      <FormTimeComp label="Hora:" width="100px"
           @onInput  = "onInputTime"
           @onShown  = "onShownTime"
           @onHidden = "onHiddenTime"/>
      
      <div class="btn-add-agente"> 
          <b-button @click="addAccordionItem" variant="success"> <i class="fas fa-plus"></i> Adicionar Novo Fiscal </b-button>
          
          <ButtonComp :comp-id="BTN01"  variant-value="success" text="BOTAO 1" width="80px" @onClick="onButtonClick" v-if="true" />
          <ButtonComp :comp-id="BTN02"  variant-value="success" text="BOTAO 2" width="80px" @onClick="onButtonClick" v-if="true" />
          <FormInputComp :comp-id="IPT01" :data-list="teste" label="Ok" width="200px"  
               @onInput     = "onInput"
               @onChange    = "onChange"
               @onKeydown   = "onKeydown"
               @onUpdate    = "onUpdate"/>

          <FormInputComp :comp-id="IPT02" :data-list="teste" label="Ok" width="200px"  
               @onInput     = "onInput"
               @onChange    = "onChange"
               @onKeydown   = "onKeydown"
               @onUpdate    = "onUpdate"/>    
      </div>
      
      <!-- key ==>> É como um id, serve para dar um reload no componenente. -->
      <div v-for="(item, index) in accordionItems" :key="index">
        <b-card>
          <b-card-header header-tag="header">
            <ButtonComp 
                :comp-id="BTN03" variant-value="success" text="BOTAO 2" width="80px" @onClick="onButtonClick" v-if="true" 
                :toggle-data = "{ toogle: true, toggleName: 'accordion-' + index }"/>/>

            <b-button v-b-toggle="'accordion-' + index" >
                <i class="fa fa-sort"></i> 
                <b-avatar variant="info" rounded></b-avatar>
                          {{ item.title }} <!-- - {{ index }} -->
            </b-button>
            
            <!-- :toogle-data 
            <ButtonComp 
                :comp-id="2" variant-value="success" text="BOTAO 2" width="80px" @onClick="onButtonClick" v-if="true" 
                :toggle-data = "{ toogle: false, toggleName: 'accordion-' + index }"/> />-->

            <button class="btn btn-link" @click="removeAccordionItem( index )">
                <i class="fas fa-trash-alt"></i>
            </button>
          </b-card-header>

          <b-collapse :id="'accordion-' + index" accordion="my-accordion" v-model = "accordionState[ index ]">
            <b-card-body>
              <div class="accordion-content"> {{ item.content }} </div>
              <br>
              <!-- <MyEditableTable @data-updated="handleDataUpdate" /> -->
              <div class="d-flex align-items-center">
                    
                    <div style="margin-right: 20px;">
                        <label for="inline-form-input-name" class="mr-2"> Matrícula/Fiscal: </label>
                        <b-form-input autocomplete="off" @keydown="handleKeyDown" v-model="usuMatricula[ index ]" id="inline-form-input-name" 
                            style="width: 500px;" list="matriculas-list" @blur="validaAgente( index )">
                        </b-form-input>
                        <datalist v-if="isAddOperacoesPage" id="matriculas-list">
                            <option v-for="a in getAgentesLabels()" :key="a.nome">{{ a }}</option>
                        </datalist>

                        <FormInputComp :comp-id="IPT03" :data-list="getAgentesLabels()" @onBlur="validaAgente( index )" label="Matrícula/Fiscal:" width="500px"  
                              @onInput     = "onInput"
                              @onChange    = "onChange"
                              @onKeydown   = "onKeydown"
                              @onUpdate    = "onUpdate"/>
                    </div>

                    <div style="margin-right: 20px;">
                        <label  class="rotulos"> Tablet ID: </label>
                        <b-form-input autocomplete="off" @keydown="handleKeyDown" v-model="usuMatricula[ index ]" id="inline-form-input-name" 
                            style="width: 100px;" list="matriculas-list" @blur="validaAgente( index )">
                        </b-form-input>
                        <datalist id="matriculas-list">
                            <option v-for="a in getAgentesLabels()" :key="a.nome"> {{ a }} </option>
                        </datalist>
                    </div>

                    <div style="margin-right: 20px;">
                        <label class="rotulos" for="inline-form-input-name"> Horário Retirada: </label><br>
                        <b-form-timepicker v-model="hraIni" locale="pt"></b-form-timepicker>
                    </div>
                    
                    <div v-if="!IS_PAGE_EDITABLE" style="margin-right: 20px;">
                        <label class="rotulos" for="inline-form-input-name"> Horário Entrega: </label><br>
                        <b-form-timepicker v-model="hraFim" locale="pt"></b-form-timepicker>
                    </div>
                    
                    <div v-if="!IS_PAGE_EDITABLE" style="margin-right: 20px;">
                        <label for="inline-form-input-name" class="mr-2"> Observação: </label>
                        <b-form-input autocomplete="off" @keydown="handleKeyDown" v-model="usuMatricula[ index ]" id="inline-form-input-name" 
                            style="width: 400px;" list="matriculas-list" @blur="validaAgente( index )">
                        </b-form-input>
                    </div>
            </div> 
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    </main>
  </template>
  
  <script>
  import FormDateComp  from '@/components/FormDateComp.vue';
  import FormTimeComp  from '@/components/FormTimeComp.vue';
  import FormInputComp from '@/components/FormInputComp.vue';
  import ButtonComp    from '@/components/ButtonComp.vue'; 

  import ComponentType from '@/utils/enums.js';
  
  export default
  {
    components:                  {
          FormDateComp,
          FormInputComp,
          ButtonComp,
          FormTimeComp
    },
    computed: 
    {   
    },
    props: {
        idValue: { required: true, },
        tablesAgentes:  { type: Array, }
    },
    name: 'AppAccordion',
    watch: { 
      idValue( newIdValue )         {
        this.idOperacao = newIdValue;
      },

       
    },
    created()
    {
      console.log("OKOKOKOK");
      this.getListaAgentes();

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
          BTN01: 1,
          BTN02: 2,
          IPT01: 3,
          IPT02: 4,

          modalIsVisible: false,
          modalMessage: "Deseja confirmar a operação?",
          hraIni: 0,
          hraFim: 0,
          agentesLabelBD: ['teste'],  /* Vetor de strings matricula - nome */
          agentesBD: [],       /* Vetor de objetos do tipo { nome, matricula }   */
          dataAtual: '2023-01-01',
          agentesHasSavedBD: [],
          teste: ['PEDRO', 'PULIN', 'BRUNO', 'OLA' ],

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
      /****** getAgenteData( index ) {
      const itemId = this.vetTablesData[ index ].matriculaAgente;
      var x = this.vetTablesData.filter( item => item.matriculaAgente === itemId );
      console.log( JSON.stringify( x ) ); }, ******/
      onInputTime( time )         {
            console.log("-- INPUT TIME =>>> "  + time );
      }, 
      onShownTime( time )         {
            console.log("-- SHOWN TIME =>>> "  + time );
      },
      onHiddenTime( time )        {
            console.log("-- HIDDEN TIME =>>> " + time );
      },
      onTimeUpdate( time )        {
            console.log("-- TIME =>>" + time );
      },
      onDateUpdate(  data )       {
            console.log("-- DATA =>>" + data );
      },
      
      onInput( compId, compType, data )                     
      {
          if ( compId == undefined )
               alert( "ATENÇÃO! Input com propriedade 'compID' " + compId + " não definida!" );
           
          console.log( "compId = " + compId + " -- compType = " + compType + " -- data = " + data );     
          switch( compType )                
          {
                case ComponentType.FORM_DATE:
                     this.processInputEvents( compId, data );
                break;
                case ComponentType.FORM_INPUT:
                     this.processInputEvents();
                break;
                case ComponentType.FORM_TYPE:
                     this.processInputEvents();
                break;
          }

         
      },
      onChange( compId, input )            {
        if ( compId == undefined )
               alert( "ATENÇÃO! Input com propriedade 'compID' " + compId + " não definida!" );
          
          console.log( "compId = " + compId + " -- " + input );
          switch( compId )                  {     
                  case this.IPT01:
                      console.log( "-USU =>> " + compId );
                  break;    
                  case this.IPT02:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN01:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN02:
                      console.log( "-USU =>> " + compId );
                  break;     
          }
      },
      onKeydown( compId, input )           {
        if ( compId == undefined )
               alert( "ATENÇÃO! Input com propriedade 'compID' " + compId + " não definida!" );
          
          console.log( "compId = " + compId + " -- " + input );
          switch( compId )                  {     
                  case this.IPT01:
                      console.log( "-USU =>> " + compId );
                  break;    
                  case this.IPT02:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN01:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN02:
                      console.log( "-USU =>> " + compId );
                  break;     
          }
      },
      onUpdate( compId, input )            {
        if ( compId == undefined )
               alert( "ATENÇÃO! Input com propriedade 'compID' " + compId + " não definida!" );
          
          console.log( "compId = " + compId + " -- " + input );
          switch( compId )                  {     
                  case this.IPT01:
                      console.log( "-USU =>> " + compId );
                  break;    
                  case this.IPT02:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN01:
                      console.log( "-USU =>> " + compId );
                  break; 
                  case this.BTN02:
                      console.log( "-USU =>> " + compId );
                  break;     
          }
      },
      /***************** INPUTS ****************/
 
      onButtonClick( compId, numClicks )  {
          if ( compId == undefined )
               alert( "ATENÇÃO! Botão com propriedade 'compID' não definida!" );
          console.log("- The button ID " + compId + " was clicked... " + numClicks );
      },
      updateUsuMatricula(index, value)    { 
          this.usuMatricula[index] = value;
      },
      handleKeyDown( event )              {
          const value = event.target.value;
          console.log( "AppAcordion || matri = " + value ); 
      },
      handleCloseModal()                  {
          console.log("Close ... ");
          this.modalIsVisible = false;
      },
      handleAcceptModal()                   {
          console.log("Accept ... ");
          this.modalIsVisible = false;
      },
      handleRejectModal()                   {
          console.log("Reject ... ");
          this.modalIsVisible = false;
      },
      getTabelasPorAgentes( index )
      { 
          var tableMatricula = this.vetTablesData.filter( item => item.matriculaAgente === this.usuMatricula[ index ] );
          // console.log( "data tst = " + JSON.stringify( tableMatricula ) );
          return tableMatricula;
      },
      toggleAccordion( index )              {
        // Toggle the state of the accordion
        this.$set( this.accordionState, index, !this.accordionState[index] );
      }, 
    }
  }
  </script>
 