import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MazeGrid from './components/MazeGrid'
import Nav from './components/Nav'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import MazeG from './components/MazeG'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <div className='flex flex-col justify-around items-center'>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/maze' element={<MazeGrid />}/>
        
        </Routes>
      </div>

      
    </>
  )
}

export default App
