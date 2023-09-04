<template>
  <main>
  <div>
    <!-- <b-button @click="showModal()">Show Modal</b-button>-->
    <my-modal id="myModal" title="Confirmation" message="Are you sure?" :visible="modalIsVisible" @update:visible="modalIsVisible = $event" />
    <AppAccordion/>
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

