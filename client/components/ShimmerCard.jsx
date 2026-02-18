export default function ShimmerCard({compact}){
  return (
    <div className={`shimmer-card ${compact? 'flex items-center space-x-3 p-2':' '}`} aria-hidden>
      <div className="shimmer shimmer-rect" style={{width: compact? '120px' : '100%', height: compact? '72px' : '176px'}} />
      <div className={compact? 'flex-1' : 'p-3'}>
        <div className="shimmer shimmer-line" style={{width:'70%', height: compact? '12px':'16px', marginBottom:8}} />
        <div className="shimmer shimmer-line" style={{width:'40%', height:12}} />
      </div>
    </div>
  )
}
