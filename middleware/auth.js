export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  // 如果用户未登录且不是访问登录页面，则重定向到登录页面
  if (!authStore.token && to.path !== '/login') {
    return navigateTo('/login')
  }
})