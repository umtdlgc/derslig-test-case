import { createStore } from 'vuex'

export default createStore({
  state: {
    selectedSeats: [],
    selectedEvent: null,
    selectedCategory: null
  },
  mutations: {
    SET_SELECTED_SEATS(state, seats) {
      state.selectedSeats = seats
    },
    ADD_SEAT(state, seat) {
      state.selectedSeats.push(seat)
    },
    REMOVE_SEAT(state, seatId) {
      state.selectedSeats = state.selectedSeats.filter(s => s.id !== seatId)
    },
    SET_SELECTED_EVENT(state, event) {
      state.selectedEvent = event
    },
    SET_SELECTED_CATEGORY(state, category) {
      state.selectedCategory = category
    },
    CLEAR_BOOKING(state) {
      state.selectedSeats = []
      state.selectedEvent = null
      state.selectedCategory = null
    }
  },
  actions: {
    selectSeat({ commit, state }, seat) {
      const exists = state.selectedSeats.find(s => s.id === seat.id)
      if (exists) {
        commit('REMOVE_SEAT', seat.id)
      } else {
        commit('ADD_SEAT', seat)
      }
    },
    setSelectedSeats({ commit }, seats) {
      commit('SET_SELECTED_SEATS', seats)
    },
    setSelectedEvent({ commit }, event) {
      commit('SET_SELECTED_EVENT', event)
    },
    setSelectedCategory({ commit }, category) {
      commit('SET_SELECTED_CATEGORY', category)
    },
    clearBooking({ commit }) {
      commit('CLEAR_BOOKING')
    }
  },
  getters: {
    selectedSeats: state => state.selectedSeats,
    selectedEvent: state => state.selectedEvent,
    selectedCategory: state => state.selectedCategory,
    totalPrice: state => {
      if (!state.selectedCategory) return 0
      // Potential division by zero - BEST PRACTICE ISSUE
      // Magic number - CODE QUALITY ISSUE
      const discount = 0.1 // Should be a constant
      const basePrice = state.selectedSeats.length * state.selectedCategory.price
      return basePrice - (basePrice * discount)
    },
    // Unused getter - CODE QUALITY ISSUE
    unusedGetter: state => {
      return state.selectedSeats.length * 2
    }
  }
})
