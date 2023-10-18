<template>
<main class="main-container">

<div class="mobile-centralizer">  
  <b-button class="btnConsulta" size="sm" :variant="novaConsultaBtnVariant" @click="novaConsulta()">
        <i class="fa fa-refresh" aria-hidden="true"></i> Nova Consulta
  </b-button>
  <b-button class="btnConsulta" size="sm" v-b-toggle.collapse-1 variant="primary"> 
        <i class="fa fa-sort"></i> Painél de Consulta 
  </b-button>
</div>  

<b-collapse id="collapse-1" v-model="isPainelOn" class="mt-2" :key="resetComponentKey">
  <b-card>

        <!-- CONTEUDO COLAPSSE -->
        <div class="container-filtros">
          <div  style="margin-top: 10px;">
            <b-dropdown size="sm" text="Filtros de Consulta" class="m-md-2">
                <b-dropdown-item size="sm" @click="selecionaFiltro('data')">Data da Operação</b-dropdown-item>
                <b-dropdown-item size="sm" @click="selecionaFiltro('id')">ID da Operação</b-dropdown-item> 
            </b-dropdown>
          </div>
          <div   class="elem-busca" v-if="( filtroSelecionado=='id' )">
              <label size="sm" class="label"><b> ID da Operação: </b></label>
              <b-form-input size="sm" type="number" style="width:100px;" autocomplete="off" v-model="filtrosValues.id" id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0 custom-input"></b-form-input>
          </div>

          <div  class="elem-busca" v-if="( filtroSelecionado=='data' )">
            <div>
              <label size="sm" class="label" for="example-datepicker"><b> Selecione a Data: </b></label>
              <b-form-datepicker size="sm" style="width:300px;"   id="example-datepicker" v-model="filtrosValues.dataOp" class="mb-2"></b-form-datepicker>
            </div>
          </div>

          <div class="elem-busca" v-if="( ( filtroSelecionado == 'data' ) || ( filtroSelecionado == 'id' ) )">           
            <b-button size="sm" style="margin-top: 18px;"  class="float-right" @click="buscarOperacoes()">
                    <i class="fa fa-search"></i> Buscar Operações
            </b-button>
          </div> 
        </div>

        <div v-if="isTableOperacoesVisible" class="tab-container">
            <div class="my-tab-content">
                <label class="label"><b> Operações Disponíveis </b></label>
                <b-table bordered style="width: 100%;" :items="tableData" :fields="tableFields" striped hover selectable @row-clicked="handleRowClicked"></b-table>
            </div>
        </div>
    <!-- CONTEUDO COLAPSSE -->
  </b-card>
</b-collapse>



</main>
</template>

<script>
  import axios from 'axios';
  import UtilsMixin from '@/utils/UtilsMixin.js' //--- SE ASSEMELHA A HERANÇA
  export default 
  { 
   mixins: [UtilsMixin],
   name:'ConsultaOperacoes',
     
    data()  {  
      return  {
          resetComponentKey: -1,
          novaConsultaBtnVariant: "light",
          isLoading : false,
          modalIsVisible : false,
          isPainelOn: false,
          modalMessage: "Deseja confirmar a operação?",
          isAddOperacoesPage: -1,
          filtroSelecionado: '',
          filtrosValues : {
              dataOp : "",
              id: "1",
              matriculaResponsavel: null,
          },
          isTableOperacoesVisible: false,
          tableData: [], 
          tableFields: [
            { key: "id", label: "ID" },
            { key: "nomeOperacao", label: "Nome" },
            { key: "data", label: "Data" },
            { key: "matriculaResponsavel", label: "Matricula" }
          ],
          selectedRowId: null,
        }
    },
    mounted() 
    {
      for( var i=0; i<20; i++ )
           this.tableData[ i ] = { id: 0, nomeOperacao: " ", data: " ", matriculaResponsavel:0 };

      document.addEventListener( 'keydown', this.myFunction );
    },
    methods:          
    {
      novaConsulta()                          {
          location.reload();
          this.resetComponentKey++;
          var novaConsultaOn = false;
          this.$emit('nova-consulta', novaConsultaOn );
          this.tableData[{ id:0, nomeOperacao: " ", data: " ", matriculaResponsavel:0 } ];
      },
      myFunction( event )                     {
          // ----- BARRA DE SPAÇO ----- 
          if ( event.keyCode == 32 )   {
               this.filtroSelecionado = 'id';
               this.filtrosValues.id = 375;
               this.buscarOperacoes();
          }
      },
      selecionaFiltro( option )              {
          this.filtroSelecionado = option;
          // alert( "FILTRO = " + this.filtroSelecionado + '|| tipo = ' + typeof this.filtroSelecionado);
      },
      handleRowClicked( item, index ) 
      {
          this.isPainelOn = false;
          this.selectedRowId = item.id;
          this.$emit('table-updated', this.tableData[ index ] ); 
          // alert( JSON.stringify( this.tableData[ index ] ) );
      },
      replaceSubstrings( STR )
      {
          const V1 = [ "u00c7u00c3O", "u00d5", "u00e1", "u00e9", "u00ed", "u00f3", "u00fa", "u00e3", "u00f5" ];
          const V2 = [ "ÇÃO", "Õ", "á", "é", "í", "ó", "ú", "ã", "õ" ];
          for ( let i = 0; i < V1.length; i++ )
                STR = STR.split( V1[i] ).join(V2[i] );
          return STR;
      },
     buscarOperacoes()                       
     {
        // console.log( "-buscarOperacoes ==>> " + JSON.stringify( this.filtrosValues ) + ", " + this.filtroSelecionado );
        this.novaConsultaBtnVariant = "primary";
        var sendData    =    {
          dados: {
              entidade: 'operacao',
              operacao: 'consultar',
              objeto: {   filtro: true  }
          }
        };
        if ( this.filtroSelecionado == 'data' )             {
             sendData.dados.objeto.data = '' + this.filtrosValues.dataOp;
             // console.log( "-- SEND data ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        }    else if ( this.filtroSelecionado == 'id' )     {
             sendData.dados.objeto.id   = '' + this.filtrosValues.id;
             // console.log( "-- SEND id ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );
        } 
        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
             .then( response =>    {
                    var dados = response.data; // -->>> Isso chama o watcher !
                    // console.log( "Resposta API OKOKOK = " + this + " || " + JSON.stringify( dados ).replace( /\\/g, "" ) );
                    // alert( dados.code );

                    if ( dados.code == 99 )        {
                        /*** this.modalIsVisible = true;
                        this.modalMessage = ""; ***/
                        this.showModal("Nenhuma operação encontrada.");
                    }
                    if ( dados.data.length > 0 )
                        this.isTableOperacoesVisible = true;

                    var numOperacoes = dados.data.length;
                    // console.log( "Num Op? = " + numOperacoes );
                    for ( var i=0; i<numOperacoes; i++ )                
                    {
                         var strNomeOp = dados.data[i].nomeOperacao;
                         // console.log( "Nome Op. = " + strNomeOp );
                         var novoNome = this.replaceSubstrings( strNomeOp );
                         // console.log( "-Nova St? " + novoNome + "||" + dados.data[ i ].id + " || " + dados.data[ i ].data + " || " + dados.data[ i ].matriculaResponsavel );
                         this.tableData[ i ].id = dados.data[ i ].id;
                         this.tableData[ i ].nomeOperacao = novoNome;
                         this.tableData[ i ].data = dados.data[ i ].data;
                         this.tableData[ i ].matriculaResponsavel = dados.data[ i ].matriculaResponsavel;
                   }
                   this.tableData.splice( numOperacoes, this.tableData.length - numOperacoes);
            })
            .catch( error => {
                    this.error = error.message;
            } );
        } 
    }
}
</script>


<style>
.btnConsulta                {
  width: 200px;
  margin: 5px;
  color: #044a5c;
}

.main-container             {
  height: auto;
}

/*** Estilos APENAS para Desktop!! */
@media (min-width:620px)     {
  .container-filtros      {
    background-color: var(--color-background);
    margin:20px;
    display: flex;
    justify-content: center;
  }
  .tab-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background);
  }
  .my-tab-content {
    width: 50%; 
  }
}

/*** Estilos APENAS para celular */ 
@media (max-width: 619px) 	{
  .container-filtros      {
    background-color: var(--color-background);
    margin:5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .tab-container          {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background);
  }
  .mobile-centralizer     {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .my-tab-content         {
    width: 100%;
  }
}
.container-filtros > div {
  margin-right: 1px;
}
.container-filtros > div:last-child {
  margin-right: 0;
}
.elem-busca {
  margin-left: 20px;
  margin-right: 20px;
}
.label           {
  font-size: 15px;
  color: #044a5c;
}


</style>

