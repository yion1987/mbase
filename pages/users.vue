<script setup>
// ... 其他导入和代码 ...

const { $showNotification } = useNuxtApp()

// ... 其他代码 ...

const save = async () => {
  try {
    if (editedIndex.value > -1) {
      const updatedUser = await $fetch(`/api/users/${editedItem.value.id}`, {
        method: 'PUT',
        body: editedItem.value,
      })
      Object.assign(users.value[editedIndex.value], updatedUser)
      $showNotification('用户更新成功', 'success')
    } else {
      const newUser = await $fetch('/api/users', {
        method: 'POST',
        body: editedItem.value,
      })
      users.value.push(newUser)
      $showNotification('用户创建成功', 'success')
    }
    close()
  } catch (error) {
    console.error('Failed to save user:', error)
    $showNotification('保存用户失败', 'error')
  }
}

// ... 其他代码 ...
</script>