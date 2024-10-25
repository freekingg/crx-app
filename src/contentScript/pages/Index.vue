<script setup lang="js">
import { ref } from 'vue'
import { NButton } from 'naive-ui'


const link = ref('https://github.com/guocaoyi/create-chrome-ext')
</script>

<template>
  <main>
    <h3 class="kk-h3">Index Page</h3>
    <n-button>naive-ui</n-button>
  </main>
</template>

<style>
.kk-h3 {
  color: #42b983;
  text-transform: uppercase;
  font-weight: 200;
  margin: 2rem auto;
  text-align: center;
}


</style>
