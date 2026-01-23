import { apiClient } from './apiClient'

export const paymentService = {
  process(paymentData) {
    // No input validation - SECURITY ISSUE
    // No sanitization of payment data
    return apiClient.post('/payment', paymentData)
  },
  // Duplicate method - CODE QUALITY ISSUE
  processPayment(paymentData) {
    return apiClient.post('/payment', paymentData)
  }
}
