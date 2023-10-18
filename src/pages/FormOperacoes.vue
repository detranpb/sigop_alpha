<template>
  <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>
 
    <!-- Dados gerais -->
    <div class="btn-container">
         
        <!-- Botao caso isAddOperacoesPage -->
        <b-button v-if="this.isAddOperacoesPage" style="width: 200px" class="fade-in-button btn-add" v-b-toggle.collapse-1 variant="success" @click="openDadosGerais()">
           <i v-if="collapseDadosOperacaoOn" class="fa-solid fa-angle-up"></i>
           <i v-else class="fa-solid fa-angle-down"></i> Dados Gerais
        </b-button>

        <!-- Botao caso consulta historico -->
        <b-button v-else style="width: 200px" class="fade-in-button btn-add" variant="success" @click="openDadosGerais()">
           Dados Gerais
        </b-button>
    </div>

    <b-collapse visible id="collapse-1" class="mt-2" v-model="collapseDadosOperacaoOn"> 
    <b-card>

    <div>
    <b-form inline style="background-color: rgb( 241, 236, 236 );">
            <!-- <b-container class="bv-example-row"> -->
            <b-container>
            <b-row>
                <!-- COL. 1 -->
                <b-col>
                    <label class="titulo-operacao" for="inline-form-input-name"> Nome da Operação: </label>
                    <b-form-input  
                      placeholder="BLITZ-DETRAN-000" :disabled="formDisabled" v-model="dadosGeraisOperacao.nomeOperacao" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0"></b-form-input> 
                </b-col>

                <!-- COL. 2 -->
                <b-col>
                    <label class="titulo-operacao" for="inline-form-input-name"> Matrícula/Responsável: </label>
                  <b-form-input  autocomplete="off" 
                                 list="my-list-id"
                                 placeholder="Insira Matrícula/Responsável"
                                 v-model="agenteResponsavel" @blur="validaAgente" :disabled="formDisabled" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0 custom-input"></b-form-input>
                  <datalist id="my-list-id">
                      <option v-for="a in this.agentesLabelBD" :key="a.nome">{{ a }}</option>
                  </datalist>
                </b-col>
               
                <!-- COL. 3 -->
                <b-col>
                    <label class="titulo-operacao" for="example-datepicker"> Data da Operação: </label>
                    <b-form-datepicker :disabled="formDisabled" id="example-datepicker" v-model="dadosGeraisOperacao.data" class="mb-2"></b-form-datepicker>
                    <!-- <p>Value: '{{ data }}'</p>-->
                </b-col>
          </b-row>

          <b-row>
                <!-- COL. 1 -->
                <b-col>
                    <label class="titulo-operacao"> Município: </label>
                    <b-form-select 
                      class="mb-2 mr-sm-2 mb-sm-0 custom-input form-control"
                      placeholder="ddddd" :disabled="formDisabled" v-model="dadosGeraisOperacao.municipio" :options="municipios"></b-form-select>
                </b-col>

                <!-- COL. 2 -->
                <b-col>
                    <label class="titulo-operacao"> Bairro: </label>
                    <b-form-select 
                      class="mb-2 mr-sm-2 mb-sm-0 custom-input form-control"
                      placeholder="Selecione um bairro."
                      :disabled="formDisabled" v-model="dadosGeraisOperacao.bairro" :options="this.BAIRROS_JP"></b-form-select>
                </b-col>

                <!-- COL. 3 -->
                <b-col>
                    <label class="titulo-operacao" for="inline-form-input-name"> Horário Início: </label><br>
                    <input class="mb-2 mr-sm-2 mb-sm-0 custom-input form-control" type="time" v-model="dadosGeraisOperacao.hraIni" :disabled="formDisabled"/>
                </b-col>
          </b-row>
          
          <br>

          <!-- LINHA II -->
          <b-row>
              <!-- COL. 1 -->
              <b-col v-if="!isAddOperacoesPage">
                <label class="titulo-operacao" for="inline-form-input-name"> Horário Fim: </label><br>
                <!-- <b-form-timepicker v-model="dadosGeraisOperacao.horaFim" :disabled="formDisabled" locale="pt"></b-form-timepicker>-->
                <input class="mb-2 mr-sm-2 mb-sm-0 custom-input form-control" type="time" v-model="dadosGeraisOperacao.hraFim" :disabled="formDisabled"/>
              </b-col> 
              
              <!-- COL. 2 -->
              <b-col>
                  <label class="titulo-operacao" for="inline-form-input-name"> Observações: </label>
                  <b-form-textarea 
                     placeholder="Insira observações necessárias..."
                     id="textarea" v-model="dadosGeraisOperacao.observacoes" :disabled="formDisabled"  rows="3" max-rows="6">
                  </b-form-textarea>
              </b-col>
          </b-row>
          
          <br>
          <b-row> 
                  <!-- Dados gerais -->
                  <div class="btn-container">
                      <b-button 
                        v-if="IS_PAGE_EDITABLE" 
                        :disabled="formDisabled" 
                        class="btn-add"
                        variant="primary" 
                        style="width:200px;" 
                        @click="salvarDadosGerais()">
                            <i class="fa fa-database"></i>
                            {{ salvarBtnName }}
                      </b-button>
                  </div>
          </b-row>

        </b-container>
      </b-form>
    </div>
</b-card>
</b-collapse>

    <!-- 
      <AppAccordion @data-updated="data => handleDataUpdate(data, index)"/> --> <!-- <AppAccordion @data-updated="handleDataUpdate" :idValue="idValue"  /> -->
    <AppAccordion :tables-agentes="dadosOperacoesDetalhes.lista" :idValue="idValue"/>

</main>
</template>

<script> 
import axios from 'axios';
import AppAccordion    from '@/components/AppAccordion.vue';
// ---- import MyModal from '@/components/MyModal.vue'; ---- 
import UtilsMixin from '@/utils/UtilsMixin.js' // ---- SE ASSEMELHA A HERANÇA

const CamposForm =                {
      NOME_OPERACAO: 'Nome Operação',
      MATRICULA_RESPONSAVEL: 'Matricula Responsável',
      DATA: 'Data',
      BAIRRO: 'Bairro', 
      ALL: 'ALL'
};

export default                    { 
  name: 'FormOperacoes',
  mixins: [ UtilsMixin ],
  props: {
      /*** Recebe os dados da busca detalhada do Histórico de Operações (Vem do comp. Pai HistoricoOperacoes.vue) ***/
      dadosOperacoes:Object
  },
  components: 
  {
    //MyModal,
    AppAccordion
  },
  mounted()     /** --------------- FOR DEBUG ----------- **/  
  {
      document.addEventListener( 'keydown', this.myFunction );
  }, 
  computed: 
  { 
      // ----- CONSTANTE ----- 
      IS_PAGE_EDITABLE()                    {
          // console.log( "->> FORM OPERACOES = " + this.$store.state.isPageEditable );
          // this.formDisabled = this.$store.state.isPageEditable;
          return this.$store.state.isPageEditable;
      },
      MATRICULAS_VALIDAS()                  {
          return this.$store.state.matriculasValidas;
      },
      BAIRROS_JP()                          {
          return this.$store.state.bairrosJP;
      },
      LISTA_EQUIPAMENTOS_SELECIONADOS()     {
            return this.$store.state.equipsSelecionadosIDs;
      },
      getAgenteKey( agente )                {
          return agente.nome + ' - ' + agente.id;
      }
  },
  created() 
  {
        // ---- console.log( JSON.stringify( this.BAIRROS_JP ) ); ---- 
        // ---- this.authenticationControl(); ---- 
        this.getListaAgentes();

        if ( this.$route.name == "addOperacoes" )  {
             this.isAddOperacoesPage = true;
        }    else    {
             this.isAddOperacoesPage = false;
             this.salvarBtnName = "Atualizar Operação";
        }
        //console.log( "-FormOperacoes || isAddOperacoes? " + this.isAddOperacoesPage );
        this.$store.commit( 'setIsPageEditable', this.isAddOperacoesPage );
        //var str = this.$store.state.isPageEditable;
        //console.log( "AppEquipamentosGRID | isPageEditable ? " + str );
        /**** Acessando nome de parente
        const parentComponent = this.$parent;
        if ( parentComponent ) {
            var nome = parentComponent.$options.name;
        } ****/
      /// console.log( "CREATED FORM ||| store = " + this.$store.state.isPageEditable );
      // this.$store.commit('setIsPageEditable', false );
      this.formDisabled = !this.IS_PAGE_EDITABLE;
  },
  watch:        {
    
    // -- Chamado em Histórico Operações, quando o usuário selectiona na tabela, para detalhar os dados
    dadosOperacoes( newVal ) 
    {
        this.dadosOperacoesDetalhes = newVal;
        console.log( "--xxx FormOperacoes || dados ==>> " + JSON.stringify( this.dadosOperacoesDetalhes ).replace( /\\/g, "" ) );
        //console.log(" === ");
        this.setDadosGerais( this.dadosOperacoesDetalhes.dadosOperacao );
        // console.log( "--FORM || DADOS LISTA ==>> " + JSON.stringify( this.dadosOperacoesDetalhes.lista ).replace( /\\/g, "" ) );
    },
    responseData :   
    {
        handler( newObj )   
        {
          const munVet = Object.values( newObj.dados );
          // console.log( munVet );

          // CASO API CONSUMIDA FOI ...
          for ( let i = 1; i < munVet.length; i++ ) 
                this.municipios.push( munVet[i] );
        },
        deep:true,
    },
  },
  data() 
  {
    return                      {
      
      collapseDadosOperacaoOn: true,
      formDisabled: false,
      agentesLabelBD: [],  /* Vetor de strings matricula - nome */
      agentesBD: [],       /* Vetor de objetos do tipo { nome, matricula }   
      /*** ====== MODO DE USO - CONSULTA ====== ***/
      idValue: null,
      salvarBtnName: "Salvar Operação",
      responseData:             {
         cod_status: null,
         mensagem: null,
         dados:null
      },
      isAddOperacoesPage: -1,
      /* Recebe os dados da busca detalhada do Histórico de Operações (Vem do comp. Pai HistoricoOperacoes.vue)**/
      dadosOperacoesDetalhes :  {
         dadosOperacao : "",
         lista: []
      },
      /*modalIsVisible: false, 
      modalMessage: "Você tem certeza?",*/
      dadosGeraisOperacao : 
      {
          nomeOperacao: "",
          data: '00-00-0000',
          bairro: null,
          kmIni: '0.0',
          kmFim: '0.0',
          matriculaResponsavel: "00000",
          hraIni: null,
          hraFim: null,
          municipio: null,
          observacoes: ""
      },
      municipios: [
          { value: 1, text: 'João Pessoa' },
          { value: 2, text: 'Cabedelo' },
          { value: 3, text: 'Bayeux'   },
          { value: 4, text: 'Santa Rita' },
          { value: 5, text: 'Campina Grande' },
          { value: 6, text: 'Outro' },
      ],
      bairros: [
          { value: null, text: 'Selecione um bairro.' },
          { value: 1, text: 'Miramar' },
          { value: 2, text: 'Bessa'   },
          { value: 2, text: 'Manaira' },
      ],
      agenteResponsavel: "",
      agentes: [ { value: 1, text: 'Agente 1' },
                 { value: 2, text: 'Agente 2' },
                 { value: 2, text: 'Agente 3' },
                 { value: 2, text: 'Agente 4' },
                 { value: 2, text: 'Agente 5' },
                 { value: 2, text: 'Agente 6' },
                 { value: 2, text: 'Agente 7' },
                 { value: 2, text: 'Agente 8' } ]
  }
}, 
 methods:  {
   /* handleDataUpdate( updatedData  )    
    {
        // const equipamentosPorAgente = updatedData.equipamentosPorAgente;
        // console.log( "X[ " + this.ID + "] = " + updatedData );
        // console.log( "FormOperacoes[0] = " + updatedData.usuMatricula + " || " + equipamentosPorAgente[0] );
    },*/
    close()                                      {
        console.log( "--- CLOSE !!!!! " );
        this.$refs.collapse.close();
    },
    myFunction( event )                          {
        // ----- BARRA DE SPAÇO ----- 
        if ( ( event.keyCode == 32 ) && 
             ( process.env.NODE_ENV === 'development' ) )   {
                  this.salvarDadosGerais( true );
            }
    }, 
    setFormEditable()     {
        this.formDisabled = this.IS_PAGE_EDITABLE;
    },
    handleCloseModal()    {
        this.modalIsVisible = false;
    },
    handleAcceptModal()   {
          this.modalIsVisible = false;
    },
    handleRejectModal()   {
          this.modalIsVisible = false;
    },
    validaAgente()
    {
      // console.log("Valida agente!! " + this.agenteResponsavel );
      const userInput = this.agenteResponsavel;         
      const isValid = this.agentesLabelBD.some(a => a === userInput );
      // console.log( "Teste = " + isValid  + "|" + userInput );
      
      if ( !isValid ) 
      {
          /*this.modalIsVisible = true;
          this.modalMessage = "Matrícula/Responsável inválida.";*/
          this.showModal( "Matrícula/Responsável inválida.");
          this.agenteResponsavel = "";
      } else {
          this.dadosGeraisOperacao.matriculaResponsavel = this.agenteResponsavel.split(" - ")[0];
          // console.log( "-Matricula = " + this.dadosGeraisOperacao.matriculaResponsavel );
      }
    },
    getListaAgentes() 
    {
      var sendData =  {
          dados: {
              entidade: 'agente',
              operacao: 'consultar'
          }
      };
      // console.log( "SEND >>> " + JSON.stringify( sendData ));
      axios.post( this.$SERVICES_ENDPOINT_URL, sendData )
        .then( response => {
          
            // Assuming the response data is an array of objects with 'value' and 'text' properties
            // console.log( "DATA >>> " + JSON.stringify( response.data ) );

            if ( ( typeof response.data ) == 'object' )  {
                   var agentes = response.data;
                   /* console.log('-DATA == ' + JSON.stringify(  data )  );
                   /* console.log( "MSG = " + data.message + "|| code= " + data.code );*/
                   if ( agentes.code == 0 )  {
                        
                        this.agentesBD = agentes.data;
                        for( var i=0; i<this.agentesBD.length; i++)  {
                             this.agentesLabelBD[i] = this.agentesBD[ i ].matricula + " - " + this.agentesBD[ i ].nome;               
                             // console.log(  this.agentesLabelBD[i] );
                        }
                   } 
            }

            /****
             this.selectOptions = response.data.map(item => ({
              value: item.value,
              text: item.text,
            }));**/
           
        })
        .catch(error => {
          console.error(error);
        });
    }, 
    /* Este método também é chamado em setFormEditable() dentro do componente HistoricoOperacoes.vue*/
    toggleFormDisabled()       {
      this.formDisabled = !this.formDisabled;
    },

    /* FUNÇÃO USADA PELO COMPONENTE HistoricoOperacoes */
    setDadosGerais( obj )      {

        // console.log( "-- FormOperacoes || SET-DADOS ==>> " + JSON.stringify( obj ).replace( /\\/g, "" ) + "ID => " + this.idValue );
        this.idValue = obj.id;
        // console.log( "this.idValue ==>> " + this.idValue );
        this.dadosGeraisOperacao.bairro               = obj.bairro;        
        this.dadosGeraisOperacao.data                 = obj.data;          
        this.dadosGeraisOperacao.nomeOperacao         = this.replaceSubstrings( obj.nomeOperacao );  
        this.dadosGeraisOperacao.matriculaResponsavel = obj.matriculaResponsavel; 
        this.dadosGeraisOperacao.observacoes          = obj.observacoes;
        this.dadosGeraisOperacao.kmIni                = obj.kmIni;
        this.dadosGeraisOperacao.hraFim               = obj.hraFim;
        this.dadosGeraisOperacao.hraIni               = obj.hraIni;
        this.dadosGeraisOperacao.kmFim                = obj.kmFim;
        this.dadosGeraisOperacao.municipio            = obj.municipio;
    },
    
    validaDadosGerais( camposForm, isDebug = false )
    {
      if ( isDebug )
           return true;
      /**var dataOperacao = this.convertUSToBRDate( this.dadosGeraisOperacao.data );
      if ( this.isAddOperacoesPage )           
      {   
           if ( this.DATA_ATUAL != dataOperacao )        {
                /** this.modalIsVisible = true;
                this.modalMessage = "Data da operação diferente da data atual."; 
                this.showModal( "Data da operação diferente da data atual." );
                return false;
           } 
      }**/
      if ( camposForm.includes( CamposForm.ALL ) )  
      {
          // console.log( "VALID = " + JSON.stringify( this.dadosGeraisOperacao ) );
          if ( ( this.dadosGeraisOperacao.nomeOperacao.length <= 5 ) || 
               ( this.dadosGeraisOperacao.nomeOperacao == "Insira nome" ) ) 
               {
                /* this.modalIsVisible = true;
                   this.modalMessage = "Nome operação inválido ou muito curto.";*/
                this.showModal( "Nome operação inválido ou muito curto." );
                return false;
                }
      }
      if ( camposForm.includes( CamposForm.ALL ) )  
      {
          if ( ( this.agenteResponsavel == null ) || ( this.agenteResponsavel.length <= 10 ) )
          {
                /* this.modalIsVisible = true;
                this.modalMessage = "Matrícula/Responsável inválida."; */
                this.showModal( "Matrícula/Responsável inválida." );
                return false;
          } else {
              this.dadosGeraisOperacao.matriculaResponsavel = this.agenteResponsavel.split(" - ")[0];
              // console.log( "-Matricula = " + this.dadosGeraisOperacao.matriculaResponsavel );
          }
      }
      if ( camposForm.includes( CamposForm.ALL ) )  
      {
        if ( this.dadosGeraisOperacao.data   == "00-00-0000" )          {
             /*this.modalIsVisible = true;
             this.modalMessage = "Data da operação não informada.";*/
             this.showModal( "Data da operação não informada." );
             return false;
        }
      }
      if ( this.dadosGeraisOperacao.bairro == null  )             {
           /* this.modalIsVisible = true;  || this.modalMessage = "Bairro não informada."; */
           this.showModal( "Bairro não informada." );
           return false;
      }       
      if ( this.dadosGeraisOperacao.hraIni == null )              {
           /**this.modalIsVisible = true;  || this.modalMessage = "Hora inicial não informada.";*/
           this.showModal( "Hora inicial não informada." );
           return false;
      }
      if ( !this.isAddOperacoesPage )   
      {
           if ( this.dadosGeraisOperacao.hraFim == null )        {
                /***
                 * this.modalIsVisible = true;
                 * this.modalMessage = "Hora final não informada.";
                 ***/
                this.showModal( "Hora final não informada." );
                return false;
           }
      }
      if ( this.dadosGeraisOperacao.municipio == null )     {
           /** this.modalIsVisible = true;
            ** this.modalMessage = "Município não informado."; **/
           this.showModal( "Município não informado." );
           return false;
      }
      return true;
    },
    onInput()   
    {
      this.$refs.input.style.color = 'red';
    },
    salvarDadosGerais()
    { 
      var isValid = false;
      // if ( !isDebug )
      var isDebug = false;                   
      isValid = ( this.validaDadosGerais( [ CamposForm.ALL ], isDebug  ) );
      // console.log( "- isValid = " + isValid + " ||| " + process.env.NODE_ENV );

      if ( !isValid )
            return false;

      var   sendData = {
            dados: {
                entidade: 'operacao',
                operacao: ( this.isAddOperacoesPage == true) ? 'cadastrar' : 'atualizar',
                objeto: null,
            }
       };

       // let jsonData = JSON.stringify( this.dadosGeraisOperacao ).replace( /\\/g, "" );
       // console.log( "-->> jsonData = " + jsonData ); 
       if ( this.agenteResponsavel != null )
            this.dadosGeraisOperacao.matriculaResponsavel = this.agenteResponsavel.split(" - ")[0];

       sendData.dados.objeto = this.dadosGeraisOperacao;

       /* Caso esteja na pag. de Busca de Operações, setar o campo ID, p/ atualizar */
       if ( this.isAddOperacoesPage == false ) 
            sendData.dados.objeto.id = this.idValue;

        // console.log( "-- SALVAR ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        
        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
             .then( response => {
 
              if ( ( typeof response.data ) == 'object' )  {
                    var data = response.data;
                    /* console.log('-DATA == ' + JSON.stringify(  data )  );
                    console.log( "MSG = " + data.message + "|| code= " + data.code );**/

                    if ( data.code == 0 )   
                    {
                        // console.log( "ID = " + data.data.id );
                        this.idValue = data.data.id;
                         
                        /*** Fecha automaticamente o collapse, caso esteja na página de adicionar ***/
                        if ( this.isAddOperacoesPage )
                             this.collapseDadosOperacaoOn = false;

                        if ( this.isAddOperacoesPage )
                             this.showModal( "Operação salva com sucesso! (ID = " + this.idValue + ")" );
                        else 
                             this.showModal( "Operação atualizada com sucesso! (ID = " + this.idValue + ")" );

                         /***** if ( this.isAddOperacoesPage )  {
                                setTimeout( () => {
                                    this.showModal( "Adicione a lista de Agentes/Equipamentos." );
                                    // tempo++; }, 2000 ); }*****/
                         
                    }    else   {
                         this.showModal( response.data.message );
                    }
              }          
            })
            .catch(error => {
              this.error = error.message;
            });

            if (  this.isAddOperacoesPage  )
                  this.toggleFormDisabled();
    },
    cadastrarBD()   
    {
    },
    openDadosGerais()
    {
      if ( this.IS_PAGE_EDITABLE )
           this.getMunicipios();
           
           // console.log("oi");
           // var x = " ";
    },
    getMunicipios()               {
          const sendData = {
            dados: { 
              entidade: 'municipios',
              operacao: 'consultar',
              objeto: { 
                id: '1'
              }
            }
          };
          // {"dados":{"entidade":"municipios","operacao":"consultar","objeto":{"id":"1"}}}
          // console.log("sending = " + JSON.stringify( sendData , null, 2) );

          axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
            .then(response => {
              // console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
              this.responseData = response.data; // -->>> Isso chama o watcher !
              // console.log("Dados retornados = " +  this.responseData.dados );
            })
            .catch(error => {
              this.error = error.message;
            });
        }
    }
  }
</script>

<style>
.dados-operacao            {
    width: 100%;
    background-color: rgb(241, 236, 236);
}
.table-container           {
    margin: 10px;
}
table.editable-table            {
    margin-top: 10px;
    font-size: small;
}
table.editable-table td         {
    vertical-align: middle;
}
.editable-table .data-cell      {
    padding: 8px;
    vertical-align: middle;
}

.editable-table .custom-checkbox {
    width: 50px;
}

.remove-icon      {
    color: red;
    cursor: pointer;
    font-size: 20px;
}

.edit-icon        {
    color: rgb(4, 83, 158);
    cursor: pointer;
    font-size: 20px;
}

.name-col          {
  width: 120px;
}

.department-col    {
  width: 150px;
}

.age-col           {
  width: 100px;
}

.date-col          {
  width: 200px;
}

.is-active-col     {
  width: 100px;
}

.table-centralizer    {
  display: flex;
  justify-content: center; 
  align-items: center;
}
.btn-add              {
    margin-top: 20px;
} 
.titulo-operacao      {
    color: rgb(4, 64, 104);
    font-size: 15px;
    font-weight: bold;
}
.legenda-tabela            {
    color: rgb(5, 76, 104);
    font-size: 14px;
    font-weight: bold;
    content: "";
    padding-left: 5%;
}
 
.km-label                  {
    font-size: 12px; 
    font-weight: bold; 
    color: rgb(0, 0, 0); 
}

.fade-in-button             {
    background-color: #9cb8dd;
    color: white;
    border: none;
    padding: 10px 20px;
    transition: background-color 0.5s ease-in-out;
}

.fade-in-button:hover {
    background-color: #6c8ebf;
}
.custom-input   {
    width: 300px; /* Set the desired width */
}
.offset         {
    margin-right: -600px;
}
.btn-container  {
    display: flex;
    justify-content: center;
}
.inputInit      {
   color: lightblue;
}
</style>