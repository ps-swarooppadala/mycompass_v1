import React from 'react'
import './App.css'
import Compass from './components/Compass'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Compass />
    </div>
  )
}

export default App
