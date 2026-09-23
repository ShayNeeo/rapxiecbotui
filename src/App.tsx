import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import CircusPortalPage from './pages/CircusPortalPage'
import ChatbotPage from './pages/ChatbotPage'

const ChatbotWrapper: React.FC = () => {
  const navigate = useNavigate()
  return <ChatbotPage onBackToPortal={() => navigate('/')} />
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CircusPortalPage />} />
        <Route path="/chatbot" element={<ChatbotWrapper />} />
        <Route path="*" element={<CircusPortalPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
