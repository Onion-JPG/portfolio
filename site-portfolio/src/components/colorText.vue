<template>
    <div>
    {{this.windowPrint}}
    </div>
        
    </template>
    
    <script lang="ts">
    
    export default {
      name: 'colorText',
      data (){
        return{
          windowPrint : '',
        }
      },
      props: {
        printSpeed: Number,
        printableText: String,
        printStatus: Boolean,
      },
      methods:{
        async slowPrint(content){
    
          const timer = ms => new Promise(res => setTimeout(res, ms))
    
          for (let index = 0; index < content.length; index++) {
            const element = content[index];
            this.windowPrint += element
             await timer(this.printSpeed);
          }
          this.$emit('printDone')
        }
      },
      watch: {
        printStatus: {
          handler() {
            this.slowPrint(this.printableText)
          },
        },
      },
      mounted(){
        if (this.printStatus) {
          this.slowPrint(this.printableText)
        }
      }
    }
    </script>
    
    