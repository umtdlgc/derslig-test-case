<template>
  <div class="payment-page">
    <div class="mb-6">
      <button 
        @click="$router.back()"
        class="text-indigo-600 hover:text-indigo-800 font-medium"
      >
        ← Geri Dön
      </button>
    </div>

    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Ödeme Bilgileri</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-8 border border-transparent">
            <form @submit.prevent="submitPayment">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Ad</label>
                  <input
                    v-model="form.customerName"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Adınız"
                    @blur="validateCustomerName"
                  />
                  <p v-if="validationErrors.customerName" class="text-red-500 text-xs mt-1">{{ validationErrors.customerName }}</p>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Soyad</label>
                  <input
                    v-model="form.customerSurname"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Soyadınız"
                    @blur="validateCustomerSurname"
                  />
                  <p v-if="validationErrors.customerSurname" class="text-red-500 text-xs mt-1">{{ validationErrors.customerSurname }}</p>
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">E-posta</label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ornek@email.com"
                  @blur="validateEmail"
                />
                <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
              </div>

              <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-6">Kart Bilgileri</h2>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Kart Numarası</label>
                <input
                  v-model="form.ccNumber"
                  type="text"
                  maxlength="19"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1111 1111 1111 1111"
                  @input="formatCardNumber"
                  @blur="validateCardNumber"
                />
                <p v-if="validationErrors.cardNumber" class="text-red-500 text-xs mt-1">{{ validationErrors.cardNumber }}</p>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Ay</label>
                  <input
                    v-model.number="form.ccExpMonth"
                    type="number"
                    min="1"
                    max="12"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="MM"
                    @blur="validateExpiry"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Yıl</label>
                  <input
                    v-model.number="form.ccExpYear"
                    type="number"
                    min="26"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="YY"
                    @blur="validateExpiry"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">CVV</label>
                  <input
                    v-model.number="form.ccCvv"
                    type="text"
                    maxlength="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123"
                    @blur="validateCvv"
                    @input="limitCvvInput"
                  />
                </div>
              </div>
              <p v-if="validationErrors.expiry" class="text-red-500 text-xs -mt-4 mb-4">{{ validationErrors.expiry }}</p>
              <p v-if="validationErrors.cvv" class="text-red-500 text-xs -mt-4 mb-4">{{ validationErrors.cvv }}</p>

              <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <!-- XSS Vulnerability - using v-html with user input -->
                <div v-html="error"></div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span v-if="loading">İşleniyor...</span>
                <span v-else>Ödemeyi Tamamla</span>
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-transparent">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Sipariş Özeti</h2>
            
            <div class="mb-4">
              <p class="text-gray-700 font-medium mb-1">{{ selectedEvent?.title }}</p>
              <p class="text-sm text-gray-600">{{ selectedCategory?.name }}</p>
            </div>

            <div class="border-t border-gray-200 pt-4 mb-4">
              <p class="text-sm text-gray-600 mb-2">Koltuklar:</p>
              <p class="text-sm font-medium text-gray-700">
                {{ formatSeats }}
              </p>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-700">Bilet Adedi:</span>
                <span class="font-medium text-gray-700">{{ selectedSeats.length }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-700">Bilet Fiyatı:</span>
                <span class="font-medium text-gray-700">{{ selectedCategory?.price }} ₺</span>
              </div>
              <div class="border-t border-gray-200 pt-2 mt-2">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold text-gray-800">Toplam:</span>
                  <span class="text-2xl font-bold text-indigo-600">{{ totalPrice }} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentService } from '../services/payment'
import { mapGetters } from 'vuex'

export default {
  name: 'PaymentPage',
  data() {
    return {
      form: {
        customerName: '',
        customerSurname: '',
        customerEmail: '',
        ccNumber: '',
        ccExpMonth: null,
        ccExpYear: null,
        ccCvv: null
      },
      loading: false,
      error: null,
      validationErrors: {
        customerName: '',
        customerSurname: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        email: ''
      },
      // Unused variable - CODE QUALITY ISSUE
      unusedVariable: 'This is never used',
      // Magic numbers - CODE QUALITY ISSUE
      maxRetries: 3,
      timeout: 5000
    }
  },
  computed: {
    ...mapGetters(['selectedSeats', 'selectedEvent', 'selectedCategory', 'totalPrice']),
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
    if (!this.selectedEvent || !this.selectedCategory || this.selectedSeats.length === 0) {
      this.$router.push('/')
    }
  },
  methods: {
    validateCustomerName() {
      const name = this.form.customerName.trim()
      if (!name) {
        this.validationErrors.customerName = 'Ad gereklidir'
      } else if (name.length < 2) {
        this.validationErrors.customerName = 'Ad en az 2 karakter olmalıdır'
      } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) {
        this.validationErrors.customerName = 'Ad sadece harf içerebilir'
      } else {
        this.validationErrors.customerName = ''
      }
    },
    validateCustomerSurname() {
      const surname = this.form.customerSurname.trim()
      if (!surname) {
        this.validationErrors.customerSurname = 'Soyad gereklidir'
      } else if (surname.length < 2) {
        this.validationErrors.customerSurname = 'Soyad en az 2 karakter olmalıdır'
      } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(surname)) {
        this.validationErrors.customerSurname = 'Soyad sadece harf içerebilir'
      } else {
        this.validationErrors.customerSurname = ''
      }
    },
    formatCardNumber() {
      let value = this.form.ccNumber.replace(/\s/g, '')
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
      this.form.ccNumber = formattedValue
      if (this.validationErrors.cardNumber) {
        this.validateCardNumber()
      }
    },
    validateCardNumber() {
      const cardNumber = this.form.ccNumber.replace(/\s/g, '')
      if (!cardNumber) {
        this.validationErrors.cardNumber = 'Kart numarası gereklidir'
      } else if (cardNumber.length !== 16) {
        this.validationErrors.cardNumber = 'Kart numarası 16 haneli olmalıdır'
      } else if (!/^\d+$/.test(cardNumber)) {
        this.validationErrors.cardNumber = 'Sadece rakam girebilirsiniz'
      } else {
        this.validationErrors.cardNumber = ''
      }
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.customerEmail) {
        this.validationErrors.email = 'E-posta gereklidir'
      } else if (!emailPattern.test(this.form.customerEmail)) {
        this.validationErrors.email = 'Geçerli bir e-posta adresi girin'
      } else {
        this.validationErrors.email = ''
      }
    },
    validateExpiry() {
      if (!this.form.ccExpMonth || !this.form.ccExpYear) {
        this.validationErrors.expiry = 'Son kullanma tarihi gereklidir'
      } else if (this.form.ccExpMonth < 1 || this.form.ccExpMonth > 12) {
        this.validationErrors.expiry = 'Ay 1-12 arasında olmalıdır'
      } else if (this.form.ccExpYear < 26) {
        this.validationErrors.expiry = 'Geçersiz yıl'
      } else {
        this.validationErrors.expiry = ''
      }
    },
    validateCvv() {
      const cvv = String(this.form.ccCvv)
      if (!cvv) {
        this.validationErrors.cvv = 'CVV gereklidir'
      } else if (cvv.length !== 3) {
        this.validationErrors.cvv = 'CVV 3 haneli olmalıdır'
      } else if (!/^\d+$/.test(cvv)) {
        this.validationErrors.cvv = 'Sadece rakam girebilirsiniz'
      } else {
        this.validationErrors.cvv = ''
      }
    },
    limitCvvInput(event) {
      const value = event.target.value
      if (value.length > 3) {
        this.form.ccCvv = parseInt(value.slice(0, 3))
      }
      if (this.validationErrors.cvv) {
        this.validateCvv()
      }
    },
    async submitPayment() {
      this.validateCustomerName()
      this.validateCustomerSurname()
      this.validateEmail()
      this.validateCardNumber()
      this.validateExpiry()
      this.validateCvv()

      const hasErrors = Object.values(this.validationErrors).some(error => error !== '')
      if (hasErrors) {
        this.error = 'Lütfen formu eksiksiz ve doğru doldurun'
        return
      }

      this.loading = true
      this.error = null

      try {
        // Missing null check - BEST PRACTICE ISSUE
        const paymentData = {
          eventId: this.selectedEvent.id, // Could be null
          eventCategoryId: this.selectedCategory.id, // Could be null
          seats: this.selectedSeats.map(s => s.id), // No null check
          customer_name: this.form.customerName,
          customer_surname: this.form.customerSurname,
          customer_email: this.form.customerEmail,
          cc_number: this.form.ccNumber.replace(/\s/g, ''),
          cc_exp_month: this.form.ccExpMonth,
          cc_exp_year: this.form.ccExpYear,
          cc_cvv: this.form.ccCvv
        }

        // Console.log in production - CODE QUALITY ISSUE
        console.log('Payment data:', paymentData)
        console.log('Credit card:', paymentData.cc_number) // Logging sensitive data

        const response = await paymentService.process(paymentData)
        
        // Magic number - CODE QUALITY ISSUE
        if (response.data.code === 201 && response.data.status === 'success') {
          this.$store.dispatch('clearBooking')
          this.$router.push({ name: 'PaymentSuccess' })
        } else {
          this.error = response.data.message || 'Ödeme işlemi başarısız oldu.'
        }
      } catch (err) {
        // Poor error handling - BEST PRACTICE ISSUE
        this.error = err.message || 'Bir hata oluştu'
        // No error reporting, no retry logic
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
