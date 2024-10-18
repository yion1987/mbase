<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t('welcome') }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>

    <GlobalNotification ref="globalNotification" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const drawer = ref(false)
const menuItems = [
  { title: t('users'), icon: 'mdi-account-multiple', to: '/users' },
  { title: t('roles'), icon: 'mdi-shield-account', to: '/roles' },
  { title: t('menus'), icon: 'mdi-menu', to: '/menus' },
]
</script>