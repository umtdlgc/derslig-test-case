<template>
  <div class="event-detail-page">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Etkinlik yükleniyor...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="event" class="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        :src="event.image_url" 
        :alt="event.title"
        class="w-full h-96 object-cover"
      />
      
      <div class="p-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">{{ event.title }}</h1>
        
        <div class="mb-6">
          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Mekan:</span> {{ event.venue.name }}
          </p>
          <p class="text-gray-600 text-sm mb-4">
            {{ event.venue.address }}
          </p>
          <p class="text-gray-700">
            <span class="font-semibold">Tarih:</span> {{ formatEventDate(event.event_date) }}
          </p>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Açıklama</h2>
          <p class="text-gray-600 leading-relaxed">{{ event.description }}</p>
        </div>

        <div class="border-t pt-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Kategori Seçin</h2>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Bilet Kategorisi
            </label>
            <select 
              v-model="selectedCategory"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option :value="null" disabled>Kategori seçiniz...</option>
              <option 
                v-for="category in event.event_categories" 
                :key="category.id"
                :value="category"
              >
                {{ category.name }} - {{ category.price }} ₺
              </option>
            </select>
          </div>

          <button
            @click="goToSeatSelection"
            :disabled="!selectedCategory"
            class="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Koltuk Seçimine Geç
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventService } from '../services/events'
import { formatEventDate } from '../utils/date'

export default {
  name: 'EventDetailPage',
  data() {
    return {
      event: null,
      selectedCategory: null,
      loading: false,
      error: null
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newEventId, oldEventId) {
        if (oldEventId && newEventId !== oldEventId) {
          this.$store.dispatch('clearBooking')
        }
        this.fetchEvent()
      }
    }
  },
  methods: {
    async fetchEvent() {
      this.loading = true
      this.error = null
      try {
        const eventId = this.$route.params.id
        const response = await eventService.getById(eventId)
        this.event = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    goToSeatSelection() {
      if (!this.selectedCategory) return
      
      this.$store.dispatch('setSelectedSeats', [])
      this.$store.dispatch('setSelectedEvent', this.event)
      this.$store.dispatch('setSelectedCategory', this.selectedCategory)
      
      this.$router.push({
        name: 'SeatPlan',
        params: {
          eventId: this.event.id,
          categoryId: this.selectedCategory.id
        }
      })
    },
    formatEventDate
  }
}
</script>
