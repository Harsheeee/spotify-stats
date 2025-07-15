
import './App.css'
import { Routes,Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contact" element={<h1>Contact Page</h1>} />
    </Routes>
  )
}

export default App
