import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  
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

  const [history, setHistory] = useState(getSearchHistory())
  const navigate = useNavigate()

  function onSearch(e){
    e.preventDefault()
    const trimmed = q.trim()
    if(trimmed) {
      addToSearchHistory(trimmed)
      setHistory(getSearchHistory())
      setShowHistory(false)
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  function handleHistoryClick(query) {
    setQ(query)
    setShowHistory(false)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  function handleRemoveHistory(e, query) {
    e.preventDefault()
    e.stopPropagation()
    removeFromSearchHistory(query)
    setHistory(getSearchHistory())
  }

  return (
    <nav className="site-navbar bg-gray-900 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 text-red-500">
            <Link to="/" className="text-2xl font-bold text-red-500">
              MediaStream
            </Link>
          </div>

          {/* Center search */}
          <div className="flex-1 hidden md:flex justify-center relative">
            <form onSubmit={onSearch} className="w-full max-w-2xl relative">
              <div className="flex relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                  placeholder="Search"
                  className="w-full rounded-l-md px-3 py-2 bg-gray-800 text-white focus:outline-none"
                />
                <button className="bg-red-600 px-4 rounded-r-md hover:bg-red-700">Search</button>
                
                {/* Search History Dropdown */}
                {showHistory && q.trim().length > 0 && history.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-b-md mt-0 z-50 shadow-lg">
                    <div className="max-h-64 overflow-y-auto">
                      {history.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault()
                            handleHistoryClick(item)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 flex justify-between items-center group"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-3.5-3.5c2.33 0 4.31 1.46 5.11 3.5H6.89c.8-2.04 2.78-3.5 5.11-3.5z"/>
                            </svg>
                            <span className="text-sm">{item}</span>
                          </div>
                          <button
                            onClick={(e) => handleRemoveHistory(e, item)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                          >
                            ✕
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <Link to="/upload" className="hidden sm:inline-flex items-center px-3 py-1 rounded hover:bg-gray-800">Upload</Link>
            <Link to="/profile" className="inline-flex items-center px-3 py-1 rounded bg-red-600 hover:bg-red-700">Profile</Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="block px-3 py-2 rounded hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link 
              to="/watch" 
              className="block px-3 py-2 rounded hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Watch
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded bg-red-600 hover:bg-red-700"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
