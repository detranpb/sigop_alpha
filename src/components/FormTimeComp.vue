<!--    HOW TO USE
<FormTimeComp label="Hora:" width="100px" 
              @onInput  = "onInputTime"
              @onShown  = "onShownTime"
              @onHidden = "onHiddenTime"
              :validation = "{ validate: false, isValid: false }"/>
-->
<template>
    <div>
      <label :style="{width: width, backgroundColor: backgroundColor, opacity: opacity, textShadow: textShadow}">
              {{ label }}
      </label>
      
      <!-- CASO USO DE VALIDAÇÃO -->
      <div v-if="validation.validate">
           <b-form-timepicker v-model="time" locale="pt" 
                @input = "onInput()"
                @shown = "onShown()"
                @hidden = "onHidden()"
                :state="validation.isValid">
           </b-form-timepicker>
      </div>

      <!-- CASO SEM VALIDAÇÃO -->
      <div v-else>
        <b-form-timepicker v-model="time" locale="pt" 
                @input = "onInput()"
                @shown = "onShown()"
                @hidden = "onHidden()">
           </b-form-timepicker>
      </div>

    </div>
  </template>
  
  <script>
  export default                {
    name: 'FormTimeComp',
    props:                 {
        compId:     {
            type: Number,
            required: true
        },
        validation: {
           type: Object,
           default: () => ({ validate: false,  // Define se é para validar 
                             isValid: false }) // Valor se está válido
        },
        label:      {
            type: String,
            required: true
        },
        width:           {
            type: String,
            required: true
        },
        backgroundColor: {
            type: String,
            required: true
        },
        opacity:         {
            type: Number,
            required: true
        },
        textShadow:      {
            type: String,
            required: true
        },
    },
    data()  
    {
        return      {
          time: '',
        };
    },
    mounted ()      {
        this.time = new Number(); 
    }, 
    methods:                { 
        onInput ()  
        {
          // console.log( 'INPUT = ' + this.time );
          this.$emit('onInput', this.time );
        },
        onShown()  
        {
          // console.log( 'SHOW = ' + this.time );
          this.$emit('onShown', this.time );
        },
        onHidden() 
        {
           // console.log( 'HIDDEN = ' + this.time );
           this.$emit('onHidden', this.time );
        }
    }
     
  };
  </script>