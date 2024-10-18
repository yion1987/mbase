import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(username, password) {
      const { $fetch } = useNuxtApp()
      try {
        // 发送登录请求
        const { token, user } = await $fetch('/api/auth', {
          method: 'POST',
          body: { username, password },
        })
        // 更新状态
        this.user = user
        this.token = token
        // 将 token 存储到 localStorage
        localStorage.setItem('token', token)
      } catch (error) {
        throw new Error('登录失败')
      }
    },
    logout() {
      // 清除用户信息和 token
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
})