<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    EmptyLayout
  },
  setup() {
    const route = useRoute()
    const layout = computed(() => route.meta.layout || 'DefaultLayout')
    return { layout }
  }
}
</script>
