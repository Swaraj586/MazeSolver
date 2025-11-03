import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  const handleClick = (size)=>{
    navigate('/maze',{
      state:{
        n: size
      }
    })
  }
  return (
    <>
        <div className='flex flex-wrap m-56 justify-between items-center gap-7 h-3/4 w-full'>
            <button className='h-36 w-1/4' onClick={()=>handleClick(20)}>Maze 20x20</button>
            <button className='h-36 w-1/4' onClick={()=>handleClick(30)}>Maze 30x30</button>
            <button className='h-36 w-1/4' onClick={()=>handleClick(40)}>Maze 40x40</button>
        </div>
    </>
  )
}

export default Home