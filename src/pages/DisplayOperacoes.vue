<template>
  <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>
    
   <knob-control 
      v-model="kmEstimado"
      :min="0"
      :max="1000"
      :stroke-width="8"
      :animation="{
        animated: true,
        animateValue: true,
        animationDuration: '500',
        animationFunction: 'linear'
      }">
</knob-control>
    <!-- MODAL OCULTO 
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
    </b-modal>MODAL OCULTO -->

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

   
</main>
</template>

<script>
import BButton from "bootstrap-vue";
import KnobControl from 'vue-knob-control';
export default { 
  name: 'DisplayOperacoes',
  components: {
    BButton,
    KnobControl
  }, 
  data() 
  {
    return {
      modalIsVisible: false,
      kmEstimado: '150.0',
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
      
    };
  }
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