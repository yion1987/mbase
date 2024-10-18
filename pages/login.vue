<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>登录</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="用户名"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="密码"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block>登录</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}
</script>