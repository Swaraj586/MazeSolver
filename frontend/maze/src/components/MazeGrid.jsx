import React, { useEffect, useState } from 'react'
import WallCell from './WallCell';
import PathCell from './PathCell';
import StartCell from './StartCell';
import GoalCell from './GoalCell';
import TrailCell from './TrailCell';

/*
const grid = [
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        "#",
        "S",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        "G",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        "#",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        "#",
        "#",
        ".",
        "#",
        ".",
        "#",
        "#",
        "#",
        ".",
        "#"
    ],
    [
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#",
        ".",
        ".",
        ".",
        ".",
        ".",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#"
    ]
];
*/

function MazeGrid() {

    const [grid, setGrid] = useState([]);
    const [path, setPath] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchMaze = async () => {
        try {
            const response = await fetch('http://localhost:8080/generate?n=20');
            const data = await response.json();
            setGrid(data);
        } catch (error) {
            console.error("Failed to fetch maze:", error);
        }
        };

        fetchMaze();
    }, []); 


    useEffect(() => {
        if (!isAnimating || currentStep >= path.length) {
            if (isAnimating) setIsAnimating(false); 
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
            const response = await fetch('http://localhost:8080/solve', {
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


    if (grid.length === 0) {
        return <div>Loading...</div>;
    }

  return (
        <> 
            <div style={{ padding: '1rem', textAlign: 'center' }}>
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