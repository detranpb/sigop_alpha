<template>
      <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
  <main>
  <div>

    <b-card>
      <h4 class="card-title text-center titulo-paginas"> Cadastro de Operações </h4>
      <b-tabs card>
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab v-for="i in tabs" :key="'dyn-tab-' + i" :title="'Operação ' + (i+1)">
          <!-- ID = {{ i }} -->
          <div class="btnCancel">
            <b-button size="sm" variant="danger" class="float-right" @click="closeTab(i)">
                  <i class="fas fa-times"></i>
                  Cancelar Operação
            </b-button>
          </div>
          <!-- COMPONENTE DE FORMULÁRIO DE CADASTRO OPERAÇÕES -->
                            <FormOperacoes />
          <!-- COMPONENTE DE FORMULÁRIO DE CADASTRO OPERAÇÕES -->
        </b-tab>

        <!-- New Tab Button (Using tabs-end slot) -->
        <template #tabs-end>
          <b-nav-item role="presentation" @click.prevent="newTab" href="#">
            <b>+</b> Nova Operação
          </b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            Sem operações abertas.<br>
            Abra uma nova aba de operações com o botão acima.
          </div>
        </template>
      </b-tabs>
    </b-card>
  </div>
  </main>
</template>

<script>
  import FormOperacoes  from '@/pages/FormOperacoes';

  export default {
    components: {
        FormOperacoes,
    },
    name:'AddOperacoes',
    data() {
      return {
        tabs: [],
        tabCounter: 0
      }
    },
    created()   
    {
      // this.authenticationControl();
      this.$store.commit('setIsPageEditable', true );
      this.newTab();
    },
    methods: 
    { 
      closeTab( x )   {
          for (let i = 0; i < this.tabs.length; i++)  {
            if ( this.tabs[i] === x )  
                this.tabs.splice(i, 1)
          }
          this.tabCounter--;
      },
      newTab()        {
          this.tabs.push(this.tabCounter++)
      }
    }
  }
</script>

<style>
.btnCancel      {
 content: "";
 padding-left: 85%;
}

.btn-container  {
 display: flex;
 justify-content: center;
}
</style>