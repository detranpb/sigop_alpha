<template>
  <div id="app">
      <MyHeader/>
      <router-view path="$router.key"/>
      <MyFooter/>
  </div>
</template>

<script>
import './styles/global.css';
import MyHeader from './components/MyHeader';
import MyFooter from './components/MyFooter';

export default  {
    name: 'App',
    components: {
      MyHeader,
      MyFooter,
    }
}
</script>

 
