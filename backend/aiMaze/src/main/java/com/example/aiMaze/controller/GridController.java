package com.example.aiMaze.controller;

import com.example.aiMaze.utility.MazeAStarSolver;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.aiMaze.utility.Maze_Generator;

@RestController
public class GridController {

    @PostMapping("/generate")
    public String[][] gridCreater(@RequestBody int n){
        Maze_Generator maze = new Maze_Generator(n);
        String[][] grid = maze.compute();
        return grid;
    }

    @PostMapping("/solve")
    public int[][] gridSolver(@RequestBody char[][] grid){
        MazeAStarSolver solve = new MazeAStarSolver(grid);
        int[][] solution = solve.compute_path();
        return solution;
    }


}
