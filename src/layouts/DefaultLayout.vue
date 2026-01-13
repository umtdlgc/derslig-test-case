<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader
  }
}
</script>
