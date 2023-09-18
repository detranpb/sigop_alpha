
<!--  -->
<template>
     <div>
        <label> {{ label }} </label>
        <b-form-input autocomplete="off" 
            @input="onInput()"
            @blur="onBlur()" 
            @keydown="onKeydown()"  
            @change="onChange()"  
            @update="onUpdate()"
            v-model="inputValue" id="inline-form-input-name" 
            style="width: 500px;"
            list="list-id">
        </b-form-input>
        <datalist id="list-id">
            <option v-for="a in dataList" :key="a">{{ a }}</option>
        </datalist>
        
        <!-- <b-form-input
            autocomplete="off" @keydown="handleKeyDown" v-model="usuMatricula[ index ]" id="inline-form-input-name" 
            style="width: 500px;" list="matriculas-list" @blur="validaAgente( index )">
        </b-form-input>

        <datalist v-if="isAddOperacoesPage" id="matriculas-list">
            <option v-for="a in getAgentesLabels()" :key="a.nome">{{ a }}</option>
        </datalist>
        -->

    </div>
</template>

<script>
import { BFormInput } from 'bootstrap-vue'
export default                
{
    name: 'FormInputComp',
    components:             {
       BFormInput
    },
    props:                  {
        compId:     {
            type: Number,
            required: true
        },
        label: {
           type: String,
           required: true
        },
        dataList: Array,
        width: Number   
    },
    mounted ()              {
        this.inputValue = new String();
        console.log( "-- DATALIST ==>>>>" + JSON.stringify( this.dataList ) );
    },
    watch: {
        inputValue ()       {
            console.log( 'Ok = ' + this.inputValue );
        }
    },
    data()                  {
      return        {
          inputValue: "value", 
      };
    }, 
    methods:                
    {
        onInput()    {       
            // console.log("Comp -- -->> Input !!!");
            this.$emit( 'onInput', this.compId, this.inputValue )
        },
        onChange()   {
            // console.log("Comp  -- -->> Change !!!");
            this.$emit( 'onChange', this.compId, this.inputValue )
        },
        onKeydown()  {
            // console.log("Comp  -- -->> Keydown !!!");
            this.$emit( 'onKeydown', this.compId, this.inputValue )
        },
        onUpdate()   {
            // console.log("Comp -- -->> Update !!!");
            this.$emit( 'onUpdate', this.compId, this.inputValue )
        },
        onBlur()     {
            // console.log("Comp -- -->> Blur !!!");
            this.$emit( 'onBlur', this.compId, this.inputValue )
        }
    },
};
</script> 