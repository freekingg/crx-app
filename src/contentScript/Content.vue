<script setup lang="js">
import { ref,reactive,defineAsyncComponent } from 'vue'
const Index = defineAsyncComponent(() => import("./pages/Index.vue"));

const page = reactive({
    component: Index
})

</script>

<template>
  <main id="kk-container">
    <component :is="page.component"></component>
  </main>
</template>
<style>
#kk-container {
  position: fixed;
  z-index: 99999;
  background-color: aliceblue;
  right: 0;
  top: 0;
  width: 300px;
}



</style>
