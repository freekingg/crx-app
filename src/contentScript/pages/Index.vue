<script setup lang="js">
import { ref, reactive, onMounted } from 'vue'
import {
  NButton,
  NForm,
  NInput,
  NSelect,
  NRadio,
  NRadioGroup,
  NFormItem,
  NIcon,
  useMessage,
  createDiscreteApi,
  NPopconfirm,
  NAlert,
} from 'naive-ui'
const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ["message", "dialog", "notification", "loadingBar", "modal"],
  
);
import { setItem, getItem } from '../utils'
import { allowHost } from '../data'

// const message = useMessage()
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
  queryTempId: '',
  articleTempId: '',
  imgList: [],
})
const accounts = ref([])
const aiCommands = ref([])
const styleCommands = ref([])
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
      getItem('queryTempId').then((value) => {
        if (value) {
          formValue.queryTempId = value
        }
      })
      getItem('articleTempId').then((value) => {
        console.log('value: ', value);
        if (value) {
          formValue.articleTempId = value
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

const getStyleCommand = () => {
  chrome.runtime.sendMessage({ action: 'GETSTYLECOMMAND' }, function (response) {
    console.log('样式列表:', response)
    if (response.data) {
      styleCommands.value = response.data
    }
  })
}

const contentHandle = () => {
  let aiType = ''

  let target = aiCommands.value.find((item) => item.id === formValue.queryTempId)
  if (!target) {
    return message.error('AI指定未选择')
  }

  if (target.title.indexOf('分析网址') !== -1) {
    aiType = 'fenxiwangzhi'
  }

  let titleDom = ''
  let imgsDom = ''
  if (webType.value === 'sohu') {
    titleDom = document.querySelector('#article-container .main .text-title h1')
    imgsDom = document.querySelectorAll('#article-container .main .text .article img')
  } else if (webType.value === 'baijiahao' || webType.value === 'mbd') {
    titleDom = document.querySelector('#header > div')
    imgsDom = document.querySelectorAll('div[data-testid="article"] img')
  } else if (webType.value === 'weixin') {
    titleDom = document.querySelector('#activity-name')
    imgsDom = document.querySelectorAll('#js_content img')
  } else if (webType.value === '163') {
    titleDom = document.querySelector('h1.post_title')
    imgsDom = document.querySelectorAll('.post_body img')
  } else if (webType.value === 'toutiao') {
    titleDom = document.querySelector('.article-content h1')
    imgsDom = document.querySelectorAll('.tt-article-content img')
  } else if (webType.value === 'qq') {
    titleDom = document.querySelector('.content-article h1')
    imgsDom = document.querySelectorAll('.rich_media_content img')
  } else if (webType.value === 'zhihu') {
    titleDom = document.querySelector('h1.Post-Title')
    imgsDom = document.querySelectorAll('.RichText img')
  }

  if (target.title.indexOf('分析网址') !== -1) {
    formValue.query = location.href
  } else {
    formValue.query = titleDom.innerText
  }
  if (imgsDom.length) {
    formValue.imgList = Array.from(imgsDom).map((item) => item.src)
  }

  if (!formValue.query) {
    return message.error('内容不可为空')
  } else if (!formValue.imgList) {
    return message.error('图片不可为空')
  } else {


    loading.value = true
    messageReactive = message.loading('提交中', { duration: 0 })

    chrome.runtime.sendMessage({ action: 'GENARTICLE', data: formValue }, function (response) {
      console.log('提交文章结果:', response)
      message.success('提交文章成功')
      setTimeout(() => {
        formValue.query = ''
        formValue.imgList = []
        loading.value = false
        if (messageReactive) {
          messageReactive.destroy()
          messageReactive = null
        }
      }, 5000)
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

const handleTypeUpdateValue = (e) => {
  setItem('queryTempId', e.target.value).then(() => {
    console.log('数据存储成功')
  })
}

const handleStyleUpdateValue = (e) => {
  setItem('articleTempId', e.target.value).then(() => {
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
  getStyleCommand()
  matchHost()
})
</script>

<template>
  <main class="kk-index">
    <h3 class="kk-h3">文章采集..</h3>
    <n-form
      ref="formRef"
      size="small"
      :model="formValue"
      :rules="rules"
      label-width="70"
      label-placement="left"
      style="display: block !important"
    >
      <n-form-item label="账号" path="accountId">
        <n-select
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
        <n-radio-group
          v-model:value="formValue.queryTempId"
          name="radiogroup"
          @change="handleTypeUpdateValue"
        >
          <n-radio :value="item.id" v-for="(item, index) in aiCommands" :key="item.id">
            {{ item.title }}</n-radio
          >
        </n-radio-group>
      </n-form-item>
      <n-form-item label="样式模板" path="articleTempId">
        <n-radio-group
          v-model:value="formValue.articleTempId"
          name="radiogroup"
          @change="handleStyleUpdateValue"
        >
          <n-radio :value="item.id" v-for="(item, index) in styleCommands" :key="item.id">
            {{ item.title }}</n-radio
          >
        </n-radio-group>
      </n-form-item>
      <n-alert type="info" :bordered="false"> 图片：{{ formValue.imgList.length }} 张 </n-alert>
      <p style="font-size: 14px; margin: 4px 0; color: #b0781a">采集前，需要浏览完当前网页</p>
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
          确认是否执行?。
        </n-popconfirm>
      </n-form-item>
    </n-form>
  </main>
</template>

<style>

</style>
