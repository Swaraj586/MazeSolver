package com.example.aiMaze.utility;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Stack;

public class Maze_Generator {

    Random ran = new Random();
    int n;
    String[][] maze;
    int[] start;

    public Maze_Generator(int n){
        this.n = n;
        maze=new String[n+1][n+1];
        start=new int[2];
        int x=ran.nextInt(n);
        int y=ran.nextInt(n);
        start[0]=(x==0)?1:x;
        start[1]=(y==0)?1:y;
    }

    void fill(){
        for(int i=0;i<=n;i++){
            for(int j=0;j<=n;j++){
                maze[i][j]="#";
            }
        }
    }
    
    void generate() {
        Stack<int[]> stack = new Stack<>();

        int x = start[0];
        int y = start[1];

        stack.push(new int[]{x, y});

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
                int[] popped = stack.pop();

                if (!goalPlaced) {
                    goalX = popped[0];
                    goalY = popped[1];
                    goalPlaced = true;
                }
            }
        }

        maze[goalX][goalY] = "G";

        maze[start[0]][start[1]] = "S";
    }

    public String[][] compute(){
        this.fill();
        this.generate();
        return maze;
    }
    
}