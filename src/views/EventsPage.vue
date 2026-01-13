<template>
  <div class="events-page">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Etkinlikler</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Etkinlikler yükleniyor...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="events.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Henüz Etkinlik Yok</h3>
      <p class="text-gray-500">Şu anda görüntülenecek etkinlik bulunmuyor.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="event in events" 
        :key="event.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
        @click="goToEventDetail(event.id)"
      >
        <img 
          :src="event.image_url" 
          :alt="event.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ event.title }}</h2>
          <p class="text-gray-600 mb-2">
            <span class="font-medium">{{ event.venue.name }}</span>
          </p>
          <p class="text-gray-500 text-sm">
            {{ formatEventDate(event.event_date) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventService } from '../services/events'
import { formatEventDate } from '../utils/date'

export default {
  name: 'EventsPage',
  data() {
    return {
      events: [],
      loading: false,
      error: null
    }
  },
  created() {
    this.fetchEvents()
  },
  mounted() {
    this.$store.dispatch('clearBooking')
  },
  methods: {
    async fetchEvents() {
      this.loading = true
      this.error = null
      try {
        const response = await eventService.getAll()
        this.events = response.data || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    goToEventDetail(eventId) {
      this.$router.push({ name: 'EventDetail', params: { id: eventId } })
    },
    formatEventDate
  }
}
</script>
