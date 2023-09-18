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

    <b-container class="bv-example-row" style="background-color: rgb(213, 218, 219);height: 60%;" >
    <b-row>
      <br>
      <br>
      <b-col>
          <div style="position: relative; height: 10vh; width:30vw">
            <canvas id="chartBar"></canvas>
          </div>
      </b-col>
      <b-col>
          <div style="position: relative; height: 10vh; width:20vw">
            <canvas id="chartPie"></canvas>
          </div>
      </b-col>
      <b-col>
          <div style="position: relative; height: 20vh; width:20vw">
            <canvas id="chartLine"></canvas>
          </div>
      </b-col>
    </b-row>
    </b-container>
   

   

</main>
</template>
<script>
import Chart from 'chart.js/auto';
import MyModal from '@/components/MyModal.vue';

// import AppDashboard from '@/components/AppDashboard.vue';
import axios from 'axios';
export default      
{
  name: 'RelatoriosOperacoes',
  components:   {
      MyModal,
      // AppDashboard
    // DisplayOperacoes
  },
  data()        {
      return {
          modalIsVisible: false,
          listaAgentes: [],
      }
  },
  mounted()     {

    const CHART_COLORS = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(95, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)'
    };

    // Chart.defaults.font.family = "Lato";
    // Chart.defaults.font.size = 18;
    Chart.defaults.color = "black";

    // ################################################################
    const dataBar = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgb(01, 128, 255)',
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


    // ################################################################
    const dataPie = {
      labels: [ 'João Pessoa', 'Bayeux', 'Campina Grande', 'Santa Rita' ],
      datasets: [
        {
          label: 'Dataset 1',
          data: [ 22, 19, 3, 5 ],
          backgroundColor: ['rgb(111, 99, 132)',
              'rgb(50, 99, 122)',
              'rgb(200, 59, 132)',
              'rgb(155, 159, 64)', ]
        }
      ]
    };
    const configPie = {
        type: 'pie',
        data: dataPie,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              fontWeight: 'bold',
              text: 'N° Operações por Município'
            }
          }
        },
    };
    const x = document.getElementById('chartPie')
    const chartPie = new Chart( x, configPie );
    chartPie;
    

    // ################################################################
    
    const dataLine = {
    labels: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul' ],
    datasets: [
      {
        label: 'Carro',
        data: ['11', '20', '33', '43', '12', '36', '71'],
        borderColor: CHART_COLORS.orange,
        backgroundColor: CHART_COLORS.orange,
      },
      {
        label: 'Moto',
        data: ['25', '20', '34', '63', '22', '56', '85'],
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.green,
      }
    ]
  };

    const configLine = {
      type: 'line',
      data: dataLine,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'N° de Abordagens por Tipo'
          }
        }
      },
    };
    const chartLine = new Chart( document.getElementById('chartLine'), configLine );
    chartLine;


  },
  created()  
  {   
      /*var isAuth = this.$store.state.isAutenticated;
      console.log( "- Auth? " + isAuth );
      if ( !isAuth )          {
            console.log("indo p login...");
            this.$router.push('/login');
      }*/
      // this.authenticationControl();
      this.getListaAgentes();
      // console.log( "AppHome =>> " + JSON.stringify( this.listaAgentes ) );
  }, 
  computed: {
    LISTA_AGENTES()             {
        return this.$store.state.listaAgentes;
    },
    USER_FIRSTNAME()	  		
		{
			/** var nome = ( this.$store.state.user.nome ).toUpperCase();
			console.log(" --> User Nome = " + nome );
			return nome;**/
			const user = localStorage.getItem('user');
			// console.log( "Load sobrenome ==>> " + JSON.parse(user).sobrenome );
			if ( user )  { return (JSON.parse(user).nome).toUpperCase();
			} 	 else 	 {  return '';  }
		},
		USER_LASTNAME()		  		{
			/** var sobrenome = ( this.$store.state.user.sobrenome ).toUpperCase();
			console.log(" --> Sobrenome = " + sobrenome );
			return sobrenome;**/

			const user = localStorage.getItem('user');
			// console.log( "Load nome ==>> " + JSON.parse(user).nome );
			if (user) {
				return (JSON.parse(user).sobrenome).toUpperCase();
			} else { return ''; }
		},
  },
  methods: {
    showModal()                 {
        this.modalIsVisible = true;
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
                        
                        this.listaAgentes = agentes.data;
                        // console.log( "Aqui 1 >> " + JSON.stringify( this.listaAgentes) );
                        /*for( var i=0; i<this.listaAgentes.length; i++)  {
                             this.agentesLabelBD[i] = this.listaAgentes[ i ].matricula + " - " + this.listaAgentes[ i ].nome;               
                             console.log(  this.agentesLabelBD[i] );
                        }*/
                   } 
            }
            this.$store.commit('setListaAgentes', this.listaAgentes );

            /****
             this.selectOptions = response.data.map(item => ({
              value: item.value,
              text: item.text,
            }));
            ****/
        })
        .catch(error => {
          console.error(error);
        });
    },
  }
}
</script>


<style>
.heading{
  text-align: center;
  margin-top: 50px;
}
.wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
}
.pie-wrap{
  border: 2px solid lightgrey;
  width: 300px;
  height: 300px;
  margin: 10% 50px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  color: black;
}
.pie-wrap .entry{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* the individual entries */
.sky-blue{
  background-color: rgb(135, 206, 250);
  height:50%;
  width: 50%;
  display: block;
}
.light-yellow{
  background-color: lightyellow;
  height:50%;
  width: 50%;
}
.pink{
  background-color: rgb(52, 115, 139);
  height:50%;
  position: absolute;
  top: 0px;
  right: 0;
  width: 50%;
  clip-path: polygon(0 0, 100% 0%, 0% 100%);
}
.purple{
  background-color: purple;
  height:50%;
  width: 50%;
  right: 0;
  top: 0;
  position: absolute;
  clip-path:polygon(0% 100%, 100% 0%, 100% 100%);
}
.green{
  background-color: limegreen;
  height:50%;
  width: 50%;
  right: 0;
  top: 50%;
  position: absolute;
  clip-path:polygon(0% 0%, 100% 0%, 100% 100%);
}
.wheat{
  background-color: wheat;
  height:50%;
  width: 50%;
  right: 0;
  top: 50%;
  position: absolute;
  clip-path:polygon(0% 0%, 100% 100%, 0% 100%);
}

/* the entry text styles */
.pie-wrap .purple p{
  position: absolute;
  top: 140px;
  color: white;
 }
 .pie-wrap .purple p:first-child{
   top: 120px;
 }
 .pie-wrap .green p{
   position: absolute;
   top: 20px;
  }
  .pie-wrap .green p:first-child{
   top: 0px;
 }
  .pie-wrap .pink p, .pie-wrap .wheat p{
   position: absolute;
   left: 20px;
   top: 80px;
  }
 .pie-wrap .pink, .pie-wrap .wheat{
   justify-content: flex-start;
 }
 .pie-wrap .pink p:first-child, .pie-wrap .wheat p:first-child{
   top: 100px;
 }

 /* hide food name and reveal when hovered on */
 .entry .entry-value{
  display: none;
  transition: all 500ms linear;
}
.entry:hover .entry-value{
  display: block;
}
.entry{
  transition: all 500ms linear ;
}
.entry:hover{
  filter: invert();
}

/* label style */
.key-wrap label{
  display: block;
  border: 1px solid;
  width: 100px;
  text-align: center;
  padding: 10px 15px;
  cursor: pointer;
  margin-bottom: 8px;
}
input[type="radio"]{
  display: none;
}

/* background colors for the entry keys */
.rice-label{
  background-color: lightyellow;
}
.beans-label{
  background-color:  rgb(52, 115, 139);
}
.plantain-label{
  background-color: purple;
  color: white;
}
.potato-label{
  background-color: limegreen;
}
.yam-label{
  background-color: wheat;
}
.pasta-label{
  background-color: skyblue;
}

/* the texts displayed below */
.text{
  display: none;
  margin-left: -50px;
  position: absolute;
  margin-top: 50px;
  font-size: 20px;
  padding-bottom: 4px;
  padding-top: 4px;
  border-bottom: 5px solid ;
  border-top: 5px solid ;
}
.key-wrap label:active{
  opacity: .5;
}
.rice-key:checked ~ .rice-text, .beans-key:checked ~ .beans-text, .plantain-key:checked ~ .plantain-text,  .potato-key:checked ~ .potato-text, .yam-key:checked ~ .yam-text, .pasta-key:checked ~ .pasta-text{
 display: block;
}

.rice-text{
  border-color: black;
}
.beans-text{
  border-color:   rgb(52, 115, 139);
}
.plantain-text{
  border-color:  purple;
}
.potato-text{
  border-color:  limegreen;
}
.yam-text{
  border-color:  wheat;
}
.pasta-text{
  border-color:  skyblue;
}


/***---------------- */

</style>
