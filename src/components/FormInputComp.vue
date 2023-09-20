<!----
USAGE EXAMPLES:
vetor = [ 'value 1', 'value 2', 'value 3' ]
<FormInputComp :comp-id="IPT01" :data-list="vetor" label="Ok" width="200px"  
               @onInput     = "onInput"
               @onChange    = "onChange"
               @onKeydown   = "onKeydown"
               @onUpdate    = "onUpdate"/> ---->
<template>
     <div>
        <label> {{ label }} </label>
        <!-- v-model="inputValue" id="inline-form-input-name" 
        @blur="onBlur()"   @keydown="onKeydown()"   @change="onChange()"  @update="onUpdate()"
-->
       TTT {{ this.modelValue }}
        <b-form-input
            :value="modelValue"    
            @input='$emit("update:modelValue", $event.target.value )' 
            :placeholder="placeholder"
            autocomplete="off" 
            style="width: 500px;"
            list="list-id">
        </b-form-input>

        <input
            type="text"
            :value="value"
            @input="updateValue($event.target.value)"
            placeholder="Enter text"
        />

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
import ComponentType from '@/utils/enums.js';

const COMP_TYPE = ComponentType.FORM_INPUT;

export default                
{
    name: 'FormInputComp',
    components:             {
       BFormInput 
    },
    model: {
        modelValue: 'title',
        event: 'update:modelValue'
    },
    props:                  {
        compId:     {
            type: Number,
            required: true
        },
        value: {
            type: String,
            required: true,
        },
        label: {
           type: String,
           required: true
        },
        placeholder: {
            type: String
        },
        dataList: Array,
        width: Number   
    },
    created()                         {
        console.log( "-- " + this.modelValue );
    },
    mounted ()                        {
        this.inputValue = new String();
        console.log( "--ddd " + this.modelValue );
        console.log( "-- DATALIST ==>>>>" + JSON.stringify( this.dataList ) );
        // alert( COMP_TYPE );
    }, 
    watch: {
        modelValue ()       {
            console.log( 'Ok = ' + this.modelValue );
        }
    },
    data()                  {
      return        {
          inputValue: "value",
      };
    }, 
    methods:                
    {
        onChange()   {
            console.log("Comp  -- -->> Change !!!");
            this.$emit( 'onChange', this.compId, COMP_TYPE, this.inputValue )
        },
        onKeydown()  {
            // console.log("Comp  -- -->> Keydown !!!");
            this.$emit( 'onKeydown', this.compId, COMP_TYPE, this.inputValue )
        },
        onUpdate()   {
            console.log("Comp -- -->> Update !!!");
            this.$emit( 'onUpdate', this.compId, COMP_TYPE, this.inputValue )
        },
        onBlur()     {
            console.log("Comp -- -->> Blur !!!");
            this.$emit( 'onBlur', this.compId, COMP_TYPE, this.inputValue )
        },
        updateValue(newValue) {
            // Emit an input event to update the parent component's data
            this.$emit('input', newValue);
         },
    },
};
</script> 