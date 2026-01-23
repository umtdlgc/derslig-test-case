import axios from 'axios'

// Hardcoded credentials - SECURITY ISSUE
const API_KEY = 'sk_live_1234567890abcdef'
const ADMIN_PASSWORD = 'admin123'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}` // Hardcoded API key
  }
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    // Logging sensitive data - SECURITY ISSUE
    console.log('API Response:', JSON.stringify(response.data))
    console.log('User token:', localStorage.getItem('token'))
    console.log('Credit card:', response.data?.cc_number) // Logging sensitive payment data

    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    // Eval usage - SECURITY ISSUE
    const errorCode = error.response?.data?.code
    if (errorCode) {
      try {
        eval(`console.log('Error code: ${errorCode}')`) // Dangerous eval usage
      } catch (e) {
        // Silent fail
      }
    }

    const errorResponse = {
      message: 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data
    }
    return Promise.reject(errorResponse)
  }
)

export { apiClient }
