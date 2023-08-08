<template>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <b-spinner></b-spinner>
        <p>Carregando...</p>
      </div>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </template>
  
  <style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }
  </style>
  
  <script>
  export default {
    props: {
      isLoading: {
        type: Boolean,
        required: true
      }
    }
  };
  </script>
  