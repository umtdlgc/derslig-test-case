export function formatEventDate(dateString) {
  const date = new Date(dateString)
  const locale = navigator.language || navigator.languages?.[0] || 'en-US'

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
