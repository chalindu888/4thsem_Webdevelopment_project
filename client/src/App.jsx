import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages Import කිරීම
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Awareness from './pages/Awareness'
import Profile from './pages/profile'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

// ProtectedRoute Component එක Import කිරීම
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - ඕනෑම කෙනෙකුට පිවිසිය හැක */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Login වී ඇති පරිශීලකයින්ට පමණක් පිවිසිය හැක */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App