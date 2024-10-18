export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide('showNotification', (message, color = 'success', timeout = 3000) => {
    const notificationComponent = nuxtApp.vueApp.config.globalProperties.$refs.globalNotification
    if (notificationComponent) {
      notificationComponent.showNotification(message, color, timeout)
    }
  })
})