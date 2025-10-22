package com.example.aiMaze.utility;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Stack;

public class Maze_Generator {

    int n;
    String[][] maze;
    int[] start;
    public Maze_Generator(int n){
        this.n = n;
        maze=new String[n+1][n+1];
        start=new int[2];
        start[0]=5;
        start[1]=5;
    }
    void fill(){
        for(int i=0;i<=n;i++){
            for(int j=0;j<=n;j++){
                maze[i][j]="#";
            }
        }
    }
    
    void generate() {
        Random ran = new Random();
        Stack<int[]> stack = new Stack<>();

        int x = start[0];
        int y = start[1];

        maze[x][y] = "S";
        stack.push(new int[]{x, y});

        // We'll use these to store the goal coordinates
        int goalX = x;
        int goalY = y;
        boolean goalPlaced = false;

        while (!stack.isEmpty()) {
            int[] current = stack.peek();
            x = current[0];
            y = current[1];

            List<int[]> neighbors = new ArrayList<>();

            if (x - 2 > 0 && maze[x - 2][y] == "#") {
                neighbors.add(new int[]{x - 2, y});
            }
            if (x + 2 < n && maze[x + 2][y] == "#") {
                neighbors.add(new int[]{x + 2, y});
            }
            if (y - 2 > 0 && maze[x][y - 2] == "#") {
                neighbors.add(new int[]{x, y - 2});
            }
            if (y + 2 < n && maze[x][y + 2] == "#") {
                neighbors.add(new int[]{x, y + 2});
            }

            if (!neighbors.isEmpty()) {
                int[] chosen = neighbors.get(ran.nextInt(neighbors.size()));
                int nx = chosen[0];
                int ny = chosen[1];

                maze[(x + nx) / 2][(y + ny) / 2] = ".";
                maze[nx][ny] = ".";

                stack.push(chosen);
            } else {
                // This is a dead end. Time to backtrack (pop).
                int[] popped = stack.pop();

                // Store the coordinates of the *first* dead end we find.
                // This will be the deepest point in the maze.
                if (!goalPlaced) {
                    goalX = popped[0];
                    goalY = popped[1];
                    goalPlaced = true;
                }
            }
        }

        // Now, place 'G' at the coordinates we saved.
        maze[goalX][goalY] = "G";

        // And ensure 'S' is still at the start.
        maze[start[0]][start[1]] = "S";
    }

    public String[][] compute(){
        this.fill();
        this.generate();
        return maze;
    }
    
}