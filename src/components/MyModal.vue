<template>
  <b-modal v-model="computedVisible" :id="id">
    <template v-slot:modal-header="{ title }">
      <h5> {{ title }} </h5>
      <b-button size="sm" variant="outline-danger" @click="onCloseModal()"> Fechar </b-button>
    </template>
    <p> {{ message }} </p>
    <template v-slot:modal-footer="{ title }">
      <!-- <p>Rodapé personalizado</p> -->
      {{ title }}
      <!-- <b-button size="sm" variant="outline-success" @click="onAcceptModal()"> Sim </b-button> -->
      <!-- <b-button size="sm" variant="outline-primary" @click="onRejectModal()"> Não </b-button> -->
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'MyModal',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods:  {
    onCloseModal()    {
        //console.log("CLOSE");
        this.$emit('on-close-modal');
    },
    onAcceptModal()   {
        //console.log("ACEITA");
        this.$emit('on-accept-modal');
    },
    onRejectModal()   {
        //console.log("REJEITA");
        this.$emit('on-reject-modal');
    }
  },
  computed: {
    computedVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    }
  }
}
</script>