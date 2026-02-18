// Search History Utility
const SEARCH_HISTORY_KEY = 'mediastream_search_history'
const MAX_HISTORY_ITEMS = 10

export function addToSearchHistory(query) {
  if (!query || !query.trim()) return
  
  const trimmed = query.trim()
  let history = getSearchHistory()
  
  // Remove if already exists to avoid duplicates
  history = history.filter(item => item.toLowerCase() !== trimmed.toLowerCase())
  
  // Add to beginning
  history.unshift(trimmed)
  
  // Keep only MAX_HISTORY_ITEMS
  history = history.slice(0, MAX_HISTORY_ITEMS)
  
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}

export function getSearchHistory() {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (e) {
    console.error('Error reading search history:', e)
    return []
  }
}

export function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}

export function removeFromSearchHistory(query) {
  let history = getSearchHistory()
  history = history.filter(item => item !== query)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}
