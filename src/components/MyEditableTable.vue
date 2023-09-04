<template>
  <div>
    <b-modal v-model="mVisible" @hide="onModalClose" hide-footer>
        <div class="modal-header">
              <h5 class="modal-title">Selecione Equipamento</h5>
        </div>
        <div class="modal-body">
              <b-form-select v-model="selectedOption" :options="options"></b-form-select>
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

    <br>
    <div class="table-container">
      <!-- <div class="legenda-tabela"> Registros de entrada/saída de equipamentos </div> -->
      <div class="table-centralizer">
    
      
      <!-- <p v-if="idOperacao"> ||---- ID Value EditTable: {{ idOperacao }} ----|| </p> -->
      IS_PAGE_EDITABLE ? =  {{ IS_PAGE_EDITABLE }}
      hasSavedOnDatabase? {{ hasSavedOnDatabase }}
    <b-editable-table
      disableDefaultEdit
      :rowUpdate="rowUpdate"
      :editMode="'row'"
      bordered
      class="editable-table"
      v-model="items"
      :fields="dynamicFields"
      @input-change="handleInput"
    >
    <!-- :fields="fields" --> 
      <template #cell(isActive)="data">
        <span v-if="data.value">Yes</span>
        <span v-else>No</span>
      </template>
      <template #cell(edit)="data">
        <div v-if="data.isEdit">
          <BIconX class="edit-icon" @click="handleSubmit( data, false )"></BIconX>
          <BIconCheck
            class="edit-icon"
            @click="handleSubmit( data, true )"
          ></BIconCheck>
        </div>
        
        <BIconPencil
          v-else
          class="edit-icon"
          @click="handleEdit(data, true)"
          :disabled="IS_PAGE_EDITABLE && hasSavedOnDatabase"
        ></BIconPencil>
        
      </template>
    
      <template #cell(delete)="data">
        <BIconTrash
          class="remove-icon"
          @click="handleDelete(data)"
          v-if="IS_PAGE_EDITABLE && !hasSavedOnDatabase"
        ></BIconTrash>
      </template>
    </b-editable-table>
    
  </div>
</div>

    <b-button v-if="IS_PAGE_EDITABLE && !hasSavedOnDatabase" class="btn-add" variant="primary"  @click="cadastrarAgenteBD()">
        <i class="fa fa-database"></i> Cadastrar Agente
    </b-button>
</div>
</template>

<script>
import axios from 'axios';
import BEditableTable from "bootstrap-vue-editable-table";
import MyModal from '@/components/MyModal.vue';

import {
  BIconTrash,
  BIconPencil,
  BIconX,
  BIconCheck,
  BButton,
} from "bootstrap-vue";
export default 
{
  props: 
  {
    compTableItens:[],
    idOperacao: {
       required: true  
    }, 
    usuMatricula: {
      required: true  
    },
  },
  name: 'MyEditableTable',
  
  components: {
    MyModal,
    BEditableTable,
    BIconX,
    BIconTrash,
    BIconPencil,
    BIconCheck,
    BButton,
  },
  watch: { 
      usuMatricula( newValue )         
      {
        this.usuMatriculaLocal = newValue;
      }
  },
  computed:
  {  // CONSTANTE
      IS_PAGE_EDITABLE()  {
          return this.$store.state.isPageEditable;
      },
      dynamicFields() 
      {
        return this.isAddOperacoesPage ? this.fields : this.fieldsInput;

        /*
        // Create a new array based on the original fields array
        const modifiedFields = [ ...this.fields ];
        console.log( JSON.stringify( modifiedFields ) );

        // Modify the modifiedFields array based on your logic
        // Example: Remove a field
        modifiedFields.splice( 1, 1 );
        modifiedFields.splice( 2, 1 );

        // Add a new field
        modifiedFields.push({
          key: "newField",
          label: "New Field",
          // Other properties...
        });
        return modifiedFields;*/
      }
  }, 
     
  created() 
  {
      //console.log( "Create Table where?? >> " + this.$route.name );
      if ( this.$route.name != "addOperacoes" )
           this.isAddOperacoesPage = true;

      const keysToRemove = ["horaDevolucao", "dataDevolucao"]; // Example keys to remove
      // Filter the array to remove items based on the specified keys
      const filteredArray = this.fields.filter(item => !keysToRemove.includes(item.key));
      //console.log( JSON.stringify( filteredArray ) );

      // console.log( "CAMPOS >>" + JSON.stringify( this.fields ) );
      if ( this.compTableItens )  {
           this.items = [ ...this.compTableItens ];
           // console.log( "CREATED TABLE ||| store = " + this.IS_PAGE_EDITABLE );
      }
  },

  
  data() 
  {
    return  {
      /** Modal de seleção **/
      mVisible: false,
      selectedOption: null,
      options: ['Option 1', 'Option 2', 'Option 3'],

      usuMatriculaLocal: null,
      isAddOperacoesPage: -1, /** Verifica se esta página atual é a de adicionar Operações */

      /* Dados de controle */
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
      fields: [
        { key: "delete", label: "" },
        {
          key: "dataDevolucao",
          label: "Data de Devolução",
          type: "date",
          editable: true,
          class: "date-col",
          locale: "pt-br",
          validate: this.validateDataDevolucao,  
          "date-format-options": {
            day: "numeric",
            month: "numeric",            
            year: "numeric",
          },
        },
        {
          key: "horaDevolucao",
          label: "Hora de Devolução",
          type: "time",
          editable: true,
          class: "time-col",
          locale: "pt-br",
          validate: this.validateHoraDevolucao,  
        },
        {
          key: "nomeEquipamento",
          label: "Tipo Equipamento",
          options: ['Talonário', 'Viatura', 'Rádio HT', 'Colete'],
          type: "select",
          editable: true,
          size:"lg",
          class: "id-equip-col", 
          validate: this.validateNomeEquipamento, /* ----- VALIDADOR !!!!! */
        },
        {
          key: "idEquipamento",
          label: "ID Equipamento",
          type: "datalist",
          editable: true,
          class: "id-equip-col", 
          validate: this.validateIdEquipamento, /* ----- VALIDADOR !!!!! */
        },
        {
          key: "placa",
          label: "Placa",
          type: "text",
          editable: true,
          class: "id-equip-col",
        },
        {
          key: "isAvariado",
          label: "Avariado?",
          type: "checkbox",
          editable: true,
          class: "is-active-col",
        },
        { key: "edit", label: "" },
      ],

      /* VALORES DA TABELA */
      items: [
          {  dataDevolucao: "20-11-2022", horaDevolucao: "01:00", idEquipamento: 44, nomeEquipamento:"Insira nome", placa:"ZZZ9999", isAvariado: false }, // isAvariado: false,
      ],
      rowUpdate: {},
    };
  }, 
  methods: {
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
    handleInput( data )     
    {
        const updatedRow = { ...this.items[data.index], [data.field.key]: data.value };
        this.$set( this.items, data.index, updatedRow );      
    },
    showModal()           {
      this.modalVisible = true;
    },
    onModalClose()        {
      console.log('Selected Option:', this.selectedOption);
    },
    /* No INPUT de CADA CAMPO !!!!! 
    handleInput( data )   
    {
      // const updatedRow = { ...this.items[ data.index ], [data.field.key]: data.value };
      // console.log( this.items[ data.index ] + "ID = " + data.index + " -- " + data.field.key + " || " + data.value );
      if ( data.field.key == "dataDevolucao" )  {
            const date = new Date( data.value );
            const offset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
            const adjustedDate = new Date(date.getTime() - offset + 86400000); // Add one day in milliseconds
            const newDate = adjustedDate.toLocaleDateString("pt-BR");
            data.value = newDate;
            this.items[ 0 ].dataDevolucao = newDate;
            // console.log( newDate );
      }
      // this.$set( this.items, data.index, updatedRow );
    },*/
    handleAdd() 
    {
      console.log( this.$route.name );
      
      if ( this.$route.name != "addOperacoes" )   {
            this.rowUpdate = {
              edit: true,
              id: Date.now(),
              action: "add",
              data: {
                id: Date.now(),
                dataDevolucao: null,
                horaDevolucao: null,
                idEquipamento: null,
                nomeEquipamento: null,
                isAvariado: null,
              },
            };
      } else {
        console.log("This template !!! ");
        this.rowUpdate = {
              edit: true,
              id: Date.now(),
              action: "add",
              data: {
                id: Date.now(),
                idEquipamento: null,
                nomeEquipamento: null,
                placa: null,
                isAvariado: null,
              },
            };
      }
    }, 
    validateIdEquipamento(  value  )    
    {
      //console.log( value + " || " + JSON.stringify( data ) );

      if ( value == 0 ) {
          return {
            valid: false,
            errorMessage: "ID do equipamento vazio.",
          };
        }
        return { valid: true };

    },
    validateNomeEquipamento( value )  {
      if (value === 0) {
          return {
            valid: false,
            errorMessage: "Nome do equipamento vazio.",
          };
        }
        return { valid: true };
    }, 
    validateHoraDevolucao( value )    {
      //console.log( value + " || " + JSON.stringify( data ) );

      if (value === 0) {
          return {
            valid: false,
            errorMessage: "Nome do equipamento vazio.",
          };
        }
        return { valid: true };
    }, 
    validateDataDevolucao( value ) /* , data*/
    {    
          //console.log( JSON.stringify( value ) + data );
          
          var dateObj = new Date( value );
          var currentDate = new Date();

          // Compare the dates
          if (dateObj.getTime() < currentDate.getTime()) {
              return {
                valid: false,
                errorMessage: "Data de devolução anterior a data atual",
              };
          } 
          return { valid: true };
     },
     validaNovaLinha( ROW )            
     {
        console.log( "valido? = " + ROW.dataDevolucao + " " + 
                ROW.horaDevolucao + " " +
                ROW.idEquipamento + " " +
                ROW.isAvariado );
        
        if ( ROW.dataDevolucao == null )  
        {
            this.modalMessage = "Preencha a data de devolução do equipamento.";
            return false;
        } 
        if ( ROW.horaDevolucao == null )  {
            this.modalMessage = "Preencha a hora de devolução do equipamento.";
            return false;
        }
        if ( ROW.idEquipamento == null )  {
            this.modalMessage = "Preencha o ID. do equipamento.";
            return false;
        }
        if ( ROW.isAvariado == null ) {
            this.modalMessage = "Preencha se foi avariado.";
            return false;
        }
        return true; 
    },
    handleSubmit( data, update )      {

        this.rowUpdate =  {
             edit: false,
             id: data.id,
             action: update ? "update" : "cancel",
        }; 

        /* const date = new Date( this.items[ data.index ].dataDevolucao );
        const offset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
        const adjustedDate = new Date(date.getTime() - offset + 86400000); // Add one day in milliseconds
        const newDate = adjustedDate.toLocaleDateString("pt-BR");
        this.items[ data.index ].dataDevolucao = newDate;
        console.log( newDate );*/
        
        const ROW = { ...this.items[data.index], [data.field.key]: data.value };
        
        /*this.isTableValidationOk = this.validaNovaLinha( ROW );
        if ( !this.isTableValidationOk ) {
              this.modalIsVisible = true;  // exibe modal   
              return;
        }*/

        delete ROW.edit;
        delete ROW.nomeEquipamento;
        
        ROW.matriculaAgente = this.usuMatriculaLocal;
        ROW.id = this.idOperacao;
        this.vet.push( ROW );
        
        //this.modalIsVisible = true;

        // =========== DEBUG ==============
        // console.log( ROW );
        // console.log( this.vet );
        // this.modalIsVisible = true;
        // =========== DEBUG ==============
        this.sendDataToParent();
    },
    sendDataToParent() 
    {
        this.$emit('data-updated', this.vet );
    },
    handleEdit( data  ) 
    {
        //if ( !this.hasSavedOnDatabase )   {
              this.rowUpdate = { edit: true, id: data.id };
              console.log( "Data ==>>> " + JSON.stringify( data ) + " || " + this.items[0]  );
        //}  
    },
    handleDelete( data  )  
    {
      this.rowUpdate = { id: data.id, action: "delete" };
      // console.log( "deleted = " + JSON.stringify( this.rowUpdate ) );
      
      // console.log( "Deleted =>> " + JSON.stringify( data.item ) );
      const deletedDataStr = JSON.stringify( data.item );

      this.vet.forEach(( value , index ) => {
           var vetElemStr = JSON.stringify( value );  
           // console.log( "vet[" + index + "] ==>> " + vetElemStr );
           
           if ( vetElemStr == deletedDataStr )  {
                console.log( "-Achou na posição " + index );
                console.log( "vet[" + index + "] ==>> " + vetElemStr );
                console.log( "deleted =>> " + JSON.stringify( data.item ) );
                this.vet.splice( index, 1 );
           }
          
                    
      });
    },
    cadastrarAgenteBD()             {

      // this.modalIsVisible = true;
      // console.log("CADASTRAR !!!!!");

      var sendData = {
          dados: {
              entidade: 'usoEquipamento',
              operacao: 'cadastrar',
              objeto: {}
          }
      };  
      
      for( var i=0; i < this.vet.length ; i++   )  
      {
        var objAuxStr = JSON.stringify( this.vet[i] ).replace( /\\/g, "" ).replace("id", "idOperacao");
        // console.log( "objAuxStr = " + objAuxStr );
        sendData.dados.objeto = JSON.parse( objAuxStr ); // this.vet[0]; // JSON.stringify( this.vet[0] ).replace( /\\/g, "" ).replace("id", "id_operacao");
        // this.validaNovaLinha( sendData.dados.objeto );

        // console.log( "objAuxStr = " + objAuxStr );

        this.isTableValidationOk = this.validaNovaLinha( sendData.dados.objeto );
        if ( !this.isTableValidationOk ) {
              this.modalIsVisible = true;  // exibe modal   
              return;
        }
        
        console.log( "-- SEND ==||>> " + JSON.stringify( sendData ).replace( /\\/g, "" ) );

        axios.post( this.$SERVICES_ENDPOINT_URL , sendData )
              .then( response => {
                    console.log( "Resposta API = " +  JSON.stringify( response.data , null, 2 ) );
                    var data = response.data; // -->>> Isso chama o watcher !
                    // console.log("Dados retornados = " +  this.responseData.dados );

                    console.log('-DATA == ' + JSON.stringify(  data )  );
                    console.log( "MSG = " + data.message + "|| code= " + data.code );

                    if ( data.code == 0 )   
                    {
                         console.log( "ID = " + data.data.id );
                         this.idValue = data.data.id;
                    }    else   {
                         this.modalIsVisible = true;
                         this.modalMessage = response.data.message;
                    }
              })
              .catch(error => {
                    this.error = error.message;
              });
        } // END-FOR
        // this.hasSavedOnDatabase = true;
      }

  },
};
</script>



<style>
.modal-content      {
  background-color: var( --modal-color );  /* Sets the background color with alpha */
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

.table-centralizer {
  display: flex;
  justify-content: center; 
  align-items: center;
}
.btn-add {
    margin-top: 20px;
    margin-right: 40%;
    margin-left:40%;
} 
.titulo-operacao {
  color: rgb(5, 76, 104);
  font-size: 15px;
  font-weight: bold;
}
.legenda-tabela {
  color: rgb(5, 76, 104);
  font-size: 14px;
  font-weight: bold;
  content: "";
  padding-left: 5%;
  text-align: center;
}
.btn-add-equip {
  transform: translateX(20px);    
  /* padding: 10px;
      display: flex;
      justify-content: center; 
      align-items: center;*/
  }
</style>