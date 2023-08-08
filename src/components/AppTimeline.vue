<template>
<main>
    
    <h4 style="margin: 15px;" class="card-title text-center titulo-paginas"> Histórico de Operações </h4> 

    <div class="container-historico">
            <div id="FILTROS_ID" style="margin-top: 10px;">
              <b-dropdown text="Filtros de Consulta" class="m-md-2">
                  <b-dropdown-item @click="selecionaFiltro('matricula')"> Agente/Matrícula </b-dropdown-item>
                  <b-dropdown-item @click="selecionaFiltro('equipamento') "> Equipamento </b-dropdown-item>
              </b-dropdown>
            </div>
            <div id="EQUIPAMENTO"   class="elementos-busca" v-if="( filtroSelecionado=='equipamento' )">
                <label class="label"><b> Equipamento: </b></label>
                <b-form-input type="number" style="width:100px;" autocomplete="off" v-model="filtrosValues.id" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0 custom-input"></b-form-input>
            </div>

            <div id="AGENTE" class="elementos-busca" v-if="( filtroSelecionado=='matricula' )">
              <div>
                <label class="label" for="example-datepicker"><b> Agente/Matrícula: </b></label>
                <b-form-input type="number" style="width:100px;" autocomplete="off" v-model="filtrosValues.matricula" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0 custom-input"></b-form-input>
              </div>
            </div>

            <div id="BTN_BUSCAR_OPERACOES_ID" class="elementos-busca" 
            v-if="( ( filtroSelecionado == 'matricula' ) || ( filtroSelecionado == 'equipamento' ) )">           
                <b-button style="margin-top: 18px;"  class="float-right" @click="buscarOperacoes()">
                        <i class="fa fa-search"></i> Listar Histórico
                </b-button>
            </div>
      </div>


    <div class="centro">
        <img class="imagem" :src="getImageUrl()" alt="Image" >
    </div>
    <div class="idEquipamento">
        <label>  QFJ8080 </label>
    </div>

    <div class="timeline">
        <div v-for="event in events" :key="event.id" class="timeline-event">
            <div class="dot" @mouseover="showTooltip(event)" @mouseleave="hideTooltip"></div>
            <div class="tooltip" v-if="event === activeEvent">{{ event.label }}</div>
            <p><label class="data"> {{ event.data }} </label></p>
        </div>
        <div class="line timeline-event"></div>
    </div>
</main>
</template>
 
<script>
  export default {
    data() {
      return {
        filtroSelecionado: '',
        filtrosValues :      {
           dataOp : "2023-01-01",
           equipamento: "1",
           matricula: null,
        },
        events: [
          { id: 1, label: '42731', data: '01-01-2023' },
          { id: 2, label: '42312', data: '15-01-2023' },
          { id: 3, label: '31248', data: '01-02-2023' },
          { id: 4, label: '21349', data: '08-03-2023' },
          { id: 5, label: '21291', data: '09-03-2023' },
          { id: 6, label: '23477', data: '10-04-2023' },
          // Add more events as needed
        ],
        activeEvent: null,
      };
    },
    methods: {
      showTooltip(event)            {
        this.activeEvent = event;
      },
      selecionaFiltro( option )     {
            this.filtroSelecionado = option;
            console.log(   "FILTRO = " + this.filtroSelecionado + 
                      '|| tipo = ' + typeof this.filtroSelecionado );
      },
      hideTooltip()                 {
        this.activeEvent = null;
      },
      getImageUrl() 
      {
        var equipamento = "Viatura";

        // Logic to determine the image URL based on equipSelecionado
        if ( equipamento  === 'Viatura' )             
            return require('@/assets/viatura.png');
        else if ( equipamento === 'Talonário' )       
            return require('@/assets/talonario.png');
        else if ( equipamento === 'Rádio HT' )        
            return require('@/assets/radio.jpg');
        else if ( equipamento === 'Etilômetro' )  
            return require('@/assets/etilometro.png');
        else if ( equipamento === 'Colete' )          
            return require('@/assets/colete_new.jpg');
      },
    },
  };
  </script>
  
  <style>
  .timeline            {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .timeline-event      {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
  }
  .dot                 {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ff8c00;
    cursor: pointer;
  }  
  .tooltip             {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    background-color: #ff8c00;
    color: #fff;
    font-weight: bold;
    border-radius: 5px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
  }
  .line                 {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px;
    background-color: #ff8c00;
    font-weight: bold;

    width: 100%;
    height: 1px;
    background-color: black;
  }  
  .timeline-event:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  .data             {
    font-size: 12px;
  }
  .centro           {
    margin-left: auto;
    margin-right: auto;   
  }
  .imagem           {
    width: 100px;
    height: 100px;
  }
  .idEquipamento    {
    margin-left: auto;
    margin-right: auto;   
    background-color: #d6d2cc;
  }
  </style>
  