<template>
<main>
    <AppTimeline> </AppTimeline>
</main>
</template>

<script>
  import AppTimeline  from '@/components/AppTimeline';
  export default
  {
  components:         {
      AppTimeline
  }, 
  methods:            {
      showModal() {
        this.modalIsVisible = true;
      }, 
  }
}
</script>


<style>
</style>