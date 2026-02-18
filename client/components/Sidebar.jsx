import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => {
    if(path === '/' && location.pathname === '/') return true
    if(path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="site-sidebar w-64 bg-gray-900 text-white p-6 min-h-screen overflow-y-auto flex-shrink-0">
      {/* Main Navigation */}
      <div className="space-y-2 mb-8">
        <Link 
          to="/" 
          className={`block px-4 py-2 rounded transition ${isActive('/') ? 'bg-red-600' : 'hover:bg-gray-800'}`}
        >
          Home
        </Link>
        <Link 
          to="/profile" 
          className={`block px-4 py-2 rounded transition ${isActive('/profile') ? 'bg-red-600' : 'hover:bg-gray-800'}`}
        >
          Profile
        </Link>
        <Link 
          to="/search" 
          className={`block px-4 py-2 rounded transition ${isActive('/search') ? 'bg-red-600' : 'hover:bg-gray-800'}`}
        >
          Search History
        </Link>
        <Link 
          to="/watch" 
          className={`block px-4 py-2 rounded transition ${isActive('/watch') ? 'bg-red-600' : 'hover:bg-gray-800'}`}
        >
          Watch History
        </Link>
      </div>
    </aside>
  );
}
