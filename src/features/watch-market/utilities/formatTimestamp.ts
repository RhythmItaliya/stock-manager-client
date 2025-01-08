export function formatDate(timestamp: string | number | null): string {
  if (!timestamp) return 'N/A'
  const date = new Date(parseInt(timestamp.toString(), 10))
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatTime(timestamp: string | number | null): string {
  if (!timestamp) return 'N/A'
  const date = new Date(parseInt(timestamp.toString(), 10))
  return date.toLocaleTimeString()
}
