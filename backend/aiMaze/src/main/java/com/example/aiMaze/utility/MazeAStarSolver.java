package com.example.aiMaze.utility;

import java.util.*;


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

    public static MazeSolutionResponse solveMaze(char[][] maze) {
        int rows = maze.length;
        int cols = maze[0].length;
        int[] start = null;
        int[] goal = null;
        Set<NodePath> closedSet = new HashSet<>();      /////////////
        List<int[]> visitedCells = new ArrayList<>();   //////////////
        long startTime = System.nanoTime();
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
            return new MazeSolutionResponse(0,new int[0][0],visitedCells);
        }
        
        PriorityQueue<NodePath> pq = new PriorityQueue<>(
            Comparator.comparingInt((NodePath n) -> n.fCost)
                      .thenComparingInt(n -> n.gCost)
        );

        Map<String, Integer> gCostMap = new HashMap<>();

        int hStart = calculateHeuristic(start, goal);
        NodePath startNode = new NodePath(hStart, 0, start, null);
        
        pq.add(startNode);
        visitedCells.add(new int[]{startNode.current[0], startNode.current[1]}); //////////
        closedSet.add(startNode);  /////////////
        gCostMap.put(startNode.getKey(), 0);

        while (!pq.isEmpty()) {
            NodePath current = pq.poll();
            int[] currentPoint = current.current;

            if (currentPoint[0] == goal[0] && currentPoint[1] == goal[1]) {
                long endTime = System.nanoTime();
                long totalTime = endTime-startTime;
                System.out.println(totalTime);
                return new MazeSolutionResponse(totalTime,reconstructPath(current),visitedCells);
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
                    if(!closedSet.contains(nextNode))
                    {
                        visitedCells.add(new int[]{nextNode.current[0],nextNode.current[1]});
                        closedSet.add(nextNode);
                    }
                }
            }
        }

        return new MazeSolutionResponse(0,new int[0][0],visitedCells);
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

    public MazeSolutionResponse compute_path(){
        MazeSolutionResponse path = solveMaze(maze);
        return path;
    }

}