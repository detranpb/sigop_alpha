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
  created()           {
      this.authenticationControl();
  },
  methods:            {
    showModal()                 {
        this.modalIsVisible = true;
    },
    authenticationControl()     {
        var isAuth = this.$store.state.isAutenticated;
        console.log( "- Auth? " + isAuth );
        if ( !isAuth )          {
              console.log("indo p login...");
              this.$router.push('/login');
        }
    }
  }
}
</script>


<style>
</style>