<template>
    <div>
      <b-modal v-model="mVisible" hide-footer>
        <div class="modal-header">
            <h5 class="modal-title"> Selecione Equipamento </h5>
        </div>

        <div class="modal-body">
            <b-form-select v-model="equipSelecionado" :options="equipOpcoes"></b-form-select>
        </div>

        <b-button size="sm" variant="success" @click="onModalClose()">
            <i class="fas fa-plus"></i> Adicionar Equipamento
        </b-button>
      </b-modal>
  
      <!--<my-modal id="myModal" title="Confirmação" :message="modalMessage" 
          :visible="modalIsVisible" @update:visible="modalIsVisible = $event"
          @on-close-modal="handleCloseModal()" @on-accept-modal="handleAcceptModal()" @on-reject-modal="handleRejectModal()"
       ></my-modal>-->
      
      <div class="btn-add">
        <b-button size="sm" 
            style="width: 200px"
            v-if="IS_PAGE_EDITABLE && !hasSavedOnDatabase" class="btn-add" variant="success" @click="showEquipamentosModal()">
               <i class="fas fa-plus"></i> Selecionar Equipamentos
        </b-button>
      </div>

      <div class="image-grid"> <!-- grid -->
          <div v-for="equip in equipamentos" :key="equip.id" class="image-column">
            <!-- Img -->
            <div class="image-wrapper">
                <img :style="{ width: equip.imageSize, height: equip.imageSize }" :src="equip.url" alt="Image" >
            </div>

            <!-- Tipo -->
            <p><b> {{ equip.tipo }} </b></p>
            
            <!-- Input
            <b-form-input class="mx-auto" style="width: 120px" type="text" autocomplete="off" list="id-equips-list" v-model="equip.idData" @blur="validaEquipamentoID( equip.idData )"></b-form-input>
            <datalist id="id-equips-list"> <option v-for="eq in equipamentosIDsBD" :value="eq.numSerie" :key="eq.id">{{ eq.numSerie }}</option>
            </datalist> -->

            <!-- <div class="idDataLabel"> {{ equip.idDataLabel }} : </div> -->
            <b-form-input 
                class="mx-auto"
                placeholder="Insira ID."
                style="width: 130px" 
                type="text"
                autocomplete="off" 
                :list="getDatalistId( equip.tipo )" 
                v-model="equip.idData"
                @blur="validaEquipamentoID( equip )"
                :disabled="( !isAddOperacoesPage || hasSavedOnDatabase )"> <!-- CASO PAG EDITÁVEL + FOI SALVO ON BD -->
            </b-form-input>

            <datalist :id="getDatalistId( equip.tipo )">
                <option v-for="option in getFilteredDatalistOptions( equip.tipo )" :value="option" :key="option"> {{ option }} </option>
            </datalist>
            
            <div v-if="( equip.tipo == 'Viatura' )">
                <div class="labels" style="padding-top: 10px;"> Km Inicial: </div>
                <b-form-input
                   type="text"
                   class="mx-auto"
                   v-if="( equip.tipo == 'Viatura' )"
                   :disabled="isComponentDisabled()" 
                   v-model="equip.kmIni"
                   style="width: 130px;"
                   lazy-formatter
                   :formatter="formatKm" />

                <!--<knob-control 
                    v-if="( equip.tipo == 'Viatura' )"
                    :disabled="isComponentDisabled()" :value-display-function="velocimentoIniLabel"
                    v-model="equip.kmIni"  size="80"  stepSize="10.5"
                    :min="0" :max="5000" :stroke-width="8"
                />-->
                <div v-if="( ( equip.tipo == 'Viatura' ) && ( !isAddOperacoesPage ) )"
                     class="labels mx-auto"> Km Final: </div>

                <b-form-input 
                   v-if="( ( equip.tipo == 'Viatura' ) && ( !isAddOperacoesPage ) )"
                   :disabled="isComponentDisabled()" 
                   v-model="equip.kmFim"
                   style="width: 130px;"
                   class="mx-auto" 
                   lazy-formatter
                   :formatter="formatKm"/>

                <!--<knob-control 
                    v-if="( ( equip.tipo == 'Viatura' ) && (!isAddOperacoesPage) )"
                    :disabled="isComponentDisabled()"
                    :value-display-function="velocimentoFimLabel"
                    v-model="equip.kmFim"
                    size="80"
                    stepSize="10.5"
                    :min="0"
                    :max="5000"
                    :stroke-width="8"
                />-->
                <!-- kmInicial ===> {{ equip.kmIni }}
                     kmFinal   ===> {{ equip.kmFim  }} -->
              </div>

              <!-- Botão LIXO -->
              <button class="btn btn-link" 
                      @click="removeEquipComponent( equip.id )"
                      :disabled="isComponentDisabled()">
                    <i class="fas fa-trash-alt"></i>
              </button>

              <b-popover v-if="( equip != null )" :target="popover" + equip.id :key="equip.id" triggers="hover" placement="top">
                <template #title> Recebimento pendente </template>
                  Solicitar confirmação de recebimento ao agente.
              </b-popover>
              <i id="popover" class="fa-solid fa-hourglass-start" ></i>

              <div class="data-container">
                   <div v-if="!isAddOperacoesPage && !isComponentDisabled()" class="align-bottom">
                        <label class="labels" for="example-datepicker"> Data de Devolução: </label>
                        <b-form-datepicker v-model="equip.dataDevolucao" class="mb-2"  style="width:200px"></b-form-datepicker>
                        <label class="labels" for="inline-form-input-name" > Horário de Devolução: </label><br>
                        <!--  b-form-timepicker v-model="equip.horaDevolucao" locale="pt" style="width:200px"></b-form-timepicker>-->
                        <input style="width:200px; margin:5px;" class="mb-2 mr-sm-2 mb-sm-0 custom-input form-control" type="time" v-model="equip.horaDevolucao"/>
                   </div>
              </div>
              
          </div>
          </div>
    <br>

    <!-- -- --
      <div class="table-container">
           <div class="table-centralizer">
              ################### DEBUG AREA ################### 
              {{ this.idOperacao }}
              {{ this.usuMatricula }}
              IS_PAGE_EDITABLE ? =  {{ IS_PAGE_EDITABLE }}
              hasSavedOnDatabase? {{ hasSavedOnDatabase }} 
           </div>
      </div>
    -- -- -->

      <b-button
         size="sm"
         v-if="IS_PAGE_EDITABLE && !hasSavedOnDatabase" 
         class="btn-add" variant="primary" 
         @click="cadastrarAgenteBD()"
         :disabled="isEquipamentosValidos()">
         <i class="fa fa-database"></i> 
         {{ this.cadastrarBtnName }}
      </b-button>
  </div>
  </template>
  <script>
  import UtilsMixin  from '@/utils/UtilsMixin.js' //--- SE ASSEMELHA A HERANÇA
// import { FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
  import axios       from 'axios';
  import { BButton } from "bootstrap-vue";
  export default 
  {
    mixins: [UtilsMixin],
    props: 
    {
      // -- VETOR NO SEGUINTE FORMATO ---
      /*[{"idOperacao":"375","matriculaAgente":"41602","idEquipamento":"1029036","dataDevolucao":"2023-10-06","horaDevolucao":"12:02:00","isAvariado":null,"tipoEquipamento":"RADIO_HT","kmIni":"0","kmFim":"0"},
       {"idOperacao":"375","matriculaAgente":"41602","idEquipamento":"3005974","dataDevolucao":"2023-10-13","horaDevolucao":"22:22:00","isAvariado":null,"tipoEquipamento":"COLETE","kmIni":"0","kmFim":"0"}]*/
      compTableItens:[], /* APENAS É UTILIZADO NA TELA DE HISTÓRICO !!!!!! */

      idOperacao:   {
         required: true  
      }, 
      usuMatricula: {
         required: true  
      },
    },
    name: 'AppEquipamentosGrid',
    
    components:     {
      //MyModal,
      BButton,
      // KnobControl,
    },
    watch:          { 
        usuMatricula( newValue )         
        {
          this.usuMatriculaLocal = newValue;
          // alert("-AKI = " + this.usuMatriculaLocal );
        },
        compTableItens( value )   {
          if ( value )
               console.log( "COMPS !! >>> " + JSON.stringify( value ) );
        }
    },
    computed:
    {  
        // CONSTANTE
        IS_PAGE_EDITABLE()    {
            return this.$store.state.isPageEditable;
        }, 
         
    },
    
    
  
    /* Realiza montagem do componente caso seja leitura/Busca Histórico, com base no properties passado*/
    created() 
    {
        // alert( "E = " + JSON.stringify( this.equipamentosBD ) );   
        // console.log( "Create Table where?? >> " + this.$route.name );

        //const number = 123456.789;
        
        if ( this.$route.name == "addOperacoes" )   {
             this.isAddOperacoesPage = true;
        }    else    {
             this.isAddOperacoesPage = false;
             this.cadastrarBtnName = "Atualizar Agente/Equipamento";
        }
        this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
        // var str = this.$store.state.isPageEditable;
        /* console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
        console.log("-AppEquipGrid || isAddOperacoes? " + this.isAddOperacoesPage );*/

        /* Monta o componente de acordo com os dados recebidos do BD, na propriedade atualizada no watch
           this.compTableItens */
        // console.log( "CAMPOS >>" + JSON.stringify( this.compTableItens ) );

        //  var tam = this.compTableItens.length;
        
        // -------------- CASO SEJA A CONSULTA HISTÓRICO ---------------
        if  ( this.compTableItens != null )     {
             // console.log( "CREATED APP-GRID ||| IS_PAGE_EDITABLE ? = " + this.IS_PAGE_EDITABLE );
             
             this.montaGrid();
        }
    },
    data() 
    {
      return  {

        /***** CONSTANTES *****/
        LIMITE_EQUIPAMENTOS: 6,

        /***** Modal de seleção *****/
        mVisible: false,
        equipSelecionado: null, /* Tipo de Equipamento selecionado no modal */
        equipOpcoes: [ 'Rádio HT', 'Viatura', 'Colete', 'Todos' ], // 'Talonário',
        equipId: [],
        /***** Modal de seleção *****/

        inputEquipIDAtivos: [], /* lista de dados ativos */
        cadastrarBtnName: "Cadastrar Agente",

        equipamentos: [], 
        equipamentosBD: [],     /* Dados retornados da tabela de Equipamento */
        equipamentosIDsBD: [],  /* Conterá lista de placas, N° séries, ou IDs carregados do BD... */

        coletesBD:[],
        radiosBD:[],
        viaturasBD:[],

        kmInicial: 0.0, /* Define a Km inicial, p/ o atual componente inserido (Caso seja Viatura) */
        kmFinal: 0.0,
        usuMatriculaLocal: null,
        isAddOperacoesPage: -1, /** Verifica se esta página atual é a de adicionar Operações */
  
        /***** Dados de controle *****/
        hasSavedOnDatabase: false,
        isTableValidationOk: false,
        modalIsVisible: false,
        modalMessage: "Deseja confirmar a operação?",
        vet: [], 
        kmEstimado: '0.0',
        bairroOperacao: null,
        bairros: [
            { value: 1, text: 'Miramar' },
            { value: 2, text: 'Bessa' },
            { value: 2, text: 'Manaira' },
        ],
        agenteResponsavel: null,
        agentes: [
            { value: 1, text: 'Agente 1' },
            { value: 2, text: 'Agente 2' },
            { value: 2, text: 'Agente 3' },
            { value: 2, text: 'Agente 4' },
            { value: 2, text: 'Agente 5' },
            { value: 2, text: 'Agente 6' },
            { value: 2, text: 'Agente 7' },
            { value: 2, text: 'Agente 8' }
        ], 
      };
    }, 
    methods:     {
      formatKm( value )
      {    
        // alert( value );
        var newValue = new Intl.NumberFormat("pt-PT", {
            style: "unit",
            unit: "kilometer",
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format( value ).replace(" km", "").replace(",", ".").replace(/[a-zA-Z]/g, '');
          // console.log( "kmIni = " + newValue );
          return newValue;
      },
      montaGrid()         
      {
          for ( var i=0; i<this.compTableItens.length; i++ )      
          {     
                if ( this.compTableItens[i].tipoEquipamento == "RADIO_HT" ) {
                    this.equipSelecionado = "Rádio HT";
                }
                else if ( this.compTableItens[i].tipoEquipamento == "VIATURA" ) {
                    this.equipSelecionado = "Viatura";
                    // this.kmInicial = parseFloat( this.compTableItens[i].kmIni );
                }
                else if ( this.compTableItens[i].tipoEquipamento == "COLETE" ) {
                    this.equipSelecionado =  "Colete";
                }
                // console.log( "SELECTED !!!!! " + this.equipSelecionado );

                const equipamento       =         {
                      id: this.equipamentos.length + 1,
                      url: this.getImageUrl(),
                      imageSize: this.getImageSize(),
                      tipo: this.equipSelecionado,
                      idDataLabel : this.equipSelecionado,
                      idData: this.compTableItens[i].idEquipamento,
                      matriculaAgente: this.compTableItens[i].matriculaAgente,
                      kmIni: this.compTableItens[i].kmIni,
                      kmFim: this.compTableItens[i].kmFim,
                } 
                this.equipamentos.push( equipamento );
          }

      },
      isComponentDisabled()
      {
        /**** Caso (não editavel/pág. sem ser Add) OU (salvo no BD)... desabilitar ****/
        var isComponentDisabled = ( !this.IS_PAGE_EDITABLE || this.hasSavedOnDatabase );
        // console.log( "isComponentDisabled ? " + isComponentDisabled );
        return isComponentDisabled;
      },
      velocimentoIniLabel( kmInicial ) { 
          //console.log( "Valor real = " + kmInicial );
          return ( kmInicial * 100 ) + "";
      },
      velocimentoFimLabel( kmFinal ) { 
          //console.log( "Valor real = " + kmFinal );
          return ( kmFinal * 100 ) + "";
      },
      handleCloseModal()  
      {
          // console.log("Close ... ");
          this.modalIsVisible = false;
          this.modalMessage = "x";
      },
      handleAcceptModal() 
      {
          // console.log("Accept ... ");
          this.modalIsVisible = false;
          this.modalMessage = "y";
      },
      handleRejectModal() 
      {
          // console.log("Reject ... ");
          this.modalIsVisible = false;
          this.modalMessage = "d";
      },
      showEquipamentosModal()                   {
          this.mVisible = true;
      },
      onModalClose()                            {
          // console.log('Selected Option:', this.equipSelecionado );
          if ( this.equipSelecionado == "Todos" ) 
          {
              for ( var i = 0; i<(this.equipOpcoes.length - 1); i++ )      {
                   //console.log( "i = " + i + "] " + this.equipOpcoes[i] );
                   this.equipSelecionado = this.equipOpcoes[i];
                   this.addEquipComponent();
              }
          } else {
              
             if ( this.equipSelecionado != null ) 
                  this.addEquipComponent();
          }
      },
      sendStatusToParent() 
      {
         // console.log( "Sending data to parent....");
          this.$emit('data-updated', this.hasSavedOnDatabase );
      },
      getImageUrl() 
      {
          // Logic to determine the image URL based on equipSelecionado
          if ( this.equipSelecionado === 'Viatura' )          {
               return require('@/assets/viatura.png');
          } 
          else if ( this.equipSelecionado === 'Talonário' )   {
               return require('@/assets/talonario.png');
          } 
          else if ( this.equipSelecionado === 'Rádio HT' )    {
               return require('@/assets/radio.jpg');
          } 
          else if ( this.equipSelecionado === 'Etilômetro' )  {
               return require('@/assets/etilometro.png');
          } 
          else if ( this.equipSelecionado === 'Colete' )      {
               return require('@/assets/colete_new.jpg');
          }
      },
      getImageSize()  
      {
          if ( ( this.equipSelecionado === 'Viatura' ) || ( this.equipSelecionado === 'Talonário' ) )
                return '30%'; 
          else if ( this.equipSelecionado === 'Rádio HT' )  
              return '60%';
          else if ( this.equipSelecionado === 'Etilômetro' )  
              return '50%';
          else if ( this.equipSelecionado === 'Colete' )  
              return '30%';
      },
      removeEquipComponent( id ) 
      {
          this.equipamentos = this.equipamentos.filter((image) => image.id !== id);
      },
      addEquipComponent() 
      {
        // console.log( "LISTA EQUIPS =>> " + JSON.stringify( this.LISTA_EQUIPAMENTOS_SELECIONADOS ) );
        //console.log( "-->> kmInicial = " + this.kmInicial );
        var hasViatura;
        var isViatura = ( this.equipSelecionado == 'Viatura' );

        if ( this.equipamentos.length >= this.LIMITE_EQUIPAMENTOS ) 
        {
             /*** this.modalMessage   = "Limite de equipamentos atingido.";  
             this.modalIsVisible = true; ***/
             this.showModal( "Limite de equipamentos atingido." );
             return;
        }
        
        this.getEquipamentosBD( this.equipSelecionado );
        if ( isViatura ) 
        {
             const hasViatura = this.equipamentos.some(equip => equip.tipo === 'Viatura');
             if ( hasViatura ) 
             {
                 /* this.modalMessage   = "Viatura já inserida para este Agente.";  
                    this.modalIsVisible = true; */
                 this.showModal( "Viatura já inserida para este Agente." );
                 return;
             }  
        }
        const equipamento   =   {
              id: this.equipamentos.length + 1,
              url: this.getImageUrl(),
              imageSize: this.getImageSize(),
              tipo: this.equipSelecionado,
              idDataLabel : this.equipSelecionado === 'Viatura' ? "Placa" : ( this.equipSelecionado === 'Rádio HT' || this.equipSelecionado === 'COLETE' ? 'Id.' : 'N° de Série' ),
              idData: '', //this.equipSelecionado === 'Viatura' ? "Placa" : ( this.equipSelecionado === 'Rádio HT' || this.equipSelecionado === 'COLETE' ? 'Id.' : 'N° de Série' ),
              kmIni: null,
              kmFim: null
        };
        if ( ( ( isViatura ) && ( !hasViatura ) ) || ( !isViatura ) )
                 this.equipamentos.push( equipamento );
      },
      validaEquipamentoID( equipamentoObj ) 
      {
      /* console.log( "valida" + JSON.stringify( equipamentoObj ));
         console.log("--idData ==>>> " + equipamentoObj.idData );
         console.log("--Viaturas ==>>> " + JSON.stringify( this.viaturasBD ));*/
         
         /*var vet = this.getDatalistOptions( equipamentoObj.tipo );
         console.log( "->> Valida lista equips === " + JSON.stringify( vet ) );*/

         // A lista do objeto atual, contem o ID selecionado ?!?
         var isValid = this.getDatalistOptions( equipamentoObj.tipo ).includes( equipamentoObj.idData );

         var msg = "";
         
         if ( equipamentoObj.tipo == "Viatura" )
              msg = "Placa inválida";
         else if ( equipamentoObj.tipo == "Colete" )
              msg = "N° de série inválido";
         else if ( equipamentoObj.tipo == "Rádio HT" )
              msg = "Identificador inválido";

         if ( !isValid ) 
         {
              /*this.modalIsVisible = true;
              this.modalMessage = msg;*/
              this.showModal( msg );
          }    else   {
              this.inputEquipIDAtivos.push( equipamentoObj.idData );
          }
         // console.log( "-->> C  === " + isValid );
         
        /* var isValid = this.equipamentosIDsBD.contains( idData );
        console.log( "Valida equip. ID = " + isValid );*/
      },
      getDatalistId( type ) 
      {
        return `id-equips-list-${type}`;
      },
      
      /* Lista com as opções disponíveis, excluindo-se aqueles IDs de equipamento já escolhidos. */
      getFilteredDatalistOptions( type )        {
          return this.getDatalistOptions( type ).filter( item => !this.inputEquipIDAtivos.includes( item ) );
      },
      /* De acordo com o TIPO do equipamento, será filtrado os objetos específicos para 
      ser retornado apenas a lista com os Ientificadores da DATALIST */
      getDatalistOptions( type )  {

          // console.log( "Tipo datalist = " + type );
           var dataList = [];

          if (type === 'Colete')                {
              // console.log( JSON.stringify(this.coletesBD) );
              dataList = this.coletesBD
                  .filter(obj => typeof obj.id === 'string')
                  .map(obj => obj.id);
              // return IDs;

          } else if (type === 'Rádio HT') {
              // return this.radiosBD;
              dataList = this.radiosBD
                  .filter(obj => typeof obj.id === 'string')
                  .map(obj => obj.id);
              // return IDs;
          
          } else if (type === 'Viatura')  {

             dataList = this.viaturasBD
                  .filter(obj => typeof obj.placa === 'string')
                  .map(obj => obj.placa);
              // console.log( "placas = " + JSON.stringify( placas ) );
              // return placas;
          }
          return dataList;
      },
      async getEquipamentosBD( tipoEq )             
      {
            var sendData = {
                dados: {
                    entidade: 'equipamento',
                    operacao: 'consultar'
                }
            };
            console.log( tipoEq );
            // console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) + tipoEq );
            try {
                  var response = await axios.post( this.$SERVICES_ENDPOINT_URL , sendData );
                  // console.log( "Resposta API = " +  JSON.stringify( response.data , null,  2 ) );
                  var data = response.data; // -->>> Isso chama o watcher !
                  // console.log("Dados retornados = " +  this.responseData.dados );
                  // console.log('-DATA == ' + JSON.stringify(  data ).replace( /\\/g, "" )  );
                  // console.log( "MSG = " + data.message + "|| code= " + data.code );
                  this.equipamentosBD = data.data;
            }  catch ( error )  {
                 console.error(error);
            }                    
                // console.log( "E = " + JSON.stringify( this.equipamentosBD ));   
                var array = this.equipamentosBD;
                this.viaturasBD = array
                .filter( item => item.tipo === "VIATURA" )
                .map(({ id, numSerie, placa }) => ({ id, numSerie, placa }));
                
                this.coletesBD = array
                .filter( item => item.tipo === "COLETE" )
                .map(({ id, numSerie }) => ({ id, numSerie }));

                this.radiosBD = array
                .filter( item => item.tipo === "RADIO_HT" )
                .map(({ id, numSerie }) => ({ id, numSerie }));

                /* console.log( "Viatura = " + JSON.stringify( this.viaturasBD ) );
                console.log( "Radio = " + JSON.stringify( this.radiosBD ) );
                console.log( "Coletes = " + JSON.stringify( this.coletesBD ) );*/
        
               
              /*****************************************************
               
              ****************************************************/
      },
      isEquipamentosValidos()
      {
        //console.log( "==>> isEquipamentosValidos?" + this.equipamentos.length );
        if ( this.equipamentos.length > 0 )
             return false;
      },
      /* ********* NOVA FUNÇÃO DE ADAPTAÇÃO DA ESTRUTURA DE DADOS ********* */
      cadastrarAgenteBD() 
      {  
            var vet = []; // vet[0] = {  idOperacao: 1, dataDevolucao: "0000-00-00", horaDevolucao: "0000-00-00", "idEquipamento":"123", "isAvariado":null, "matriculaAgente":"123"} 
            var matricula;
            var tam;
            var auxObj;
            
            // 1- CASO CADASTRANDO O AGENTE 
            if ( this.isAddOperacoesPage )    
            {
                /*** *** *** *** console.log("-- MATRICULA ==>>> " + this.usuMatriculaLocal );
                alert("-AKI MATRICULA ?? " + this.usuMatriculaLocal ); *** *** *** ***/
                if ( this.usuMatriculaLocal == null )           {
                     this.showModal("Matrícula não preenchida.");
                     return;
                }    else    {
                     matricula = this.usuMatriculaLocal.split(" - ")[0];
                     // console.log( this.idOperacao + " || matr =" +  matricula + " -->> lista -> " +  JSON.stringify(  vet ) );
                }
                // var lista;
                tam = this.equipamentos.length;
                // console.log("-->> N EQUIPS = " + tam );

                if ( tam == 0 )              {
                     /** this.modalMessage = "Nenhum equipamento selecionado.";
                     this.modalIsVisible = true;**/
                     this.showModal( "Nenhum equipamento selecionado." );
                     return;
                }
                for  ( var i=0; i<tam; i++ )     
                {
                    // console.log( "i[ " + i + "] =>> " + JSON.stringify( this.equipamentos[i] ));
                    // console.log( "ID Ope. ==>> " + this.idOperacao );
                    // console.log( "VET AGENTE ==>> " + JSON.stringify( vet[ i ] ) );
                    if ( this.equipamentos[i].tipo == "Viatura" )   
                    {
                        if ( ( this.equipamentos[i].kmIni == null )||( this.equipamentos[i].kmIni == null ) )   { 
                               /* this.modalMessage = "Preencha quilometragem inicial.";
                               this.modalIsVisible = true;*/
                               this.showModal( "Preencha quilometragem inicial." );
                               return;
                        }
                    }    else    {
                        this.equipamentos[i].kmIni = 0.0;
                    }
                    // console.log( i + " || Data = " + this.equipamentos[ i ].idData );

                    if ( this.equipamentos[i].idData == 0 )
                    {
                         /* this.modalMessage = "Preencha todos os campos.";
                         this.modalIsVisible = true;*/
                         this.showModal( "Preencha todos os campos." );
                         return;
                    }
                    auxObj = {   
                          idOperacao : this.idOperacao, 
                          dataDevolucao : "0000-00-00",
                          horaDevolucao : "00:00:00",
                          idEquipamento : this.equipamentos[i].idData,
                          isAvariado    : null,
                          tipoEquipamento : null,
                          matriculaAgente : matricula,
                          kmIni: this.equipamentos[i].kmIni,
                          kmFim: 0.0,
                    }
                    //**** Ajuste/Conversão de valores/dados para os valores da tabela 'equipamentos' no BD. 
                    if ( this.equipamentos[i].tipo == "Viatura"  ) auxObj.tipoEquipamento = "VIATURA";
                    if ( this.equipamentos[i].tipo == "Rádio HT" ) auxObj.tipoEquipamento = "RADIO_HT";
                    if ( this.equipamentos[i].tipo == "Colete"   ) auxObj.tipoEquipamento = "COLETE";             
                    vet[ i ] = auxObj;
                }
                // ----- console.log( JSON.stringify( vet ) ); ----- 
                // ----- 2- CASO ATUALIZANDO O AGENTE, NO HISTÓRICO ----- 

              }    else    {

                // console.log( this.idOperacao + "||matr =" +  matricula + " --> lista ->" +  JSON.stringify(  vet ));
                // console.log(" CASO ATUALIZANDO O AGENTE....");
                matricula = this.usuMatriculaLocal;
                tam = this.equipamentos.length;

                for  ( i=0; i < tam; i++ )     
                {
                    // console.log( "i[ " + i + "] =>> " + JSON.stringify( this.equipamentos[i] ));
                    auxObj = {   
                          idOperacao : this.idOperacao, 
                          dataDevolucao : this.equipamentos[i].dataDevolucao,
                          horaDevolucao : this.equipamentos[i].horaDevolucao,
                          idEquipamento : this.equipamentos[i].idData,
                          isAvariado    : null,
                          tipoEquipamento : null,
                          matriculaAgente : this.equipamentos[i].matriculaAgente,
                          kmIni: this.equipamentos[i].kmIni,
                          kmFim: this.equipamentos[i].kmFim,
                    }
                    //*** Ajuste/Conversão de valores/dados para os valores da tabela 'equipamentos' no BD. ***
                    if ( this.equipamentos[i].tipo == "Viatura"  ) auxObj.tipoEquipamento = "VIATURA";
                    if ( this.equipamentos[i].tipo == "Rádio HT" ) auxObj.tipoEquipamento = "RADIO_HT";
                    if ( this.equipamentos[i].tipo == "Colete"   ) auxObj.tipoEquipamento = "COLETE";             
                    vet[ i ] = auxObj;
                    // console.log( "VET AGENTE atualiza ==>> " + JSON.stringify( vet[ i ] ) );
                }
                // console.log( JSON.stringify( vet ) );
              }
              this.cadastrarAgenteBD_LEGADO( vet );

      }, 
      convertKmToFloat( inputString )                                 {
          // Remove spaces from the input string
          // const stringWithoutSpaces = inputString.replace(/\\s/g, '');
          // alert( "-INPUT ?? " + inputString + " || tipo ??" + typeof inputString );
          /* var stringWithoutSpaces = inputString.replace(/\s/g, '');
          alert( "-stringWithoutSpaces = " + stringWithoutSpaces );
          // Replace the comma with a period (for decimal separator)
          const stringWithDecimalPoint = stringWithoutSpaces.replace( ',', '.' );*/
          const stringWithDecimalPoint = inputString.replace(/\u00A0/g, '').replace(',', '.');

          // Parse the resulting string to a float
          const resultFloat = parseFloat( stringWithDecimalPoint );
          return resultFloat;
      },
      // - FECHA cadastrarAgenteBD
      cadastrarAgenteBD_LEGADO( vet )             
      { // this.modalIsVisible = true;
        // console.log("CADASTRAR !!!!!");
        var operacaoStr = "";

        // 1- CASO CADASTRANDO O AGENTE 
        if ( this.isAddOperacoesPage ) operacaoStr = "cadastrar";
        else operacaoStr = "atualizar";
        var sendData     = {
            dados:  {
              entidade: 'usoEquipamento',
              operacao: operacaoStr,
              objeto: {}
            }
        }
        console.log( JSON.stringify( vet ) );

        for( var i=0; i < vet.length ; i++   )  
        {
          if ( vet[i].tipoEquipamento == "VIATURA" )                      {
               if ( ( vet[i].kmIni != null )||( vet[i].kmIni > "0" ) ) 
                      vet[i].kmIni = this.convertKmToFloat( vet[i].kmIni );
               if ( ( !this.isAddOperacoesPage ) && ( vet[i].kmFim != null )||( vet[i].kmFim > "0" ) )
                      vet[i].kmFim = this.convertKmToFloat( vet[i].kmFim );
          }
          var objAuxStr = JSON.stringify( vet[i] ).replace( /\\/g, "" ); 
          sendData.dados.objeto = JSON.parse( objAuxStr );  //---- vet[0]; // JSON.stringify( this.vet[0] ).replace( /\\/g, "" ).replace("id", "id_operacao");
          // this.validaNovaLinha( sendData.dados.objeto ); //---- console.log( "objAuxStr = " + objAuxStr );          
          // console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
  
          axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
               .then( response => {
                      var msg;
                      var data = response.data; // --- --->>> Isso chama o watcher !     
                      // console.log( "Resposta API ==>>> " +  JSON.stringify( response.data ).replace( /\\/g, "" ) );
                      var checkSQLErrorStr = JSON.stringify( response.data ).replace( /\\/g, "" );
                      // console.log( "Error? " + checkSQLErrorStr.search("ERROR") );
                       
                      if ( checkSQLErrorStr.search("ERROR") == 1 )
                           msg = "Erro de conexão com banco de dados";
                        
                           /****
                           * console.log('-DATA ==>>> ' + JSON.stringify(  response.data )  );
                           * console.log("-MSSG ==>>> " + data.message + "|| code= " + data.code );
                           * ****/
                        
                      if ( data.code == 0 )   
                      {
                          /** Caso cadastro, seta variável, para informar aos INPUTs serem desabilitados. No histórico/consultas não precisa isso. */
                          if ( this.isAddOperacoesPage )
                               this.hasSavedOnDatabase = true;

                          msg = data.message;
                          this.sendStatusToParent();
                          // console.log( "ID = " + data.data.id );
                          // this.idValue = data.data.id;
                      }
                      /* this.modalMessage = data.message;
                      this.modalIsVisible = true;*/
                      this.showModal( msg );
                } )
                .catch( error => {
                        this.error = error.message;
                } );
          }  // END-FOR
          // this.hasSavedOnDatabase = true;
      }
    }
  };
  </script>
  
  <style>
  .modal-content                   {
      background-color: var( --modal-color );  /*  rgb(158, 194, 218); - Sets the background color with alpha */
  }
  .dados-operacao                  {
    width: 100%;
    background-color: rgb(193, 193, 194);
  }
  .table-container                 {
    margin: 10px;
  }
  table.editable-table             {
    margin-top: 10px;
    font-size: small;
  }
  table.editable-table td          {
    vertical-align: middle;
  }
  .editable-table .data-cell       {
    padding: 8px;
    vertical-align: middle;
  }
  .editable-table .custom-checkbox {
    width: 50px;
  }
  .remove-icon                     {
    color: red;
    cursor: pointer;
    font-size: 20px;
  }
  
  .edit-icon {
    color: rgb(4, 83, 158);
    cursor: pointer;
    font-size: 20px;
  }
  
  .name-col {
    width: 120px;
  }
  
  .department-col {
    width: 150px;
  }
  
  .age-col {
    width: 100px;
  }
  
  .date-col {
    width: 200px;
  }
  
  .is-active-col {
    width: 100px;
  }
  
  .table-centralizer      {
    display: flex;
    justify-content: center; 
    align-items: center;
  }
  .btn-add                {
      width: 200px;
      display: flex;
      justify-content: center; 
      align-items: center;
  } 

  .legenda-tabela {
    color: rgb(5, 76, 104);
    font-size: 14px;
    font-weight: bold;
    content: "";
    padding-left: 5%;
    text-align: center;
  }
  /*.btn-add-equip {
    transform: translateX(30px);    
     padding: 10px;
     display: flex;
     justify-content: center; 
     align-items: center;
    }*/
    .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
}

.column             {
  text-align: center;
}    

.image-grid         {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  /** Auto-height **/
  height: auto;
  display: inline-block; /* Ensures the div shrinks to fit its content */
  /*overflow: hidden;  Hides any content that overflows the div */
}

.image-column       {
    flex: 1 1 200px; /* Adjust the width as per your needs */
    text-align: center;
    padding: 10px;
    align-items: flex-start;
    /** Auto-height **/
    height: auto;
    display: inline-block; /* Ensures the div shrinks to fit its content */
    /* overflow: hidden; Hides any content that overflows the div */
}

.image-wrapper            {
    width: 100%;
    height: 20%;  /* Adjust the height as per your needs */
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-wrapper img        {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.button-trash             {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.idDataLabel            {
   color: rgb(0, 0, 0);
   font-size: 10px;
   font-weight: bold;
}

.align-bottom           {
    margin-top: auto;
    text-align: center;
}
.data-container           {
    display: flex;
    justify-content: center;
    align-items: center;
}

.titulo-operacao        {
    color: rgb(5, 76, 104);
    font-size: 15px;
    text-align: center;
    font-weight: bold;
}

.labels   {
  color: rgb(0, 0, 0);
  font-size: 13px;
  font-weight: bold;
} 
</style>