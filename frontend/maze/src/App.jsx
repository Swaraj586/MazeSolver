import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MazeGrid from './components/MazeGrid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MazeGrid />
    </>
  )
}

export default App
