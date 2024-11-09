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
  NAlert,
} from 'naive-ui'
import { setItem, getItem } from '../utils'

const message = useMessage()
const rules = reactive({
  accountId: {
    required: true,
    message: '请选择账号',
    trigger: ['input'],
  },
  // query: {
  //   required: true,
  //   message: '请选择账号',
  //   trigger: ['input'],
  // },
})
let messageReactive = null

const formRef = ref(null)

const formValue = reactive({
  accountId: '',
  query: '',
  type: 1,
  imgList: [],
})
const accounts = ref([])
const aiCommands = ref([])
const loading = ref(false)
const disabled = ref(false)
const webType = ref()

const getAccounts = () => {
  chrome.runtime.sendMessage({ action: 'GETACCOUNT' }, function (response) {
    console.log('账号列表:', response)
    if (response.data) {
      accounts.value = response.data

      // 读取数据
      getItem('accountId').then((value) => {
        if (value) {
          formValue.accountId = value
        }
      })
      getItem('aiCommand').then((value) => {
        if (value) {
          formValue.type = value
        }
      })
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

const contentHandle = () => {
  if (webType.value === 'sohu') {
    let title = document.querySelector('#article-container .main .text-title h1')
    formValue.query = title.innerText

    let imgs = document.querySelectorAll('#article-container .main .text .ql-align-center img')
    if (imgs.length) {
      formValue.imgList = Array.from(imgs).map((item) => item.src)
    }
  } else if (webType.value === 'baijiahao' || webType.value === 'mbd') {
    let title = document.querySelector('#header > div')
    formValue.query = title.innerText

    let imgs = document.querySelectorAll('div[data-testid="article"] img')
    if (imgs.length) {
      formValue.imgList = Array.from(imgs).map((item) => item.src)
    }
  }
  if (!formValue.query) {
    return message.error('内容不可为空')
  } else if (!formValue.imgList) {
    return message.error('图片不可为空')
  } else {
    loading.value = true
    messageReactive = message.loading('提交中', { duration: 5000 })
    chrome.runtime.sendMessage({ action: 'GENARTICLE', data: formValue }, function (response) {
      console.log('提交文章结果:', response)
      // message.success('验证成功')
      formValue.query = ''
      formValue.imgList = []
      if (messageReactive) {
        messageReactive.destroy()
        messageReactive = null
      }
    })
  }
}

const handleUpdateValue = (value) => {
  console.log('value: ', value)
  // 存储数据
  setItem('accountId', value).then(() => {
    console.log('数据存储成功')
  })
}

const handleTypeUpdateValue = (value) => {
  setItem('aiCommand', value).then(() => {
    console.log('数据存储成功')
  })
}

const handlePositiveClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      contentHandle()
    } else {
      console.log(errors)
      message.error('验证失败')
    }
  })
}

const handleValidateSubmit = (e) => {
  e.preventDefault()
}

const matchHost = () => {
  let href = location.href
  let allowHost = [
    { host: 'sohu.com/a', type: 'sohu' },
    { host: 'https://baijiahao.baidu.com/', type: 'baijiahao' },
    { host: 'https://mbd.baidu.com/', type: 'mbd' },
  ]
  let matchedElement = allowHost.find((item) => href.includes(item.host))
  if (matchedElement) {
    webType.value = matchedElement.type
    disabled.value = false
  } else {
    disabled.value = true
  }
}

onMounted(() => {
  getAccounts()
  getAiCommand()
  matchHost()
})
</script>

<template>
  <main class="index">
    <h3 class="kk-h3">文章采集..</h3>
    <n-form
      ref="formRef"
      size="small"
      :model="formValue"
      :rules="rules"
      label-width="60"
      label-placement="left"
    >
      <n-form-item label="账号" path="accountId">
        <n-select
          :menu-props="{ style: { zIndex: 9999 } }"
          label-field="name"
          value-field="id"
          v-model:value="formValue.accountId"
          :options="accounts"
          @update:value="handleUpdateValue"
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
          @change="handleTypeUpdateValue"
        >
          {{ item.title }}</n-radio
        >
      </n-form-item>
      <n-alert type="info" :bordered="false"> 图片：{{ formValue.imgList.length }} 张 </n-alert>

      <n-form-item>
        <n-popconfirm @positive-click="handlePositiveClick">
          <template #trigger>
            <n-button
              style="width: 100%"
              attr-type="button"
              color="#8a2be2"
              :loading="loading"
              :disabled="disabled"
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

<style scoped>
.kk-h3 {
  color: #42b983;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  margin-bottom: 7px;
}
</style>
