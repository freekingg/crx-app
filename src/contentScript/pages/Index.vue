<script setup lang="js">
import { ref, reactive, onMounted } from 'vue'
import {
  NButton,
  NForm,
  NInput,
  NSelect,
  NRadio,
  NFormItem,
  useMessage,
  NPopconfirm,
} from 'naive-ui'

const message = useMessage()
const rules = reactive({
  accountId: {
    required: true,
    message: '请选择账号',
    trigger: ['input'],
  },
  query: {
    required: true,
    message: '请选择账号',
    trigger: ['input'],
  },
})
let messageReactive = null

const formRef = ref(null)

const formValue = reactive({
  accountId: '',
  query: '',
  type: 1,
})
const accounts = ref([])
const aiCommands = ref([])
const loading = ref(false)

const getAccounts = () => {
  chrome.runtime.sendMessage({ action: 'GETACCOUNT' }, function (response) {
    console.log('账号列表:', response)
    if (response.data) {
      accounts.value = response.data
    }
  })
}

const getAiCommand = () => {
  chrome.runtime.sendMessage({ action: 'GETAICOMMAND' }, function (response) {
    console.log('命令列表:', response)
    if (response.data) {
      aiCommands.value = response.data
    }
  })
}

const handlePositiveClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      console.log(formValue)
      messageReactive = message.loading('提交中', { duration: 5000 })
      chrome.runtime.sendMessage({ action: 'GENARTICLE', data: formValue }, function (response) {
        console.log('提交文章结果:', response)
        // message.success('验证成功')
        if (messageReactive) {
          messageReactive.destroy()
          messageReactive = null
        }
      })
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}

const handleValidateSubmit = (e) => {
  e.preventDefault()
}

onMounted(() => {
  getAccounts()
  getAiCommand()
})
</script>

<template>
  <main>
    <h3 class="kk-h3">文章采集..</h3>
    <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="top">
      <n-form-item label="账号" path="accountId">
        <n-select
          :menu-props="{ style: { zIndex: 9999 } }"
          label-field="name"
          value-field="id"
          v-model:value="formValue.accountId"
          :options="accounts"
        />
      </n-form-item>

      <n-form-item label="内容" path="query">
        <n-input v-model:value="formValue.query" placeholder="内容" />
      </n-form-item>
      <n-form-item label="AI指令" path="age">
        <n-radio
          :value="item.id"
          name="basic-demo"
          v-for="(item, index) in aiCommands"
          :key="index"
          v-model:checked="formValue.type"
        >
          {{ item.title }}</n-radio
        >
      </n-form-item>
      <n-form-item>
        <n-popconfirm @positive-click="handlePositiveClick">
          <template #trigger>
            <n-button
              style="width: 100%"
              attr-type="button"
              color="#8a2be2"
              :loading="loading"
              @click="handleValidateSubmit"
            >
              采集
            </n-button>
          </template>
          确认是否执行。
        </n-popconfirm>
      </n-form-item>
    </n-form>
  </main>
</template>

<style>
.kk-h3 {
  color: #42b983;
  text-transform: uppercase;
  font-weight: 200;
  text-align: center;
}
</style>
