<!-- -- -- -- HOW TO USE -- -- -- --
<FormDateComp
    label="Date picker" width="100px" backgroundColor="#333" opacity="0.5" textShadow="0 0 5px #fff" @updateDate="onDateUpdate">
</FormDateComp> 
-- -- -- -- -- -- -- -- -- -- -- -->
<template>
    <div>
      <label :style="{width: width, backgroundColor: backgroundColor, opacity: opacity, textShadow: textShadow}" >
             {{ label }} 
      </label>
      <b-form-datepicker v-model="date" @change="shareData"></b-form-datepicker>
    </div>
</template>
  
  <script>
  export default                  {
    name: 'FormDateComp',
    props:                   {
        compId:         {
            type: Number,
            required: true
        },
        label:          {
            type: String,
            required: true
        },
        width:          {
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
    data()        {
      return {
        date: '',
      };
    },
    mounted ()    {
        this.date = new Date()
    },
    watch: {
        date ()   {
            //  console.log( 'Ok = ' + this.date );
            this.$emit('updateDate', this.date)
        }
    },
    methods: {
      /*shareData() {
        console.log("Ok!!!" + this.date );
        this.$emit('shareData', this.date);
      },*/
    },
  };
  </script>