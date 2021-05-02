<template>

  <div id = "app" :style="cssProps">
    <HelloWorld />
  </div>
</template>


<script>
import HelloWorld from "@/components/main.vue";


export default {
  name: 'App',
  data() {
    return {
      cssProps: {
        backgroundImage: 'url(' + require('./assets/landscape.png') + ')',
      }
    }
  },
  methods: {
  },
  components: {
    HelloWorld: HelloWorld
  },
  metaInfo: {
    script: [
        { src: "https://unpkg.com/axios/dist/axios.min.js", async: true, defer: true },
        { src: "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js", async: true, defer: true },
        { src: "https://code.jquery.com/jquery-3.6.0.min.js", async: true, defer: true }
    ]
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
  height: auto !important;
  height: 100%;
  background-size:     cover;
  background-repeat:   no-repeat;
}

html, body {
  height: 99%;
  background-color: cornsilk;
}


</style>
