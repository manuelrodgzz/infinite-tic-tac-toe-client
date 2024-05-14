<script setup>
import { computed } from 'vue'
import Menubar from 'primevue/menubar'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  {
    label: 'Local',
    icon: 'pi pi-desktop',
    to: '/'
  },
  {
    label: 'Online',
    icon: 'pi pi-globe',
    to: '/online'
  }
]

const items = computed(() => {
  const path = router.currentRoute.value.path

  return menuItems.map(({ to, ...itemData }) => ({
    ...itemData,
    command: () => router.push(to),
    class: `menu-item ${path === to ? 'active' : ''}`
  }))
})
</script>

<template>
  <Menubar class="menu" :model="items">
    <template #start>
      <span class="app-title">I N F I N I T E | Tic-Tac-Toe</span>
    </template>
  </Menubar>
</template>

<style>
.menu {
  justify-content: space-between;
}

.menu .menu-item.active span {
  color: rgb(57, 177, 247);
}

.app-title {
  color: rgb(255, 73, 73);
  font-weight: 600;
}
</style>
