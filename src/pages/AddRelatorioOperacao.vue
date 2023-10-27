<template>
<main>

    <h4 style="margin: 15px;padding-top: 15px;" class="card-title text-center titulo-paginas"> Cadastro de Estatísticas de Operação </h4> 

    <!-- <ConsultaOperacoes
    @data-updated="index => handleOperacaoSelected( index )" 
    ></ConsultaOperacoes>-->

    <ConsultaOperacoes
          @table-updated="rowData => handleOperacaoSelected( rowData )" 
          @nova-consulta="data => handleNovaConsulta(data)"/>
     
    <!--<my-modal id="myModal" title="Confirmação" :message="modalMessage" 
          :visible="msgModalIsVisible"
          @update:visible="modalIsVisible = $event"
          @on-close-modal="onMsgModalClose()" >
    </my-modal>-->
    <b-modal title="Estatísticas Finais da Operação" centered style="width:100%; height: 100%;" v-model="modalIsVisible" @hide="onModalClose" hide-footer>
    
    <b-form ref="form" >
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-1 variant="info"> Abordagens </b-button>
        </b-card-header>

        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <div class="container"> 
              <b-form-group label="Carros: ">
                   <b-form-input id="usuario" type="number" v-model="estatisticas.abordagensCarros"> </b-form-input>
              </b-form-group>

              <b-form-group label="Motos: ">
                   <b-form-input id="matricula" type="number"  v-model="estatisticas.abordagensMotos"></b-form-input>
              </b-form-group>

              <b-form-group label="Ciclomotor: ">
                   <b-form-input id="cpf" type="number" placeholder="Digite seu CPF" v-model="estatisticas.abordagensCiclomotor"></b-form-input>
              </b-form-group>

              <b-form-group label="N° de Infrações: ">
                    <b-form-input type="number" v-model="estatisticas.numInfracoes"></b-form-input>
              </b-form-group>
          </div>
        </b-collapse>
      </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-2 variant="info"> Remoções </b-button>
      </b-card-header>

      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
        <div class="container">  
            <b-form-group label="Carros: ">
              <b-form-input type="number" v-model="estatisticas.remocoesCarros"></b-form-input>
            </b-form-group>

            <b-form-group label="Motos: ">
              <b-form-input type="number"  v-model="estatisticas.remocoesMotos"></b-form-input>
            </b-form-group> 

            <b-form-group label="Ciclomotor: ">
              <b-form-input type="number"   v-model="estatisticas.remocoesCiclomotor"></b-form-input>
            </b-form-group>

            <b-form-group label="Outros: ">
              <b-form-input type="number"   v-model="estatisticas.remocoesOutros"></b-form-input>
            </b-form-group>
         </div>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-3 variant="info"> Testes de Alcoolemia </b-button>
      </b-card-header>
      <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
        
        <div class="container">  
        <b-form-group label-for="senha">
             <label class="d-flex justify-content-between"> Recusas Com Sinal de Embriaguez: </label>
              <b-form-input type="number" v-model="estatisticas.numRecusasComEmbriaguez"></b-form-input>
              </b-form-group>

              <b-form-group label-for="senha">
                  <label class="d-flex justify-content-between"> Recusas Sem Sinal de Embriaguez: </label>
                  <b-form-input type="number" v-model="estatisticas.numRecusasSemEmbriaguez"></b-form-input>
              </b-form-group> 
 
              <b-form-group label-for="senha">
                  <label class="d-flex justify-content-between"> Embriaguez Não-Detectada (0,05 - 0,33 ml/L): </label>
                  <b-form-input type="number" v-model="estatisticas.numAlcoolIntervaloUm"></b-form-input>
              </b-form-group>

              <b-form-group label-for="senha">
                  <label class="d-flex justify-content-between"> Embriaguez Detectada (0,34 - 3,00 ml/L): </label>
                  <b-form-input type="number" v-model="estatisticas.numAlcoolIntervaloDois"></b-form-input>
              </b-form-group> 
            </div>
      </b-collapse>
    </b-card>
  </div> 
    
    <b-button
       type="button" variant="primary" block  width="100px" @click="enviarRelatorio()">
       <i class="fas fa-sign-in-alt"></i> {{ this.btnServicoName }}
    </b-button>
</b-form>

</b-modal>

</main>
</template>

<script>
import UtilsMixin        from '@/utils/UtilsMixin.js' // ------ SE ASSEMELHA A HERANÇA ------ 
import ConsultaOperacoes from '@/components/ConsultaOperacoes.vue';
import { BButton }       from "bootstrap-vue";
import axios from 'axios';
export default            {
    mixins: [UtilsMixin],
    name: 'AddRelatorioOperacao',
    components:     {
        // MyModal,
        BButton,
        ConsultaOperacoes,
    },  
    methods: { 
        
        onModalClose()                  {
            this.modalIsVisible = false; 
        },
        onMsgModalClose()               {
            this.msgModalIsVisible = false; 
        },
        handleOperacaoSelected( rowData )         
        { 
          //console.log( "-DATA = " + JSON.stringify( rowData ) );
          this.estatisticas.idOperacao = rowData.id;
          this.consultaRelatorio();
          /*var matriculaLogado = parseInt( this.$store.state.user.matricula );
          var isValidationOn = ( ( matriculaLogado != 555 ) &&   // Libera TESTE
                                 ( matriculaLogado != 22900 ) ); // Libera Marcelo
 
          if ( isValidationOn )     {
                 if ( rowData.matriculaResponsavel != matriculaLogado )       {
                      this.showModal("Acesso Restrito! Apenas o Agente Responsável pela operação pode lançar as estatísticas.");
                      return;
                 }
          }*/

          if ( rowData != undefined )
               this.modalIsVisible = true;
        },
        validaEstatisticas()                      {
              return Object.values( this.estatisticas ).filter( v => v > 0 ).length / 
                     Object.keys( this.estatisticas ).length >= 0.2;
        },
        fixAndParseJSON( jsonString )             {
          // Remove the extra double quotes within the "data" property
          jsonString = jsonString.replace(/"data":"(.*?)"/g, (match, dataValue) => {
            return `"data":${dataValue}`;
          });

          try {
            // Parse the corrected JSON string into a JavaScript object
            const jsonObject = JSON.parse(jsonString);
            return jsonObject;
          } catch (error) {
           // console.error('Error parsing JSON:', error);
            return null;
          }
        },
        consultaRelatorio()                       {

          this.estatisticas.abordagensCarros = 0; 
          this.estatisticas.abordagensMotos =  0; 
          this.estatisticas.abordagensCiclomotor = 0;
          this.estatisticas.abordagensTestesBafometro = 0;
          this.estatisticas.remocoesCarros = 0;
          this.estatisticas.remocoesMotos =  0;
          this.estatisticas.remocoesCiclomotor = 0;
          this.estatisticas.remocoesOutros = 0;
          this.estatisticas.numInfracoes =   0;
          this.estatisticas.numRecusasComEmbriaguez = 0;
          this.estatisticas.numRecusasSemEmbriaguez = 0;
          this.estatisticas.numAlcoolIntervaloUm =    0;
          this.estatisticas.numAlcoolIntervaloDois =  0;

         

          var sendData =    {
                dados:  {
                    entidade: 'estatisticasOperacao',
                    operacao: 'consultar',
                    objeto: { 
                      idOperacao: this.estatisticas.idOperacao,
                    }
                }
            };
            /** ** ** alert( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) ); ** ** 
            console.log( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) ); **/
            
            axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
            .then( response   =>   {

                   var responseStr = JSON.stringify( response.data ).replace( /\\/g, "" ).replace( /(^"|"$)/g, '' );
                   //console.log( "Response JSON aaa ===>>> " + responseStr + "||" + typeof responseStr );
                   var dados = this.fixAndParseJSON( responseStr );
                  // console.log( typeof dados + " || " + JSON.stringify(dados) );
                   
                   // alert( " -->> AQUI : " + dados.code );

                   // ==== ==== ==== CASO SUCESSO => EXISTE RELATORIO PREVIO ==== ==== ==== 
                   if ( dados.code == 0 )               { 
                        // alert( "-->>>" + JSON.stringify( dados.data ) );
                        this.estatisticas = dados.data;
                        this.showModal( "Estatísticas carregadas com sucesso." );
                        this.tipoServico = "atualizar";
                        this.btnServicoName = "Atualizar Relatório";
                   }  else  {
                        this.tipoServico = "cadastrar";
                        this.btnServicoName = "Cadastrar Relatório";
                   }
                   /*console.log( JSON.stringify( this.estatisticas ) );
                   console.log( this.estatisticas.abordagensCarros  );
                   console.log( this.estatisticas.abordagensCiclomotor );*/
            })
            .catch(error => {
              this.error = error.message;
            });
        }, 
        enviarRelatorio()                    {

            // alert("oi!!1");

            /*if ( !this.validaEstatisticas() )  {
                  //this.msgModalIsVisible = true;
                  //this.$root.$emit( "showModal", "Atenção, verificar quantitativos nulos." );
                  this.showModal("Atenção, verificar quantitativos nulos." );
                  return;
            } */
            
            var sendData = {
                dados: {
                  entidade: 'estatisticasOperacao',
                  operacao: this.tipoServico,
                  objeto: this.estatisticas,
                }
            };
            
            /** alert( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );**/
            // console.log( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
            axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
                 .then( response => {
                  //var responseStr = JSON.stringify( response.data ).replace( /\\/g, "" );  
                  //console.log( "Response JSON ===>>> " + responseStr + response.data + " - " + typeof response.data );
                  if ( ( typeof response.data ) == 'object' )  
                  {
                        var data = response.data;
                        if ( data.code == 0 )      {
                             /* this.msgModalIsVisible = true;
                             this.modalMessage = response.data.message; */
                             this.showModal( response.data.message );
                        }    else    {
                             this.showModal( response.data.message );
                        }
                    }
            } )
            .catch( error => {
               this.error = error.message;
            } );
     }
    },
    data()                        
    {
        return      { 
            btnServicoName: "Cadastrar Relatório",
            tipoServico: "",

            modalIsVisible: false,
            modalMessage:"",
            estatisticas:             { 
                abordagensCarros: 0, 
                abordagensMotos:  0, 
                abordagensCiclomotor: 0,
                abordagensTestesBafometro: 0,
                remocoesCarros: 0,
                remocoesMotos:  0,
                remocoesCiclomotor: 0,
                remocoesOutros: 0,
                numInfracoes:   0,
                numRecusasComEmbriaguez: 0,
                numRecusasSemEmbriaguez: 0,
                numAlcoolIntervaloUm:    0,
                numAlcoolIntervaloDois:  0,
                idOperacao: 0
            },
            msgModalIsVisible: false,
        }
    }
} 
</script>
<style>
/* .container { width: 90%; } */
.modal-title         {
    font-size: 15px;
    font-weight: bold;
    display: flex;
    justify-content: center;
}
</style>