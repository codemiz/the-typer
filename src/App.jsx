import { useState } from 'react'
import Typing from './Typing'
import { LeaderboardProvider } from './context/leaderboardContext'

function App() {

  return (
    <LeaderboardProvider>
      <Typing />
    </LeaderboardProvider>
  )
}

export default App
