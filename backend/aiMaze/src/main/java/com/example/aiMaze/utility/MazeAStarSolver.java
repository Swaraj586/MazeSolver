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

    private static class NodePath {
        int fCost;
        int gCost;
        int[] current;
        NodePath parent;

        public NodePath(int fCost, int gCost, int[] current, NodePath parent) {
            this.fCost = fCost;
            this.gCost = gCost;
            this.current = current;
            this.parent = parent;
        }
        
        public String getKey() {
            return current[0] + "," + current[1];
        }
    }

    private static final int[][] DIRECTIONS = {
        {-1, 0}, 
        {1, 0},  
        {0, -1}, 
        {0, 1}  
    };

    private static int calculateHeuristic(int[] current, int[] goal) {
        return Math.abs(current[0] - goal[0]) + Math.abs(current[1] - goal[1]);
    }

    public static int[][] solveMaze(char[][] maze) {
        int rows = maze.length;
        int cols = maze[0].length;
        int[] start = null;
        int[] goal = null;

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
            return new int[0][0]; 
        }
        
        PriorityQueue<NodePath> pq = new PriorityQueue<>(
            Comparator.comparingInt((NodePath n) -> n.fCost)
                      .thenComparingInt(n -> n.gCost)
        );

        Map<String, Integer> gCostMap = new HashMap<>();

        int hStart = calculateHeuristic(start, goal);
        NodePath startNode = new NodePath(hStart, 0, start, null);
        
        pq.add(startNode);
        gCostMap.put(startNode.getKey(), 0);

        while (!pq.isEmpty()) {
            NodePath current = pq.poll();
            int[] currentPoint = current.current;

            if (currentPoint[0] == goal[0] && currentPoint[1] == goal[1]) {
                return reconstructPath(current);
            }
            
            if (current.gCost > gCostMap.getOrDefault(current.getKey(), Integer.MAX_VALUE)) {
                 continue;
            }

            for (int[] dir : DIRECTIONS) {
                int nextRow = currentPoint[0] + dir[0];
                int nextCol = currentPoint[1] + dir[1];
                int[] neighbor = new int[]{nextRow, nextCol};
                String neighborKey = nextRow + "," + nextCol;

                if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
                    continue;
                }
                if (maze[nextRow][nextCol] == '#') {
                    continue; 
                }

                int tentativeGCost = current.gCost + 1;
                
                if (tentativeGCost < gCostMap.getOrDefault(neighborKey, Integer.MAX_VALUE)) {
                    int hNeighbor = calculateHeuristic(neighbor, goal);
                    int fNeighbor = tentativeGCost + hNeighbor;
                    
                    NodePath nextNode = new NodePath(fNeighbor, tentativeGCost, neighbor, current);
                    
                    gCostMap.put(neighborKey, tentativeGCost);
                    
                    pq.add(nextNode);
                }
            }
        }

        return new int[0][0];
    }

    private static int[][] reconstructPath(NodePath goalNode) {
        List<int[]> pathList = new LinkedList<>();
        NodePath current = goalNode;
        while (current != null) {
            pathList.add(0, current.current); 
            current = current.parent;
        }
        
        return pathList.toArray(new int[0][]);
    }

    public int[][] compute_path(){
        int[][] path = solveMaze(maze);
        return path;
    }

}