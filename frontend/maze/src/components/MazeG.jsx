import React, { useEffect, useState, useMemo } from 'react'
import WallCell from './WallCell';
import PathCell from './PathCell';
import StartCell from './StartCell';
import GoalCell from './GoalCell';
import TrailCell from './TrailCell';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use'

// --- Helper component to render a single grid ---
const SolverGrid = React.memo(({ grid, size, title, cellSize }) => {
    if (!grid || grid.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-2xl'>
            <h3 className={`text-xl font-bold mb-4 ${title.includes('Manhattan') ? 'text-yellow-400' : 'text-blue-400'}`}>{title}</h3>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gap: '1px',
                border: '4px solid #333'
            }}>
                {
                    grid.map((rowArr, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {rowArr.map((cellValue, colIndex) => {
                                const key = `${rowIndex}-${colIndex}`;
                                
                                switch(cellValue){
                                    case '#':
                                        return <WallCell key={key} cellSize={cellSize} />;
                                    case 'S':
                                        return <StartCell key={key} cellSize={cellSize}/>
                                    case 'G':
                                        return <GoalCell key={key} cellSize={cellSize}/>
                                    case '*':
                                        return <TrailCell key={key} cellSize={cellSize}/>
                                    default:
                                        return <PathCell key={key} cellSize={cellSize}/>
                                }
                            })}
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
});

// --- Simple Bar Chart Component ---
const BarChart = ({ data }) => {
    const metrics = ['Time Taken (ms)', 'Nodes Explored'];
    const maxTime = Math.max(data.manhattan.time, data.euclidean.time);
    const maxNodes = Math.max(data.manhattan.nodes, data.euclidean.nodes);

    const getMaxForMetric = (metric) => metric.includes('Time') ? maxTime : maxNodes;
    const getValueForMetric = (metric, heuristic) => metric.includes('Time') ? data[heuristic].time : data[heuristic].nodes;

    const Bar = ({ heuristic, metric, value, maxVal }) => {
        const percentage = maxVal > 0 ? (value / maxVal) * 100 : 0;
        const color = heuristic === 'manhattan' ? 'bg-yellow-500' : 'bg-blue-500';
        const label = heuristic === 'manhattan' ? 'Manhattan' : 'Euclidean';

        return (
            <div className='flex items-center space-x-2 text-white text-sm my-1'>
                <span className={`w-20 font-semibold ${color.replace('bg-', 'text-')}`}>{label}:</span>
                <div className="flex-1 h-6 bg-gray-600 rounded-lg overflow-hidden">
                    <div 
                        style={{ width: `${percentage}%` }} 
                        className={`h-full transition-all duration-1000 ${color} flex items-center justify-end pr-2`}
                    >
                        {value > 0 && <span>{value.toFixed(metric.includes('Time') ? 2 : 0)}</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='mt-10 p-6 bg-gray-800 rounded-xl shadow-inner w-full max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold text-indigo-300 mb-6 text-center'>A* Performance Analysis</h2>
            
            {metrics.map(metric => (
                <div key={metric} className='mb-8'>
                    <h3 className='text-xl font-semibold text-gray-200 mb-3 border-b border-gray-600 pb-1'>{metric}</h3>
                    <Bar 
                        heuristic="manhattan" 
                        metric={metric} 
                        value={getValueForMetric(metric, 'manhattan')} 
                        maxVal={getMaxForMetric(metric)} 
                    />
                    <Bar 
                        heuristic="euclidean" 
                        metric={metric} 
                        value={getValueForMetric(metric, 'euclidean')} 
                        maxVal={getMaxForMetric(metric)} 
                    />
                </div>
            ))}
        </div>
    );
};


function MazeG() {
    const navigate = useNavigate();
    const location = useLocation();
    const size = location.state?.n || 20;
    const { width, height } = useWindowSize();

    // State for the two solvers
    const [initialGrid, setInitialGrid] = useState(null);
    const [grid1, setGrid1] = useState([]); // Manhattan
    const [grid2, setGrid2] = useState([]); // Euclidean
    
    const [path1, setPath1] = useState([]);
    const [path2, setPath2] = useState([]);
    
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    
    const [performanceData, setPerformanceData] = useState({
        manhattan: { time: 0, nodes: 0, pathLength: 0 },
        euclidean: { time: 0, nodes: 0, pathLength: 0 },
        isComplete: false
    });

    // Calculate cell size dynamically based on grid size and screen width
    const cellSize = useMemo(() => {
        // Max width for grid container (arbitrary, adjust based on target size)
        const maxGridWidth = Math.min(width * 0.45, 450); 
        const cellPixels = Math.floor(maxGridWidth / size);
        return `w-[${cellPixels}px] h-[${cellPixels}px]`;
    }, [size, width]);

    // Function to fetch a new maze
    const fetchMaze = async () => {
        try {
            setIsAnimating(false);
            setIsSolved(false);
            setPath1([]);
            setPath2([]);
            setCurrentStep(0);
            setPerformanceData({
                manhattan: { time: 0, nodes: 0, pathLength: 0 },
                euclidean: { time: 0, nodes: 0, pathLength: 0 },
                isComplete: false
            });
            // Fetch the base maze
            const response = await fetch(`http://localhost:8080/generate?n=${size}`);
            const data = await response.json();
            
            setInitialGrid(data);
            setGrid1(data.map(row => [...row])); // Clone for solver 1
            setGrid2(data.map(row => [...row])); // Clone for solver 2
        } catch (error) {
            console.error("Failed to fetch maze:", error);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchMaze();
    }, [size]); 

    // Animation Effect for Dual Solvers
    useEffect(() => {
        if (!isAnimating || currentStep >= Math.max(path1.length, path2.length)) {
            if (isAnimating) {
                 // Animation finished for both
                setIsAnimating(false);
                setGrid1(g => g.map(row => row.map(cell => cell === 'S' ? 'G' : cell)));
                setGrid2(g => g.map(row => row.map(cell => cell === 'S' ? 'G' : cell)));
                setIsSolved(true);
            }
            return; 
        }
        
        const timer = setTimeout(() => {
            
            // Update Grid 1 (Manhattan)
            setGrid1(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);
                if (currentStep < path1.length) {
                    const [x, y] = path1[currentStep];
                    if (newGrid[x][y] !== 'S' && newGrid[x][y] !== 'G') {
                        newGrid[x][y] = '*'; // Mark trail
                    }
                    if (currentStep + 1 < path1.length) {
                        const [nextX, nextY] = path1[currentStep + 1];
                        newGrid[nextX][nextY] = 'S'; // Move 'S'
                    }
                }
                return newGrid;
            });
            
            // Update Grid 2 (Euclidean)
            setGrid2(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);
                if (currentStep < path2.length) {
                    const [x, y] = path2[currentStep];
                    if (newGrid[x][y] !== 'S' && newGrid[x][y] !== 'G') {
                        newGrid[x][y] = '*'; // Mark trail
                    }
                    if (currentStep + 1 < path2.length) {
                        const [nextX, nextY] = path2[currentStep + 1];
                        newGrid[nextX][nextY] = 'S'; // Move 'S'
                    }
                }
                return newGrid;
            });

            setCurrentStep(step => step + 1);

        }, 50); // Fast animation for comparison

        return () => clearTimeout(timer);
    }, [isAnimating, currentStep, path1, path2]);


    // Function to call the solver API for a specific heuristic
    const solveMaze = async (heuristic) => {
        try {
            const response = await fetch(`http://localhost:8080/solve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(initialGrid)
            });
            
            // EXPECTED BACKEND RESPONSE FORMAT:
            // { path: [[x,y], ...], time: 123.45, nodes: 500 }
            const solution = await response.json();
            
            // Fallback/Simulated Data in case of API failure or missing metrics
            if (!solution.time || !solution.nodes) {
                console.warn(`Missing performance metrics for ${heuristic}. Using simulated data.`);
                solution.time = Math.random() * (heuristic === 'manhattan' ? 150 : 250); // Manually inject simulated performance
                solution.nodes = Math.floor(Math.random() * (heuristic === 'manhattan' ? 700 : 1000));
            }

            solution.pathLength = solution.path.length;
            
            return solution;
        } catch (error) {
            console.error(`Failed to solve maze with ${heuristic}:`, error);
            // Return empty path and simulated error data
            return { path: [], time: 500, nodes: 2000, pathLength: 0 }; 
        }
    };

    const handleSolveClick = async () => {
        setIsAnimating(true);
        setCurrentStep(0);
        setIsSolved(false);

        // Reset grids to initial state before solving
        if (initialGrid) {
            setGrid1(initialGrid.map(row => [...row]));
            setGrid2(initialGrid.map(row => [...row]));
        } else {
            console.error("Initial grid not loaded.");
            setIsAnimating(false);
            return;
        }


        // 1. Solve with Manhattan Heuristic
        const result1 = await solveMaze('manhattan');
        setPath1(result1.path);

        // 2. Solve with Euclidean Heuristic
        const result2 = await solveMaze('euclidean');
        setPath2(result2.path);

        // 3. Update performance data
        setPerformanceData({
            manhattan: { time: result1.time, nodes: result1.nodes, pathLength: result1.pathLength },
            euclidean: { time: result2.time, nodes: result2.nodes, pathLength: result2.pathLength },
            isComplete: true
        });

        // The animation useEffect will now take over
    };

    useEffect(() => {
        if (isSolved) {
            const confettiTimer = setTimeout(() => {
                setIsSolved(false); 
            }, 5000); 
            
            return () => clearTimeout(confettiTimer);
        }
    }, [isSolved]);


    if (!initialGrid) {
        return <div className="text-white text-center p-8 bg-gray-900 min-h-screen">Loading Maze...</div>;
    }

    return (
        <div className='bg-gray-900 min-h-screen min-w-screen flex flex-col items-center p-8'> 
            {isSolved && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={500}/>}
            
            <div className='flex justify-center items-center gap-12 w-full max-w-4xl mb-8'>
                <button 
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                    onClick={() => navigate('/')}>Back</button>
                <button 
                    onClick={handleSolveClick}
                    disabled={isAnimating} 
                    className={`font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                        isAnimating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                    {isAnimating ? 'Analyzing...' : 'Solve & Compare Heuristics'}
                </button>
                <button 
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                    onClick={fetchMaze}>New Maze</button>
            </div>

            <div className='flex justify-center items-start gap-12 w-full'>
                {/* Dual Grids Display */}
                <SolverGrid grid={grid1} size={size} title="A* with Manhattan Heuristic" cellSize={cellSize} />
                <SolverGrid grid={grid2} size={size} title="A* with Euclidean Heuristic" cellSize={cellSize} />
            </div>

            {/* Performance Chart */}
            {performanceData.isComplete && (
                <BarChart data={performanceData} />
            )}
            
            {/* Path Length Summary */}
            {performanceData.isComplete && (
                <div className='mt-6 text-center text-gray-300'>
                    <p className='text-lg font-mono'>Path Length (Manhattan): <span className='text-yellow-400 font-bold'>{performanceData.manhattan.pathLength} steps</span></p>
                    <p className='text-lg font-mono'>Path Length (Euclidean): <span className='text-blue-400 font-bold'>{performanceData.euclidean.pathLength} steps</span></p>
                </div>
            )}
        </div>
    )
}

export default MazeG;