package com.example.aiMaze.utility;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Stack;

public class Maze_Generator {

    Random ran = new Random();
    int N,WALL,PATH,START,GOAL;

    public Maze_Generator(int N){
        this.N = N;
        this.WALL = 0;
        this.PATH = 1;
        this.START = 2;
        this.GOAL = 3;
    }

    private record Point(int y, int x) {}

    private class Frontier {
        int wallY, wallX;
        int oppY, oppX;

        public Frontier(int wallY, int wallX, int oppY, int oppX) {
            this.wallY = wallY;
            this.wallX = wallX;
            this.oppY = oppY;
            this.oppX = oppX;
        }
    }

    private void addFrontiers(int y, int x, List<Frontier> frontiers, int[][] maze) {
        int height = maze.length;
        int width = maze[0].length;
        int[][] directions = { {-2, 0}, {2, 0}, {0, -2}, {0, 2} };

        for (int[] dir : directions) {
            int dy = dir[0];
            int dx = dir[1];

            int wallY = y + dy / 2;
            int wallX = x + dx / 2;
            int oppY = y + dy;
            int oppX = x + dx;

            if (oppY >= 0 && oppY < height &&
                    oppX >= 0 && oppX < width &&
                    maze[oppY][oppX] == WALL) {
                frontiers.add(new Frontier(wallY, wallX, oppY, oppX));
            }
        }
    }

    public int[][] createMaze(int height, int width) {
        int mazeH = height * 2 + 1;
        int mazeW = width * 2 + 1;
        int[][] maze = new int[mazeH][mazeW];

        List<Frontier> frontiers = new ArrayList<>();

        int startX = ran.nextInt(width) * 2 + 1;
        int startY = ran.nextInt(height) * 2 + 1;

        maze[startY][startX] = PATH;
        addFrontiers(startY, startX, frontiers, maze);

        while (!frontiers.isEmpty()) {
            int index = ran.nextInt(frontiers.size());
            Frontier f = frontiers.remove(index);

            if (maze[f.oppY][f.oppX] == WALL) {
                maze[f.wallY][f.wallX] = PATH;
                maze[f.oppY][f.oppX] = PATH;
                addFrontiers(f.oppY, f.oppX, frontiers, maze);
            }
        }

        List<Point> pathCells = new ArrayList<>();
        for (int y = 1; y < mazeH; y += 2) {
            for (int x = 1; x < mazeW; x += 2) {
                if (maze[y][x] == PATH) {
                    pathCells.add(new Point(y, x));
                }
            }
        }

        if (pathCells.isEmpty()) {
            return maze;
        }

        Point startCell = pathCells.get(ran.nextInt(pathCells.size()));

        long maxDistSq = -1;
        Point endCell = null;

        for (Point cell : pathCells) {
            long dy = startCell.y() - cell.y();
            long dx = startCell.x() - cell.x();
            long distSq = (dy * dy) + (dx * dx);

            if (distSq > maxDistSq) {
                maxDistSq = distSq;
                endCell = cell;
            }
        }

        maze[startCell.y()][startCell.x()] = START;
        if (endCell != null) {
            maze[endCell.y()][endCell.x()] = GOAL;
        }

        return maze;
    }

    public String[][] generate(int[][] maze) {
        int n=maze.length;

        String[][] cmaze = new String[n][n];

        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                String ch=" ";
                if(maze[i][j]==WALL) ch="#";
                else if(maze[i][j]==PATH) ch=".";
                else if(maze[i][j]==START) ch="S";
                else if(maze[i][j]==GOAL) ch="G";
                cmaze[i][j] = ch;
            }
        }

        return cmaze;
    }

    public String[][] compute(){
        int[][] maze = createMaze(N,N);
        String[][] cmaze = generate(maze);
        return cmaze;
    }

}