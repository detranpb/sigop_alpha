<template>
  <main>
  <div>
    <!-- <b-button @click="showModal()">Show Modal</b-button>-->
    <my-modal id="myModal" title="Confirmation" message="Are you sure?" :visible="modalIsVisible" @update:visible="modalIsVisible = $event" />
    <MyEditableTable />
    <AppAccordion/>
    <h2>Bem vindo.</h2>
  </div>
</main>
</template>

<script>
import MyModal         from '@/components/MyModal.vue';
export default {
  name: 'MyPage',
  components: {
    MyModal
  },
  data() {
    return {
      modalIsVisible: false
    }
  },
  methods: {
    showModal() {
      this.modalIsVisible = true;
    }
  }
}
</script>

