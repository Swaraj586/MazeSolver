package com.example.aiMaze.utility;

import java.util.List;

public class MazeSolutionResponse {

    private long time;
    private int[][] path;
    private List<int[]> visitedCells;

    public MazeSolutionResponse(long time, int[][] path, List<int[]> visitedCells)
    {
        this.time = time;
        this.path = path;
        this.visitedCells = visitedCells;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public int[][] getPath() {
        return path;
    }

    public void setPath(int[][] path) {
        this.path = path;
    }

    public List<int[]> getVisitedCells() {
        return visitedCells;
    }

    public void setVisitedCells(List<int[]> visitedCells) {
        this.visitedCells = visitedCells;
    }
}
