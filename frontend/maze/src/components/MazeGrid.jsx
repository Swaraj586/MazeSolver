import React, { useEffect, useState } from 'react'
import WallCell from './WallCell';
import PathCell from './PathCell';
import StartCell from './StartCell';
import GoalCell from './GoalCell';
import TrailCell from './TrailCell';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use'



function MazeGrid() {

    const [grid, setGrid] = useState([]);
    const [path, setPath] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const size = location.state?.n;
    const {width,height} = useWindowSize();
    useEffect(() => {
        const fetchMaze = async () => {
        try {
            const response = await fetch(`https://maze-backend-vtqe.onrender.com/generate?n=${size}`);
            const data = await response.json();
            setGrid(data);
        } catch (error) {
            console.error("Failed to fetch maze:", error);
        }
        };

        fetchMaze();
    }, []); 


    useEffect(() => {
        if (!isAnimating) {
            return; 
        }
        if (currentStep >= path.length) {
            setIsAnimating(false);
            setIsSolved(true); 
            return;
        }
        

        const timer = setTimeout(() => {
            
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);

                const [x, y] = path[currentStep];

                if (newGrid[x][y] !== 'S' && newGrid[x][y] !== 'G') {
                    newGrid[x][y] = '*';
                }
                
                if (currentStep + 1 < path.length) {
                    const [nextX, nextY] = path[currentStep + 1];
                    newGrid[nextX][nextY] = 'S';
                }

                return newGrid;
            });

            setCurrentStep(step => step + 1);

        }, 100);

        return () => clearTimeout(timer);
    }, [isAnimating, currentStep, path]);


    const handleSolveClick = async () => {
        try {
            const response = await fetch('https://maze-backend-vtqe.onrender.com/solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grid)
            });
            const solutionPath = await response.json();

            setPath(solutionPath);
            setCurrentStep(0);
            setIsAnimating(true);

        } catch (error) {
            console.error("Failed to solve maze:", error);
        }
    };

    useEffect(() => {
        if (isSolved) {
            const confettiTimer = setTimeout(() => {
                setIsSolved(false); 
            }, 5000); 
            
            return () => clearTimeout(confettiTimer);
        }
    }, [isSolved]);


    if (grid.length === 0) {
        return <div>Loading...</div>;
    }

  return (
        <> 
            {isSolved && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={500}/>}
            <div style={{ padding: '1rem', textAlign: 'center' }} className='flex justify-around items-center gap-7'>
                <button onClick={()=>{navigate('/')}}>Back</button>
                <button 
                    onClick={handleSolveClick}
                    disabled={isAnimating} 
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: isAnimating ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    {isAnimating ? 'Solving...' : 'Solve Maze'}
                </button>
                <button onClick={()=>{window.location.reload();}}>New Maze</button>
            </div>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`
            }}>
                {
                    grid.map((rowArr, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {rowArr.map((cellValue, colIndex) => {
                                const key = `${rowIndex}-${colIndex}`;
                                
                                switch(cellValue){
                                    case '#':
                                        return <WallCell key={key} />;
                                    case 'S':
                                        return <StartCell key={key}/>
                                    case 'G':
                                        return <GoalCell key={key}/>
                                    case '*':
                                        return <TrailCell key={key}/>
                                    default:
                                        return <PathCell key={key}/>
                                }
                            })}
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    )
}

export default MazeGrid;