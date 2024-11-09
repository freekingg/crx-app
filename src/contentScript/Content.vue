<script setup lang="js">
import { ref, reactive, defineAsyncComponent } from 'vue'
const Index = defineAsyncComponent(() => import('./pages/Index.vue'))
import { NMessageProvider } from 'naive-ui'

const page = reactive({
  component: Index,
})
</script>

<template>
  <main id="kk-container">
    <n-message-provider>
      <component :is="page.component"></component>
    </n-message-provider>
  </main>
</template>
<style>
#kk-container {
  position: fixed;
  z-index: 1;
  background-color: aliceblue;
  right: 0;
  top: 0;
  width: 300px;
  padding: 10px 25px;
}
</style>
