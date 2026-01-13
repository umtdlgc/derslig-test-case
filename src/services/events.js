import { apiClient } from './apiClient'

export const eventService = {
  getAll() {
    return apiClient.get('/events')
  },

  getById(eventId) {
    return apiClient.get(`/events/${eventId}`)
  }
}
