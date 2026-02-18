import { Link } from 'react-router-dom'

export default function VideoCard({ video, compact }){
  const id = video?.id?.videoId || video?.id
  const snip = video?.snippet || {}
  const thumb = snip.thumbnails?.high?.url || snip.thumbnails?.medium?.url || ''

  return (
    <Link to={`/watch/${id}`} className={`video-card ${compact ? 'flex items-center space-x-3 p-2' : ''}`}>
      {!compact && (
        <img src={thumb} alt={snip.title} loading="lazy" />
      )}

      <div className={`${compact ? 'flex-1' : 'p-3'}`}>
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>{snip.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{snip.channelTitle}</p>
      </div>
    </Link>
  )
}
