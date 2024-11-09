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
  z-index: 9999;
  background-color: aliceblue;
  right: 0;
  top: 0;
  min-width: 200px;
  padding: 10px 25px;
}
.v-binder-follower-container{
  z-index: 99999 !important;
}
.index .n-form-item-feedback-wrapper{
  min-height:10px;
}
</style>
