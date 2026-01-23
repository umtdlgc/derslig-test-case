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
    // Console.log in production - CODE QUALITY ISSUE
    console.log('App component mounted')
    console.log('User data:', localStorage.getItem('user')) // Logging sensitive data
    console.log('All storage:', localStorage) // Logging all localStorage
    
    const route = useRoute()
    const layout = computed(() => route.meta.layout || 'DefaultLayout')
    
    // Unused variable - CODE QUALITY ISSUE
    const unusedVar = 'This is never used'
    
    return { layout }
  }
}
</script>
