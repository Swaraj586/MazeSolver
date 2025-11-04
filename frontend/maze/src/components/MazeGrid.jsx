import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import WallCell from './WallCell';
import PathCell from './PathCell';
import StartCell from './StartCell';
import GoalCell from './GoalCell';
import TrailCell from './TrailCell';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use'
import ExploredCell from './ExploredCell';



function MazeGrid() {

    const [grid, setGrid] = useState([]);
    const [path, setPath] = useState([]);
    const [time, setTime] = useState(0);
    const [time1,setTime1] = useState(0);
    const [vis,setVis] = useState([]);
    const [data,setData] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isExploring,setIsExploring] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const size = (location.state?.n)/2;
    const {width,height} = useWindowSize();
    const fetchMaze = async () => {
        try {
            setIsAnimating(false);
            setIsSolved(false);
            setPath([]);
            setData([]);
            setCurrentStep(0);
            setTime(0);
            setTime1(0);
            const response = await fetch(`http://localhost:8080/generate?n=${size}`);
            const data = await response.json();
            setGrid(data);
        } catch (error) {
            console.error("Failed to fetch maze:", error);
        }
        };
    useEffect(() => {
        const fetchMaze = async () => {
        try {
            const response = await fetch(`http://localhost:8080/generate?n=${size}`);
            const data = await response.json();
            setGrid(data);
        } catch (error) {
            console.error("Failed to fetch maze:", error);
        }
        };

        fetchMaze();
    }, []); 


    useEffect(() => {
        if (!isExploring && !isAnimating) {
            
            return; 
        }
        if(isExploring)
        {
            if (currentStep >= path.length) {
            setIsAnimating(false);
            // setIsSolved(true); 
            return;
        }
        

        const timer = setTimeout(() => {
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);

                const [x, y] = vis[currentStep];

                if (newGrid[x][y] !== 'S' && newGrid[x][y] !== 'G') {
                    newGrid[x][y] = 'E';
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
        }
        if(isAnimating)
        {
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
    }
    }, [isAnimating, currentStep, path,vis,isExploring]);


    const handleSolveClick = async () => {
        try {
            
            const response1 = await fetch('http://localhost:8080/solveE', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grid)
            });
            const solutionPath1 = await response1.json();
            const response = await fetch('http://localhost:8080/solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grid)
            });
            const solutionPath = await response.json();
            setVis(solutionPath.visitedCells);
            setPath(solutionPath.path);
            setTime(solutionPath.time);
            setTime1(solutionPath1.time);

            const chartData = [
                { h_fnc: 'Manhattan', time_in_ns: solutionPath.time },
                { h_fnc: 'Euclidean', time_in_ns: solutionPath1.time},
                
            ];
            setData(chartData);

            setCurrentStep(0);
            setIsExploring(true);
            setIsAnimating(true);
            //setIsSolved(true);
            
            



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
                    
                        backgroundColor: isAnimating ? '#ccc' : '#4CAF50',
                        
                    }}
                >
                    {isAnimating ? 'Solving...' : 'Solve Maze'}
                </button>
                <button onClick={fetchMaze}>New Maze</button>
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
                                    case 'E':
                                        return <ExploredCell key={key}/>
                                    default:
                                        return <PathCell key={key}/>
                                }
                            })}
                        </React.Fragment>
                    ))
                }
            
            </div>
            {!isAnimating &&
            <div className='bg-white rounded-4xl w-full flex flex-col items-center justify-between gap-10 m-20 p-15'>
            <h1 className='text-black m-1.5'>Time utilized by both the heuristic functions</h1>
            <ResponsiveContainer  width="100%" height={300}>
      <BarChart 
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="h_fnc" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="time_in_ns" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer> </div>}
        </>
    )
}

export default MazeGrid;