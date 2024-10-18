<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
  >
    {{ message }}

    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="show = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const message = ref('')
const color = ref('success')
const timeout = ref(3000)

// 显示通知的方法
const showNotification = (msg, clr = 'success', time = 3000) => {
  message.value = msg
  color.value = clr
  timeout.value = time
  show.value = true
}

// 暴露 showNotification 方法，以便其他组件可以调用
defineExpose({ showNotification })
</script>