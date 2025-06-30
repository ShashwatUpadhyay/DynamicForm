<template>
  <v-container>
    {{ items }}
      <div v-for="item in items" :key="item">
        <p>{{ item }}</p>
      </div>
      {{ value }}
      <v-btn elevation="2" v-on:click="increment()">Click Me</v-btn>
      <input type="text" @change="valueChanged()"  />
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      items : [ "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" ],
      value: 1
    }),
    methods : {

      increment(){
        this.value += 1;
      },

      valueChanged(){
        console.log("Value changed to: " + this.value);
      }
      
    }
  }
</script>
