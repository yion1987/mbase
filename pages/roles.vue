<template>
  <v-container>
    <h2>{{ $t('roles') }}</h2>
    <v-data-table :headers="headers" :items="roles" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>角色列表</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">
                新增角色
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="角色名称"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  取消
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const roles = ref([])
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  name: '',
})
const defaultItem = {
  id: null,
  name: '',
}

const formTitle = computed(() => {
  return editedIndex.value === -1 ? '新增角色' : '编辑角色'
})

const headers = [
  { title: '角色名称', key: 'name' },
  { title: '操作', key: 'actions', sortable: false },
]

const { $fetch } = useNuxtApp()

onMounted(async () => {
  try {
    roles.value = await $fetch('/api/roles')
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    showError('获取角色列表失败')
  }
})

const editItem = (item) => {
  editedIndex.value = roles.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const deleteItem = async (item) => {
  if (confirm('确定要删除这个角色吗？')) {
    try {
      await $fetch(`/api/roles/${item.id}`, { method: 'DELETE' })
      const index = roles.value.indexOf(item)
      roles.value.splice(index, 1)
      showSuccess('角色删除成功')
    } catch (error) {
      console.error('Failed to delete role:', error)
      showError('删除角色失败')
    }
  }
}

const close = () => {
  dialog.value = false
  editedIndex.value = -1
  editedItem.value = Object.assign({}, defaultItem)
}

const save = async () => {
  try {
    if (editedIndex.value > -1) {
      const updatedRole = await $fetch(`/api/roles/${editedItem.value.id}`, {
        method: 'PUT',
        body: editedItem.value,
      })
      Object.assign(roles.value[editedIndex.value], updatedRole)
      showSuccess('角色更新成功')
    } else {
      const newRole = await $fetch('/api/roles', {
        method: 'POST',
        body: editedItem.value,
      })
      roles.value.push(newRole)
      showSuccess('角色创建成功')
    }
    close()
  } catch (error) {
    console.error('Failed to save role:', error)
    showError('保存角色失败')
  }
}

const showSuccess = (message) => {
  // 使用 Vuetify 的 snackbar 或其他通知组件显示成功消息
}

const showError = (message) => {
  // 使用 Vuetify 的 snackbar 或其他通知组件显示错误消息
}
</script>