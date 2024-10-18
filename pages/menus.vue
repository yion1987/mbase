<template>
  <v-container>
    <h2>{{ $t('menus') }}</h2>
    <v-data-table :headers="headers" :items="menus" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>菜单列表</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">
                新增菜单
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
                      <v-text-field v-model="editedItem.name" label="菜单名称"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.path" label="路径"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.icon" label="图标"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select v-model="editedItem.roleId" :items="roles" item-title="name" item-value="id" label="角色"></v-select>
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

const menus = ref([])
const roles = ref([])
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  name: '',
  path: '',
  icon: '',
  roleId: null,
})
const defaultItem = {
  id: null,
  name: '',
  path: '',
  icon: '',
  roleId: null,
}

const formTitle = computed(() => {
  return editedIndex.value === -1 ? '新增菜单' : '编辑菜单'
})

const headers = [
  { title: '菜单名称', key: 'name' },
  { title: '路径', key: 'path' },
  { title: '图标', key: 'icon' },
  { title: '角色', key: 'role.name' },
  { title: '操作', key: 'actions', sortable: false },
]

const { $fetch } = useNuxtApp()

onMounted(async () => {
  try {
    menus.value = await $fetch('/api/menus')
    roles.value = await $fetch('/api/roles')
  } catch (error) {
    console.error('Failed to fetch data:', error)
    showError('获取数据失败')
  }
})

const editItem = (item) => {
  editedIndex.value = menus.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const deleteItem = async (item) => {
  if (confirm('确定要删除这个菜单吗？')) {
    try {
      await $fetch(`/api/menus/${item.id}`, { method: 'DELETE' })
      const index = menus.value.indexOf(item)
      menus.value.splice(index, 1)
      showSuccess('菜单删除成功')
    } catch (error) {
      console.error('Failed to delete menu:', error)
      showError('删除菜单失败')
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
      const updatedMenu = await $fetch(`/api/menus/${editedItem.value.id}`, {
        method: 'PUT',
        body: editedItem.value,
      })
      Object.assign(menus.value[editedIndex.value], updatedMenu)
      showSuccess('菜单更新成功')
    } else {
      const newMenu = await $fetch('/api/menus', {
        method: 'POST',
        body: editedItem.value,
      })
      menus.value.push(newMenu)
      showSuccess('菜单创建成功')
    }
    close()
  } catch (error) {
    console.error('Failed to save menu:', error)
    showError('保存菜单失败')
  }
}

const showSuccess = (message) => {
  // 使用 Vuetify 的 snackbar 或其他通知组件显示成功消息
}

const showError = (message) => {
  // 使用 Vuetify 的 snackbar 或其他通知组件显示错误消息
}
</script>