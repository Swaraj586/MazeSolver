package com.example.aiMaze.controller;

import com.example.aiMaze.utility.AStarEuclid;
import com.example.aiMaze.utility.MazeAStarSolver;
import com.example.aiMaze.utility.MazeSolutionResponse;
import org.springframework.web.bind.annotation.*;
import com.example.aiMaze.utility.Maze_Generator;

@CrossOrigin(origins = {"*"})
@RestController
public class GridController {

    @GetMapping("/generate")
    public String[][] gridCreater(@RequestParam int n){
        Maze_Generator maze = new Maze_Generator(n);
        String[][] grid = maze.compute();
        return grid;
    }

    @PostMapping("/solve")
    public MazeSolutionResponse gridSolver(@RequestBody char[][] grid){
        MazeAStarSolver solve = new MazeAStarSolver(grid);
        MazeSolutionResponse solution = solve.compute_path();
        return solution;
    }

    @PostMapping("/solveE")
    public MazeSolutionResponse gridSolverE(@RequestBody char[][] grid){
        AStarEuclid solve = new AStarEuclid(grid);
        MazeSolutionResponse solution = solve.compute_path();
        return solution;
    }


}
