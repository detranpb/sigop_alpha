<template>
    <main >
      <!-- <b-button @click="showModal()">Show Modal</b-button>-->
      <my-modal id="myModal" title="Confirmation" message="Are you sure?" :visible="modalIsVisible" @update:visible="modalIsVisible = $event" />
      <br>
      <br>
      <h3 class="card-title text-center titulo-paginas" style="font-size: 20px;"> Seja Bem-Vindo {{ USER_FIRSTNAME }} {{ USER_LASTNAME  }} </h3>
      <!-- <DisplayOperacoes/> -->
      <!-- <AppDashboard></AppDashboard> -->
      <br>
      <br>

      TESTE - TESTE - TESTE -TESTE ??
  
      <AppHomeMobile v-if="this.$IS_MOBILE_APP"></AppHomeMobile>
      <b-container v-if="!this.$IS_MOBILE_APP" class="bv-example-row" style="background-color: rgb(213, 218, 219);height: 60%;" >
      <b-row>
        <br>
        <br>
        <b-col>
            <div style="position: relative; height: 10vh; width:30vw">
              <canvas id="chartBar"></canvas>
            </div>
        </b-col>
      </b-row>
      </b-container>
  </main>
  </template>
  <script>
  import Chart from 'chart.js/auto';
  import MyModal from '@/components/MyModal.vue';
  import AppHomeMobile from '@/pages/AppHomeMobile.vue';
   // import AppDashboard from '@/components/AppDashboard.vue';
  import axios from 'axios';
  export default      
  {
    name: 'AppHistogram',
    components:                {
        MyModal,
        AppHomeMobile 
    },
    data()              {
        return {
            btnServicoName: "Cadastrar Relatório",
            tipoServico: "",
            modalIsVisible: false,
            modalMessage:"",
            estatisticas:         
            { 
                abordagensCarros: 0, 
                abordagensMotos:  0, 
                abordagensCiclomotor: 0,
                abordagensTestesBafometro: 0,
                /*remocoesCarros: 0,
                remocoesMotos:  0,
                remocoesCiclomotor: 0,
                remocoesOutros: 0,
                numInfracoes:   0,
                numRecusasComEmbriaguez: 0,
                numRecusasSemEmbriaguez: 0,
                numAlcoolIntervaloUm:    0,
                numAlcoolIntervaloDois:  0,
                idOperacao: 0**/
            },
            dadosEstatisticas:[],
            msgModalIsVisible: false,
            rotulos: [ 'Carros', 'Motos', 'Ciclomotor', 'Bafômetro' ],
        }
    },
    mounted()       
    {
      this.consultaRelatorio();
      /* if ( this.$IS_MOBILE_APP ) { this.$router.push({ path:'/add-relatorio-operacao', replace:true }); }*/
      /* const CHART_COLORS       =    {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(95, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
      };*/
  
      // Chart.defaults.font.family = "Lato";
      // Chart.defaults.font.size = 18;
      Chart.defaults.color = "black";
      
  
      // ################################################################
      const dataBar = {
          labels: this.rotulos,
          datasets: [
            {
              data: this.dadosEstatisticas,
              backgroundColor: [
                'rgb(01, 128, 1)',
                'rgb(50, 99, 122)',
                'rgb(200, 59, 132)',
                'rgb(155, 159, 64)',
                'rgb(51, 204, 89)',
                'rgb(51, 67, 70)',
              ],
              borderWidth: 1
            }
        ]
      };
      const configBar = {
          type: 'bar',
          data: dataBar,
          options: {
             scales: {
                y: {  beginAtZero: true }
             },
             responsive: true,
             plugins: {
                title: {
                  display: true,
                  fontWeight: 'bold',
                  text: 'N° Operações por Município'
                }
            }
          }
      };
      const chartBar = new Chart( document.getElementById('chartBar'), configBar );
      chartBar;
     
  
    }, 
   
    methods:                        {
        
        consultaRelatorio()                       
        {
            var sendData =    {
                dados:  {
                    entidade: 'estatisticasOperacao',
                    operacao: 'consultar',
                    objeto: { 
                        idOperacao: 2134,
                    }
                }
            };
            /** ** ** alert( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) ); ** ** **/
            console.log( "-- Send OBJETO XX ==>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) ); 
            
            axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
                 .then( response   =>   {
                        var responseStr = JSON.stringify( response.data ).replace( /\\/g, "" ).replace( /(^"|"$)/g, '' );
                        console.log( "Response JSON aaa ===>>> " + responseStr + "||" + typeof responseStr );
                        var dados = this.fixAndParseJSON( responseStr );
                        console.log( typeof dados + " || " + JSON.stringify(dados) ); 
                        alert( " -->> AQUI : " + dados.code );

                        // ==== ==== ==== CASO SUCESSO ==== ==== ==== 
                        if ( dados.code == 0 )               { 
                            alert( "-->>>" + JSON.stringify( dados.data ) );
                            this.estatisticas = dados.data;
                            this.showModal( "Estatísticas carregadas com sucesso." );
                            alert( "ESTATS = " + JSON.stringify( this.estatisticas ) );
                            for (const prop in this.estatisticas) 
                                 this.dadosEstatisticas.push( this.estatisticas[prop] );
                        }  else  {
                            this.tipoServico = "cadastrar";
                            this.btnServicoName = "Cadastrar Relatório";
                        }
                        console.log( JSON.stringify( this.estatisticas ) );
                        console.log( this.estatisticas.abordagensCarros  );
                        console.log( this.estatisticas.abordagensCiclomotor );
            })
            .catch(error => {
                this.error = error.message;
            });
        }, 
       
    }
  }
  </script>
 
