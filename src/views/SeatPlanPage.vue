<template>
  <div class="seat-plan-page">
    <div class="mb-6">
      <button 
        @click="$router.back()"
        class="text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Geri Dön
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Koltuklar yükleniyor...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Koltuk Seçimi</h1>
        <p class="text-gray-600 mb-4">{{ selectedEvent?.title }}</p>
        <p class="text-gray-700">
          <span class="font-semibold">Kategori:</span> {{ selectedCategory?.name }} - {{ selectedCategory?.price }} ₺
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="bg-gray-800 text-white text-center py-4 mb-8 rounded">
          <span class="text-lg font-semibold">SAHNE</span>
        </div>

        <div v-if="seats.length === 0 && !loading && !error" class="text-center py-12">
          <p class="text-gray-500">Bu kategori için koltuk bulunmuyor.</p>
        </div>

        <div class="overflow-x-auto">
          <div class="inline-block min-w-full">
            <div v-for="row in groupedSeats" :key="row.row" class="flex justify-center mb-2">
              <div class="w-12 flex items-center justify-center font-semibold text-gray-700">
                {{ row.row }}
              </div>
              <div class="flex gap-2">
                <button
                  v-for="seat in row.seats"
                  :key="seat.id"
                  @click="toggleSeat(seat)"
                  :disabled="seat.isBooked"
                  :class="getSeatClass(seat)"
                  class="w-10 h-10 rounded-md transition duration-200 text-sm font-medium"
                >
                  {{ seat.seat }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span>Müsait</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center">✓</div>
            <span>Seçili</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-400 rounded"></div>
            <span>Dolu</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-gray-700">Seçili Koltuk Sayısı: <span class="font-bold">{{ selectedSeats.length }}</span></p>
            <p class="text-2xl font-bold text-indigo-600">Toplam: {{ totalPrice }} ₺</p>
          </div>
          <button
            @click="goToPayment"
            :disabled="selectedSeats.length === 0"
            class="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Ödemeye Geç
          </button>
        </div>
        <div v-if="selectedSeats.length > 0" class="text-sm text-gray-600">
          <span class="font-medium">Seçili koltuklar:</span>
          {{ formatSeats }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { seatPlanService } from '../services/seatPlan'
import { mapGetters } from 'vuex'

export default {
  name: 'SeatPlanPage',
  data() {
    return {
      seats: [],
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['selectedSeats', 'selectedEvent', 'selectedCategory', 'totalPrice']),
    groupedSeats() {
      const groups = {}
      this.seats.forEach(seat => {
        if (!groups[seat.row]) {
          groups[seat.row] = { row: seat.row, seats: [] }
        }
        groups[seat.row].seats.push(seat)
      })
      
      Object.values(groups).forEach(group => {
        group.seats.sort((a, b) => a.seat - b.seat)
      })
      
      return Object.values(groups).sort((a, b) => a.row.localeCompare(b.row))
    },
    formatSeats() {
      if (!this.selectedSeats || this.selectedSeats.length === 0) {
        return '-'
      }
      return this.selectedSeats
        .filter(s => s && s.row && s.seat)
        .map(s => `${s.row}${s.seat}`)
        .join(', ') || '-'
    }
  },
  created() {
    if (!this.selectedEvent || !this.selectedCategory) {
      this.$router.push('/')
      return
    }
    this.fetchSeatPlan()
  },
  watch: {
    '$route.params.categoryId': {
      immediate: false,
      handler(newCategoryId, oldCategoryId) {
        if (oldCategoryId && newCategoryId !== oldCategoryId) {
          this.$store.dispatch('setSelectedSeats', [])
        }
      }
    }
  },
  methods: {
    async fetchSeatPlan() {
      this.loading = true
      this.error = null
      try {
        const { eventId, categoryId } = this.$route.params
        const response = await seatPlanService.get(eventId, categoryId)
        this.seats = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    toggleSeat(seat) {
      if (seat.isBooked) return
      this.$store.dispatch('selectSeat', seat)
    },
    getSeatClass(seat) {
      if (seat.isBooked) {
        return 'bg-gray-400 cursor-not-allowed text-white'
      }
      const isSelected = this.selectedSeats.some(s => s.id === seat.id)
      if (isSelected) {
        return 'bg-indigo-600 text-white hover:bg-indigo-700'
      }
      return 'bg-gray-200 border-2 border-gray-300 hover:border-indigo-400 hover:bg-gray-100'
    },
    goToPayment() {
      if (this.selectedSeats.length === 0) return
      this.$router.push({ name: 'Payment' })
    }
  }
}
</script>
