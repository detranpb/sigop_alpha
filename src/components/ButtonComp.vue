<template>
    
    <div v-if="toggleData.toggle">
        <b-button v-b-toggle="accordion-1" @click="onClick" :variant="variantValue" :style="{ width: width }" :key="id"> 
            {{    text    }} COM TOOGLE
        </b-button>
    </div>
    <div v-else>
        <b-button :v-b-toggle="toggleData.toggleName" @click="onClick" :variant="variantValue" :style="{ width: width }" :key="id"> 
            {{    text    }} xxx
        </b-button>
    </div>
    <!-- <i :class="fontAwesomeClass"></i>  -->
</template>

<!-- -- -- -- -- -- -- -- -- -- -- -- -- 
"primary" "secondary" "success" "danger" 
"warning" "info" "light" "dark" 
-- -- -- -- -- -- -- -- -- -- -- -- -- ----!-->

<script>
import { BButton } from "bootstrap-vue";
export default                
{
    name: 'ButtonComp',
    components:       {
      BButton,
    },
    props:            
    {
        compId: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        toggleData: {                            // "{ validate: false, isValid: false }"
            type: Object,
            default: () => ( { toggle  : false,  // Define se é para validar 
                               toggleName : "" } )
        },
        isRounded: Boolean,
        width: Number,
        fontAwesomeClass: String,
        variantValue: String
    },
    data()                     {
        return    {
           id: 1,
           numClicks: 0,
        };
    },
    mounted ()                 {
        this.id = new String()
    },
    methods:                   {
        onClick() {
            this.$emit( "onClick", this.compId, this.numClicks++ );
            /** PADRÃO: O COMPID, Sempre será retornado em 1° lugar, como parâmetro **/
        },
    },
  };
  </script>


  /**** method no pai
  updateBtnClick()  {

  }
  ****/