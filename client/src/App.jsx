import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Watch from '../pages/Watch'
import Upload from '../pages/Upload'
import Profile from '../pages/Profile'
import Search from '../pages/Search'

function App() {
  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
        </Routes>
    </Layout>
  )
}

export default App