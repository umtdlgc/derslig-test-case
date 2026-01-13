import { apiClient } from './apiClient'

export const seatPlanService = {
  get(eventId, categoryId) {
    return apiClient.get(`/seat-plans/${eventId}/${categoryId}`)
  }
}
