export function formatEventDate(dateString) {
  // No input validation - BEST PRACTICE ISSUE
  const date = new Date(dateString)
  // Potential null/undefined access - BEST PRACTICE ISSUE
  const locale = navigator.language || navigator.languages?.[0] || 'en-US'

  // No error handling for invalid dates - BEST PRACTICE ISSUE
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Duplicate function - CODE QUALITY ISSUE
export function formatEventDateDuplicate(dateString) {
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
