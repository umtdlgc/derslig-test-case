<template>
  <div class="payment-success-page">
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-white rounded-lg shadow-lg p-12 border border-transparent">
        <div class="mb-6">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">Ödeme Başarılı!</h1>
        <p class="text-gray-600 mb-8">
          Biletiniz başarıyla oluşturuldu.
        </p>

        <div class="space-y-3">
          <router-link 
            to="/"
            class="block w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700"
          >
            Ana Sayfaya Dön
          </router-link>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccessPage',
  mounted() {
    this.$store.dispatch('clearBooking')
  }
}
</script>
