import { apiClient } from './apiClient'

export const paymentService = {
  process(paymentData) {
    return apiClient.post('/payment', paymentData)
  }
}
