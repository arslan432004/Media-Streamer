import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import ShimmerCard from '../components/ShimmerCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search history helpers
  const getSearchHistory = () => {
    try {
      const history = localStorage.getItem('mediastream_search_history')
      return history ? JSON.parse(history) : []
    } catch (e) {
      console.error('Error reading search history:', e)
      return []
    }
  }

  const addToSearchHistory = (query) => {
    if (!query || !query.trim()) return
    const trimmed = query.trim()
    let history = getSearchHistory()
    history = history.filter(item => item.toLowerCase() !== trimmed.toLowerCase())
    history.unshift(trimmed)
    history = history.slice(0, 10)
    localStorage.setItem('mediastream_search_history', JSON.stringify(history))
  }

  const removeFromSearchHistory = (query) => {
    let history = getSearchHistory()
    history = history.filter(item => item !== query)
    localStorage.setItem('mediastream_search_history', JSON.stringify(history))
  }

  const clearSearchHistory = () => {
    localStorage.removeItem('mediastream_search_history')
  }

  const [history, setHistory] = useState(getSearchHistory());
  const [showHistory, setShowHistory] = useState(!query);

  useEffect(() => {
    async function load(){
      if(!query) {
        setResults([])
        setShowHistory(true)
        return
      }
      setShowHistory(false)
      setLoading(true)
      const key = import.meta.env.VITE_RAPID_API_KEY
      try{
        if(!key){ setResults([]); return }
        addToSearchHistory(query)
        setHistory(getSearchHistory())
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=24&q=${encodeURIComponent(query)}&key=${key}`
        const res = await fetch(url)
        const data = await res.json()
        setResults(data.items || [])
      }catch(e){
        console.error(e)
        setResults([])
      }finally{ setLoading(false) }
    }
    load()
  }, [query]);

  function handleHistoryClick(query) {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  function handleRemoveHistory(item) {
    removeFromSearchHistory(item)
    setHistory(getSearchHistory())
  }

  function handleClearHistory() {
    if(window.confirm('Are you sure you want to clear all search history?')) {
      clearSearchHistory()
      setHistory([])
    }
  }

  return (
    <div className="p-6">
      {showHistory ? (
        <div>
          <h1 className="text-3xl font-bold mb-6">Search History</h1>
          {history.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400">{history.length} search{history.length !== 1 ? 'es' : ''}</p>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition"
                >
                  Clear All History
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div
                    key={item}
                    className="bg-gray-800 p-4 rounded hover:bg-gray-700 transition cursor-pointer group flex justify-between items-center"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium truncate">{item}</p>
                      <p className="text-gray-400 text-sm">Click to search</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveHistory(item)
                      }}
                      className="ml-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No search history yet. Start searching!</div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-6">
            Search Results for "{query}"
          </h1>
          
          {loading ? (
            <div className="video-grid">
              {Array.from({length:12}).map((_,i)=>(
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-gray-400">No results found.</div>
          ) : (
            <div className="video-grid">
              {results.map((item) => (
                <VideoCard key={item.id?.videoId || item.id} video={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
