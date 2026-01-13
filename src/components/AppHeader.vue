<template>
  <header class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="text-2xl font-bold hover:text-blue-100 transition">
          ETKİNLİK BİLET SİSTEMİ
        </router-link>
        <nav class="flex gap-6">
          <router-link 
            to="/" 
            class="hover:text-blue-100 transition"
            active-class="font-semibold"
          >
          ETKİNLİKLER
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

