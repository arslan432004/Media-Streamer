import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function formatNumber(n){
  if(!n) return ''
  return Number(n).toLocaleString()
}

function addToWatchHistory(id, title, thumbnail) {
  if (!id || !title) return
  let history = []
  try {
    const stored = localStorage.getItem('mediastream_watch_history')
    history = stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Error reading watch history:', e)
  }
  
  // Remove if already exists to avoid duplicates
  history = history.filter(item => item.id !== id)
  
  // Add to beginning
  history.unshift({ id, title, thumbnail, timestamp: new Date().getTime() })
  
  // Keep only last 20 items
  history = history.slice(0, 20)
  
  localStorage.setItem('mediastream_watch_history', JSON.stringify(history))
}

export default function Watch(){
  const { id } = useParams()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [watchHistory, setWatchHistory] = useState([])

  // Get watch history from localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem('mediastream_watch_history')
      setWatchHistory(history ? JSON.parse(history) : [])
    } catch (e) {
      console.error('Error reading watch history:', e)
    }
  }, [])

  useEffect(()=>{
    async function loadDetails(){
      if(!id) return setDetails(null)
      const key = import.meta.env.VITE_RAPID_API_KEY
      if(!key){ setDetails(null); return }
      setLoading(true)
      try{
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${key}`
        const res = await fetch(url)
        const data = await res.json()
        const video = data.items && data.items[0] ? data.items[0] : null
        setDetails(video)
        
        // Add to watch history
        if(video) {
          const title = video.snippet?.title || ''
          const thumbnail = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || ''
          addToWatchHistory(id, title, thumbnail)
        }
      }catch(e){
        console.error(e)
        setDetails(null)
      }finally{ setLoading(false) }
    }
    loadDetails()
  },[id])

  useEffect(()=>{
    async function loadRelated(){
      if(!id) return setRelatedVideos([])
      const key = import.meta.env.VITE_RAPID_API_KEY
      if(!key){ setRelatedVideos([]); return }
      setRelatedLoading(true)
      try{
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=8&key=${key}`
        const res = await fetch(url)
        const data = await res.json()
        setRelatedVideos(data.items || [])
      }catch(e){
        console.error(e)
        setRelatedVideos([])
      }finally{ setRelatedLoading(false) }
    }
    loadRelated()
  },[id])

  const snippet = details?.snippet || {}
  const stats = details?.statistics || {}

  // If no video ID, show watch history
  if (!id) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Watch History</h1>
        {watchHistory.length > 0 ? (
          <div className="video-grid">
            {watchHistory.map(item => (
              <Link 
                key={item.id}
                to={`/watch/${item.id}`}
                className="video-card"
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-base line-clamp-2">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No watch history yet. Start watching videos!</div>
        )}
      </div>
    )
  }

  // Otherwise show video player
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          { id ? (
            <div className="bg-black rounded overflow-hidden">
              <iframe
                title={id}
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[520px] sm:h-[420px]"
              />
            </div>
          ) : (
            <p className="text-gray-300">No video selected.</p>
          )}
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-2">{snippet.title || 'Video Title'}</h1>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 bg-gray-700 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{snippet.channelTitle || 'Channel'}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{formatNumber(stats.viewCount)} views</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : ''}</span>
              </div>
              <div className="mt-1 text-sm text-gray-400">{/* subscriber count could go here */}</div>
            </div>
          </div>

          <div className="mb-4 text-gray-300">
            {loading ? (
              <p className="text-gray-400">Loading description...</p>
            ) : (
              <>
                <p className={`text-sm ${showMore ? '' : 'line-clamp-3'}`}>{snippet.description || 'No description available.'}</p>
                {snippet.description && snippet.description.length > 300 && (
                  <button onClick={()=>setShowMore(!showMore)} className="mt-2 text-red-400">{showMore ? 'Show less' : 'Show more'}</button>
                )}
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">Related Videos</h3>
          <div className="space-y-3">
            {relatedLoading ? (
              <p className="text-sm text-gray-400">Loading related videos...</p>
            ) : relatedVideos.length > 0 ? (
              relatedVideos.map(video => (
                <Link 
                  key={video.id.videoId} 
                  to={`/watch/${video.id.videoId}`}
                  className="flex gap-2 p-2 rounded hover:bg-gray-800 transition"
                >
                  <img 
                    src={video.snippet.thumbnails.default.url} 
                    alt={video.snippet.title}
                    className="w-24 h-14 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{video.snippet.title}</p>
                    <p className="text-xs text-gray-400">{video.snippet.channelTitle}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400">No related videos found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
