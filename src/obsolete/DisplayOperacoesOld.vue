<template>
  <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>

    <!-- MODAL OCULTO -->
    <b-modal v-model="modalIsVisible" id="meu-modal">
        <template v-slot:modal-header="{ closeModal }">
          <h5> Confirmação </h5>
          <b-button size="sm" variant="outline-danger" @click="closeModal()"> Fechar </b-button>
        </template>
        <p> Deseja confirmar alteração? </p>
 
        <template v-slot:modal-footer="{ hide , ok }">
          <p>Rodapé personalizado</p>
          <b-button size="sm" variant="outline-danger" @click="hide()"> Sim </b-button>
          <b-button size="sm" variant="outline-primary" @click="ok()"> Não </b-button>
        </template>
    </b-modal>
    <!-- MODAL OCULTO -->

  <!-- Dados gerais -->
  <b-button class="btn-add" v-b-toggle.collapse-1 variant="primary">Dados Gerais da Operação</b-button>
  <b-collapse id="collapse-1" class="mt-2">
    <b-card>

      <div class="dados-operacao">
      <b-form inline>

          <b-container class="bv-example-row">
          <b-row>
            <!-- COL. 1 -->
            <b-col>
                <label class="titulo-operacao" for="inline-form-input-name">Nome da Operação: </label>
                <b-form-input id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0"></b-form-input> 
            </b-col>

            <!-- COL. 2 -->
            <b-col>
                <label class="titulo-operacao" for="example-datepicker">Data: </label>
                <b-form-datepicker id="example-datepicker" v-model="dataOperacao" class="mb-2"></b-form-datepicker>
                <p>Value: '{{ dataOperacao }}'</p>
            </b-col>

            <!-- COL. 4 -->
            <b-col>
                <label class="titulo-operacao" for="inline-form-input-name">Bairro: </label><br>
                <b-form-select v-model="bairroOperacao" :options="bairros" size="sm" class="mt-3"></b-form-select>
                <!-- <div class="mt-3">Selecionado: <strong>{{ selected }}</strong></div> -->
            </b-col>

            <!-- COL. 3 -->
            <b-col>
                <label class="titulo-operacao" for="inline-form-input-name">Quilometragem Estimada: </label>
                <input id="type-range" v-model="kmEstimado" type="range" class="custom-range" min="0.5" max="100" step="0.25">
                <div class="mt-2">Km: {{ kmEstimado }}</div>
            </b-col>
            
          </b-row>

          <!-- LINHA II -->
          <b-row>
            <!-- COL. 1 -->
            <b-col>
                <label class="titulo-operacao" for="inline-form-input-name">Matrícula Responsável: </label>
                <b-form-input id="inline-form-input-name" class="mb-2 mr-sm-2 mb-sm-0"></b-form-input> 
            </b-col>

            <b-col>
              <label class="titulo-operacao" for="inline-form-input-name">Horário Início: </label><br>
              <b-time
                id="ex-disabled-readonly"
                :disabled="disabled"
                :readonly="readonly"
              ></b-time>
            </b-col>

            <b-col>
              <label class="titulo-operacao" for="inline-form-input-name">Horário Fim: </label><br>
              <b-time
                id="ex-disabled-readonly"
                :disabled="disabled"
                :readonly="readonly"
              ></b-time>
            </b-col>
            
            <!-- COL. 4 -->
            <b-col>
                <label class="titulo-operacao" for="inline-form-input-name">Combustível Estimado: </label>
                <input id="type-range" v-model="combEstimado" type="range" class="custom-range" min="0.5" max="100" step="0.25">
                <!-- <div class="mt-2">L: {{ combEstimado }}</div> -->
            </b-col>

          </b-row>
        </b-container>
      </b-form>
    </div>
</b-card>
  </b-collapse>

    <div class="legenda-tabela"> Registros de entrada/saída de equipamentos </div>
    <div class="table-container">
      <div class="table-centralizer">
    <b-editable-table
      disableDefaultEdit
      :rowUpdate="rowUpdate"
      :editMode="'row'"
      bordered
      class="editable-table"
      v-model="items"
      :fields="fields"
    >
      <template #cell(isActive)="data">
        <span v-if="data.value">Yes</span>
        <span v-else>No</span>
      </template>
      <template #cell(edit)="data">
        <div v-if="data.isEdit">
          <BIconX class="edit-icon" @click="handleSubmit(data, false)"></BIconX>
          <BIconCheck
            class="edit-icon"
            @click="handleSubmit(data, true)"
          ></BIconCheck>
        </div>
        <BIconPencil
          v-else
          class="edit-icon"
          @click="handleEdit(data, true)"
        ></BIconPencil>
      </template>
      <template #cell(delete)="data">
        <BIconTrash
          class="remove-icon"
          @click="handleDelete(data)"
        ></BIconTrash>
      </template>
    </b-editable-table>
  </div>
</div>
</main>
</template>

<script>
import BEditableTable from "bootstrap-vue-editable-table";
import {
  BIconTrash,
  BIconPencil,
  BIconX,
  BIconCheck,
  BButton,
} from "bootstrap-vue";
export default { 
  components: {
    BEditableTable,
    BIconX,
    BIconTrash,
    BIconPencil,
    BIconCheck,
    BButton,
  }, 
  
  data() 
  {
    return {
      modalIsVisible: false,
      kmEstimado: '0.0',
      dataOperacao: '00-00-0000',
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
          key: "dataIni",
          label: "Data Saída",
          type: "date",
          editable: true,
          class: "date-col",
          locale: "pt-br",
          "date-format-options": {
            year: "numeric",
            day: "numeric",
            month: "numeric",            
          },
        },
        {
          key: "horaIni",
          label: "Hora Saída",
          type: "time",
          editable: true,
          class: "time-col",
          locale: "pt-br",
        },
        {
          key: "dataFim",
          label: "Data Retorno",
          type: "date",
          editable: true,
          class: "date-col",
          locale: "pt-br",
          "date-format-options": {
            year: "numeric",
            day: "numeric",
            month: "numeric",            
          },
        },
        {
          key: "horaFim",
          label: "Hora Retorno",
          type: "time",
          editable: true,
          class: "time-col",
          locale: "pt-br",
        },
        {
          key: "matricula",
          label: "Matricula",
          type: "numeric",
          editable: true,
          placeholder: "Matrícula...",
          class: "matricula-col",
        },
        {
          key: "nomeFuncionario",
          label: "Nome Agente",
          type: "select",
          editable: true,
          class: "department-col", 
        },
        {
          key: "idEquipamento",
          label: "ID Equipamento",
          type: "numeric",
          editable: true,
          class: "id-equip-col", 
        }, 
        /*{
          key: "isAvariado",
          label: "Avariado?",
          type: "checkbox",
          editable: true,
          class: "is-avariado-col",
        },*/
        { key: "edit", label: "" },
      ],


      /* VALORES DA TABELA */
      items: [
        /* ATENÇÃO NOME DAS VARIÁVEIS, SE EXISTE ?!?!? */        
        { id: 1, dataIni: "20-11-2022", horaIni: "01:00", dataFim: "20-11-2022", horaFim: "01:00", matricula: 1234, nomeFuncionario: "Paulo", idEquipamento: 44, }, // isAvariado: false,
      ],
      rowUpdate: {},
    };
  },
  methods: {
    handleAdd() {
      this.rowUpdate = {
        edit: true,
        id: Date.now(),
        action: "add",
        data: {
          id: Date.now(),
          dataIni: null,
          horaIni: null,
          dataFim: null,
          horaFim: null,
          matricula: null,
          nomeFuncionario: null,
          idEquipamento: null,
        },
      };
    },
    handleSubmit(data, update) {
      this.rowUpdate = {
        edit: false,
        id: data.id,
        action: update ? "update" : "cancel",
      };
      console.log( "updated = " + this.rowUpdate );
      this.modalIsVisible = true;
    },
    handleEdit(data) {
      this.rowUpdate = { edit: true, id: data.id };
      console.log( "updated = " + this.rowUpdate );
    },
    handleDelete(data) {
      this.rowUpdate = { id: data.id, action: "delete" };
      console.log( "deleted = " + this.rowUpdate );
    }
  },
};
</script>

<style>
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
}
</style>