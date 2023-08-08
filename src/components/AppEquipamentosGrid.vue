<template>
    <div>
      <b-modal v-model="mVisible" @hide="onModalClose" hide-footer>
        <div class="modal-header">
            <h5 class="modal-title"> Selecione Equipamento </h5>
        </div>
        <div class="modal-body">
            <b-form-select v-model="equipSelecionado" :options="equipOpcoes"></b-form-select>
        </div>
      </b-modal>
  
      <my-modal id="myModal" title="Confirmação" :message="modalMessage" 
          :visible="modalIsVisible"
          @update:visible="modalIsVisible = $event"
          @on-close-modal="handleCloseModal()"
          @on-accept-modal="handleAcceptModal()"
          @on-reject-modal="handleRejectModal()"
       ></my-modal>
      
      <div class="btn-add-equip">
        <b-button v-if="IS_PAGE_EDITABLE && !hasSavedOnDatabase" class="btn-add" variant="success" @click="showModal()">
          <i class="fas fa-plus"></i> Adicionar Equipamento
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
                style="width: 120px" 
                type="text"
                autocomplete="off" 
                :list="getDatalistId(equip.tipo)" 
                v-model="equip.idData"
                @blur="validaEquipamentoID( equip )"
                :disabled="( !isAddOperacoesPage || hasSavedOnDatabase )"> <!-- CASO PAG EDITÁVEL + FOI SALVO ON BD -->
            </b-form-input>
            <datalist :id="getDatalistId(equip.tipo)">
              <option v-for="option in getFilteredDatalistOptions( equip.tipo )" :value="option" :key="option">{{ option }}</option>
            </datalist>
            
            <div v-if="( equip.tipo == 'Viatura' )">
              <div style="font-size: 12px;padding-top: 5px;"><b> Km Inicial: </b></div>
              <knob-control 
                  v-if="( equip.tipo == 'Viatura' )"
                  :disabled="isComponentDisabled()"
                  :value-display-function="velocimentoIniLabel"
                  v-model="equip.kmIni"
                  size="80"
                  stepSize="10.5"
                  :min="0"
                  :max="5000"
                  :stroke-width="8"
              />
              <div v-if="( ( equip.tipo == 'Viatura' ) && (!isAddOperacoesPage) )"
              style="font-size: 12px;padding-top: 5px;"><b> Km Final: </b></div>
              <knob-control 
                  v-if="( ( equip.tipo == 'Viatura' ) && (!isAddOperacoesPage) )"
                  :disabled="isComponentDisabled()"
                  :value-display-function="velocimentoFimLabel"
                  v-model="equip.kmFim"
                  size="80"
                  stepSize="10.5"
                  :min="0"
                  :max="5000"
                  :stroke-width="8"
              />
              <!-- kmInicial ===> {{ equip.kmIni }}
                   kmFinal   ===> {{ equip.kmFim  }} -->
            </div>

            <!-- Botão LIXO -->
            <button class="btn btn-link" 
              @click="removeEquipComponent( equip.id )"
              :disabled="isComponentDisabled()">
              <i class="fas fa-trash-alt"></i>
            </button>

            <div v-if="!isAddOperacoesPage && !isComponentDisabled()" class="align-bottom">
                 <label class="titulo-operacao" for="example-datepicker"> Data de Devolução: </label>
                 <b-form-datepicker id="example-datepicker"  v-model="equip.dataDevolucao" class="mb-2"  style="width:200px"></b-form-datepicker>
                 <label class="titulo-operacao" for="inline-form-input-name" > Horário de Devolução: </label><br>
                 <b-form-timepicker v-model="equip.horaDevolucao" locale="pt" style="width:200px"></b-form-timepicker>
            </div>
            
            
          </div>
          </div>
  
      <br>
    <!--
      <div class="table-container">
      <div class="table-centralizer">
        ################### DEBUG AREA ################### 
        {{ this.idOperacao }}
        {{ this.usuMatricula }}
        IS_PAGE_EDITABLE ? =  {{ IS_PAGE_EDITABLE }}
        hasSavedOnDatabase? {{ hasSavedOnDatabase }} 
      </div>
      </div>
    -->

      <b-button
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
  import axios       from 'axios';
  import MyModal     from '@/components/MyModal.vue';
  import { BButton } from "bootstrap-vue";
  import KnobControl from 'vue-knob-control';
  export default 
  {
    props: 
    {
      compTableItens:[],
      idOperacao:   {
         required: true  
      }, 
      usuMatricula: {
        required: true  
      },
    },
    name: 'AppEquipamentosGrid',
    
    components:     {
      MyModal,
      BButton,
      KnobControl,
    },
    watch:          { 
        usuMatricula( newValue )         
        {
          console.log( "MATRICULA !! >>> " + this.usuMatriculaLocal );
          this.usuMatriculaLocal = newValue;
        }
    },
    computed:
    {  
        // CONSTANTE
        IS_PAGE_EDITABLE()  {
            return this.$store.state.isPageEditable;
        }, 
    },
    /* Realiza montagem do componente caso seja leitura/Busca Histórico, com base no properties passado*/
    created() 
    {
        // alert( "E = " + JSON.stringify( this.equipamentosBD ) );   
        console.log( "Create Table where?? >> " + this.$route.name );
        
        if ( this.$route.name == "addOperacoes" )   {
             this.isAddOperacoesPage = true;
        }    else    {
             this.isAddOperacoesPage = false;
             this.cadastrarBtnName = "Atualizar Agente/Equipamento";
        }
        this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
        var str = this.$store.state.isPageEditable;
        console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
        console.log("-AppEquipGrid || isAddOperacoes? " + this.isAddOperacoesPage );

        /* Monta o componente de acordo com os dados recebidos do BD, na propriedade atualizada no watch
           this.compTableItens */
        console.log( "CAMPOS >>" + JSON.stringify( this.compTableItens ) );

        // var tam = this.compTableItens.length;
        if( this.compTableItens != null ) {
             // console.log( "CREATED APP-GRID ||| IS_PAGE_EDITABLE ? = " + this.IS_PAGE_EDITABLE );
        
        for ( var i=0; i<this.compTableItens.length; i++ )      
        {     
              //console.log("Tipo =>> " + this.compTableItens[i].tipoEquipamento );

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

              const equipamento   =   {
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
        equipOpcoes: [ 'Talonário', 'Rádio HT', 'Viatura', 'Colete', 'Etilômetro', 'Todos' ],
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
      isComponentDisabled()
      {
        /**** Caso (não editavel/pág. sem ser Add) OU (salvo no BD)... desabilitar ****/
        var isComponentDisabled = ( !this.IS_PAGE_EDITABLE || this.hasSavedOnDatabase );
        // console.log( "isComponentDisabled ? " + isComponentDisabled );
        return isComponentDisabled;
      },
      velocimentoIniLabel( kmInicial ) { 
          console.log( "Valor real = " + kmInicial );
          return ( kmInicial * 100 ) + "";
      },
      velocimentoFimLabel( kmFinal ) { 
          console.log( "Valor real = " + kmFinal );
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
      showModal()           {
          this.mVisible = true;
      },
      onModalClose()        {
          console.log('Selected Option:', this.equipSelecionado );

          if ( this.equipSelecionado == "Todos" ) 
          {
              for( var i=0; i<4; i++ )    {
                   console.log( "i = " + i + "] " + this.equipOpcoes[i] );
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
          console.log( "Sending data to parent....");
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
        console.log( "-->> kmInicial = " + this.kmInicial );

        if ( this.equipamentos.length >= this.LIMITE_EQUIPAMENTOS ) 
        {
             this.modalMessage   = "Limite de equipamentos atingido.";  
             this.modalIsVisible = true;
             return;
        }
        
        this.getEquipamentosBD( this.equipSelecionado );
        if ( this.equipSelecionado == 'Viatura' ) 
        {
             const hasViatura = this.equipamentos.some(equip => equip.tipo === 'Viatura');
             if ( hasViatura ) 
             {
                 this.modalMessage   = "Viatura já inserida para este agente.";  
                 this.modalIsVisible = true;
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
            this.modalIsVisible = true;
            this.modalMessage = msg;
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
      getFilteredDatalistOptions( type )  {
          return this.getDatalistOptions( type ).filter( item => !this.inputEquipIDAtivos.includes( item ) );
      },
      /* De acordo com o TIPO do equipamento, será filtrado os objetos específicos para 
      ser retornado apenas a lista com os Ientificadores da DATALIST */
      getDatalistOptions( type )  {

          // console.log( "Tipo datalist = " + type );
           var dataList = [];

          if (type === 'Colete')          {
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
            console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) + tipoEq );
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
        console.log( "==>> isEquipamentosValidos?" + this.equipamentos.length );
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
                console.log( "MATRICULA ==>>> " + this.usuMatriculaLocal );
                matricula = this.usuMatriculaLocal.split(" - ")[0];
                console.log( this.idOperacao + "||matr =" +  matricula + " --> lista ->" +  JSON.stringify(  vet ));
                
                // var lista;

                tam = this.equipamentos.length;
                for  ( var i=0; i<tam; i++ )     
                {
                    console.log( "i[ " + i + "] =>> " + JSON.stringify( this.equipamentos[i] ));
                    console.log( "ID Ope. ==>> " + this.idOperacao );

                    if ( this.equipamentos[i].kmIni == null ) 
                         this.equipamentos[i].kmIni = 0.0;
                    auxObj    =  {   
                          idOperacao : this.idOperacao, 
                          dataDevolucao : "0000-00-00",
                          horaDevolucao : "0000-00-00",
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
                    console.log( "VET AGENTE ==>> " + JSON.stringify( vet[ i ] ) );
                }
                console.log( JSON.stringify( vet ) );

              // 2- CASO ATUALIZANDO O AGENTE, NO HISTÓRICO
              } else {
                console.log(" CASO ATUALIZANDO O AGENTE....");

                matricula = this.usuMatriculaLocal;
                console.log( this.idOperacao + "||matr =" +  matricula + " --> lista ->" +  JSON.stringify(  vet ));
                
                tam = this.equipamentos.length;
                for  (i=0; i<tam; i++ )     
                {
                    console.log( "i[ " + i + "] =>> " + JSON.stringify( this.equipamentos[i] ));
                    auxObj    =  {   
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
                    //**** Ajuste/Conversão de valores/dados para os valores da tabela 'equipamentos' no BD. 
                    if ( this.equipamentos[i].tipo == "Viatura"  ) auxObj.tipoEquipamento = "VIATURA";
                    if ( this.equipamentos[i].tipo == "Rádio HT" ) auxObj.tipoEquipamento = "RADIO_HT";
                    if ( this.equipamentos[i].tipo == "Colete"   ) auxObj.tipoEquipamento = "COLETE";             
                    vet[ i ] = auxObj;
                    console.log( "VET AGENTE atualiza ==>> " + JSON.stringify( vet[ i ] ) );
                }
                console.log( JSON.stringify( vet ) );
              }
              this.cadastrarAgenteBD_LEGADO( vet );

      }, // - FECHA cadastrarAgenteBD
      cadastrarAgenteBD_LEGADO( vet )             
      {
        // this.modalIsVisible = true;
        console.log("CADASTRAR !!!!!");
  
        var operacaoStr = "";
        // 1- CASO CADASTRANDO O AGENTE 
        if ( this.isAddOperacoesPage )  operacaoStr = "cadastrar";
        else operacaoStr = "atualizar";

        var sendData = {
            dados: {
                entidade: 'usoEquipamento',
                operacao: operacaoStr,
                objeto: { }
            }
        }  
        

        for( var i=0; i < vet.length ; i++   )  
        {
          var objAuxStr = JSON.stringify( vet[i] ).replace( /\\/g, "" );
          // console.log( "objAuxStr = " + objAuxStr );
          sendData.dados.objeto = JSON.parse( objAuxStr ); // vet[0]; // JSON.stringify( this.vet[0] ).replace( /\\/g, "" ).replace("id", "id_operacao");
          // this.validaNovaLinha( sendData.dados.objeto );
          // console.log( "objAuxStr = " + objAuxStr );
          
          console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
  
          axios.post(  this.$SERVICES_ENDPOINT_URL , sendData )
                .then( response => {
                       console.log( "Resposta API ==>>> " +  JSON.stringify( response.data ).replace( /\\/g, "" ) );
                       var checkSQLErrorStr = JSON.stringify( response.data ).replace( /\\/g, "" );
                       console.log( "Error? " + checkSQLErrorStr.search("ERROR:") );
                       if ( checkSQLErrorStr.search("ERROR:") != 0 ) 
                       {
                          this.modalMessage = "Erro de conexão: banco de dados.";    
                          this.modalIsVisible = true;
                          console.log( "AKIIIIII !!!!!!! ");
                       }

                       var data = response.data; // -->>> Isso chama o watcher !
                      // console.log("Dados retornados = " +  this.responseData.dados );
                      /*console.log('-DATA ==>>> ' + JSON.stringify(  response.data )  );
                      console.log( "MSSG ==>>> " + data.message + "|| code= " + data.code );*/
  
                      if ( data.code == 0 )   
                      {
                        this.hasSavedOnDatabase = true;
                        this.sendStatusToParent();
                       // console.log( "ID = " + data.data.id );
                        // this.idValue = data.data.id;
                      }
                      this.modalMessage = data.message;
                      this.modalIsVisible = true;
                })
                .catch(error => {
                      this.error = error.message;
                });
          }  // END-FOR
          // this.hasSavedOnDatabase = true;
      }
    }
  };
  </script>
  
  
  
  <style>
  .modal-content      {
      background-color: rgba(0, 0, 0, 0.5); /* Sets the background color with alpha */
  }
  .dados-operacao     {
    width: 100%;
    background-color: rgb(193, 193, 194);
  }
  
  .table-container    {
    margin: 10px;
  }
  
  table.editable-table {
    margin-top: 10px;
    font-size: small;
  }
  
  table.editable-table td {
    vertical-align: middle;
  }
  
  .editable-table .data-cell {
    padding: 8px;
    vertical-align: middle;
  }
  
  .editable-table .custom-checkbox {
    width: 50px;
  }
  
  .remove-icon {
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
      margin-right: 40%;
      margin-left: 40%;
      width: 200px;
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
  overflow: hidden; /* Hides any content that overflows the div */
}

.image-column       {
    flex: 1 1 200px; /* Adjust the width as per your needs */
    text-align: center;
    padding: 10px;
    align-items: flex-start;
    /** Auto-height **/
    height: auto;
    display: inline-block; /* Ensures the div shrinks to fit its content */
    overflow: hidden; /* Hides any content that overflows the div */
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
    padding-left: 40px;
}

.titulo-operacao        {
    color: rgb(5, 76, 104);
    font-size: 15px;
    text-align: center;
    font-weight: bold;
  }
</style>