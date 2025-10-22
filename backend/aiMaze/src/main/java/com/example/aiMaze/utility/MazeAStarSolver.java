package com.example.aiMaze.utility;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;


public class MazeAStarSolver {

    char[][] maze;
    public MazeAStarSolver(char[][] maze) {
        this.maze = maze;

    }


    

    // Helper class to represent the state in the PriorityQueue
    // It stores the total estimated cost (f-cost) and the path to reach the current cell
    private static class NodePath {
        int fCost; // Total estimated cost (g-cost + h-cost)
        int gCost; // Actual cost from start (g-cost)
        int[] current; // Current cell coordinates: {row, col}
        NodePath parent; // Reference to the previous node in the optimal path

        public NodePath(int fCost, int gCost, int[] current, NodePath parent) {
            this.fCost = fCost;
            this.gCost = gCost;
            this.current = current;
            this.parent = parent;
        }
        
        // Helper to get the String key for the coordinate array
        public String getKey() {
            return current[0] + "," + current[1];
        }
    }

    // Directions for moving (Up, Down, Left, Right)
    private static final int[][] DIRECTIONS = {
        {-1, 0}, // Up
        {1, 0},  // Down
        {0, -1}, // Left
        {0, 1}   // Right
    };

    /**
     * Calculates the Manhattan distance heuristic (hn) for a cell.
     * hn = |current.row - goal.row| + |current.col - goal.col|
     * @param current The current coordinate {row, col}.
     * @param goal The goal coordinate {row, col}.
     */
    private static int calculateHeuristic(int[] current, int[] goal) {
        return Math.abs(current[0] - goal[0]) + Math.abs(current[1] - goal[1]);
    }

    /**
     * Solves the maze using the A* search algorithm.
     * @param maze The 2D character array representing the maze.
     * @return A 2D array of integers (int[][]) representing the optimal path, 
     * where each inner array is a coordinate {row, col}. Returns an empty 2D array if no path is found.
     */
    public static int[][] solveMaze(char[][] maze) {
        int rows = maze.length;
        int cols = maze[0].length;
        int[] start = null;
        int[] goal = null;

        // 1. Find Start (S) and Goal (G)
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (maze[r][c] == 'S') {
                    start = new int[]{r, c};
                } else if (maze[r][c] == 'G') {
                    goal = new int[]{r, c};
                }
            }
        }

        if (start == null || goal == null) {
            System.err.println("Error: Start (S) or Goal (G) not found in the maze.");
            return new int[0][0]; // Return empty array
        }
        
        //System.out.println("Starting A* Search from (" + start[0] + "," + start[1] + ") to (" + goal[0] + "," + goal[1] + ")");
        
        // PriorityQueue: Min-heap based on f-cost. If f-costs are equal, compare g-costs.
        PriorityQueue<NodePath> pq = new PriorityQueue<>(
            Comparator.comparingInt((NodePath n) -> n.fCost)
                      .thenComparingInt(n -> n.gCost)
        );

        // Map to store the best g-cost found so far for a cell. Key: "row,col" string.
        Map<String, Integer> gCostMap = new HashMap<>();

        // Initialize start node
        int hStart = calculateHeuristic(start, goal);
        NodePath startNode = new NodePath(hStart, 0, start, null);
        
        pq.add(startNode);
        gCostMap.put(startNode.getKey(), 0);

        // 2. A* Search Loop
        while (!pq.isEmpty()) {
            NodePath current = pq.poll();
            int[] currentPoint = current.current;

            // Goal Check
            if (currentPoint[0] == goal[0] && currentPoint[1] == goal[1]) {
                return reconstructPath(current); // Path found!
            }
            
            // Optimization: If the current gCost is worse than the best known gCost, skip this stale entry.
            if (current.gCost > gCostMap.getOrDefault(current.getKey(), Integer.MAX_VALUE)) {
                 continue;
            }

            // Check neighbors (Up, Down, Left, Right)
            for (int[] dir : DIRECTIONS) {
                int nextRow = currentPoint[0] + dir[0];
                int nextCol = currentPoint[1] + dir[1];
                int[] neighbor = new int[]{nextRow, nextCol};
                String neighborKey = nextRow + "," + nextCol;

                // 3. Boundary and Wall Check
                if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
                    continue; // Out of bounds
                }
                if (maze[nextRow][nextCol] == '#') {
                    continue; // Wall
                }

                // 4. Calculate Costs
                // Cost for moving from current to neighbor is always 1
                int tentativeGCost = current.gCost + 1;
                
                // Check if we already found a shorter path to this neighbor
                if (tentativeGCost < gCostMap.getOrDefault(neighborKey, Integer.MAX_VALUE)) {
                    // This is a better path, update it!
                    int hNeighbor = calculateHeuristic(neighbor, goal);
                    int fNeighbor = tentativeGCost + hNeighbor;
                    
                    // Create the new node and add it to the queue
                    NodePath nextNode = new NodePath(fNeighbor, tentativeGCost, neighbor, current);
                    
                    // Update the best g-cost found so far for this cell
                    gCostMap.put(neighborKey, tentativeGCost);
                    
                    // Add to PQ. 
                    pq.add(nextNode);
                }
            }
        }

        // If the loop finishes without reaching the goal
        return new int[0][0];
    }

    /**
     * Reconstructs the path from the goal node back to the start node using parent references.
     * @return A 2D array of integers {row, col}.
     */
    private static int[][] reconstructPath(NodePath goalNode) {
        List<int[]> pathList = new LinkedList<>();
        NodePath current = goalNode;
        while (current != null) {
            // Add the coordinate array to the front of the list
            pathList.add(0, current.current); 
            current = current.parent;
        }
        
        // Convert List<int[]> to int[][]
        return pathList.toArray(new int[0][]);
    }

    public int[][] compute_path(){
        int[][] path = solveMaze(maze);
        return path;
    }

    
}