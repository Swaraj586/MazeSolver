
-----

# 🤖 AI Maze Solver (Spring Boot + React)

This is a full-stack web application that demonstrates classic AI algorithms for pathfinding and generation. The backend, built with Spring Boot, generates complex, random mazes and solves them using the A\* search algorithm with two different heuristics: **Manhattan Distance** and **Euclidean Distance**.

The React frontend provides an interactive interface for users to generate mazes, visualize them, watch the solving animation in real-time, and see a direct performance comparison between the two heuristics in a bar chart.

This was created as a mini-project for our AI course.

-----

## 🧠 How It Works

The core of this project lies in two key areas:

### 1\. Maze Generation: Randomized Prim's Algorithm

The backend generates a "perfect" maze (a maze with a single, unique path between any two points) using a **Randomized Prim's Algorithm**. It starts with a grid full of walls (`#`), picks a starting cell, adds its neighboring walls (frontiers) to a list, and then iteratively and randomly carves paths to unvisited cells. This ensures a complex and solvable maze every single time.

### 2\. Maze Solving: A\* (A-Star) Search Comparison

To find the shortest path from the start (`'S'`) to the goal (`'G'`), we implement the **A\* (A-Star) search algorithm** twice, allowing for a direct comparison.

A\* is a powerful, informed search algorithm that uses a heuristic to intelligently guess which path is most likely to be the correct one. We compare two of the most popular heuristics:

  * **Manhattan Distance:** (`MazeAStarSolver.java`) Calculates the heuristic as the sum of the absolute differences of the coordinates. This is highly efficient for grids where only 4-directional movement is allowed.
  * **Euclidean Distance:** (`AStarEuclid.java`) Calculates the direct "as-the-crow-flies" distance between two points.

The application runs both algorithms on the same maze so you can see the performance difference in the final chart.

-----

## ✨ Features

  * **Dynamic Maze Generation:** Generate new, random mazes with a single click.
  * **Heuristic Comparison:** Solves the maze using both **Manhattan** and **Euclidean** heuristics and displays the backend execution time (in nanoseconds) for each in a bar chart.
  * **Two-Phase Animation:** Watch the visualization in two stages:
    1.  See all the cells the algorithm **explored** (`E`).
    2.  Watch the final **optimal path** (`*`) be drawn.
  * **Fun Feedback:** A confetti animation (`react-confetti`) plays when the solution is successfully found.
  * **Full-Stack Architecture:** A clear separation of concerns, with a Spring Boot backend handling all AI logic and a React frontend for visualization.

-----

## 🛠️ Tech Stack

  * **Backend:** **Spring Boot** (Java)
  * **Frontend:** **React** (Vite + JavaScript), **React Router**
  * **Visualization:** **Recharts** (for bar graphs), **React Confetti**
  * **AI Algorithms:** Randomized **Prim's Algorithm** (Generation), **A\* Search** (Manhattan & Euclidean Heuristics) (Solving)
  * **API:** REST

-----

## 🔌 API Endpoints

The backend exposes three simple REST endpoints:

### `GET /generate`

  * **Description:** Generates a new random maze.
  * **Query Parameter:** `n` (e.g., `/generate?n=10`) - The base size of the maze (generates a `(2n+1)x(2n+1)` grid).
  * **Returns:** `String[][]` - A 2D JSON array representing the maze grid.

### `POST /solve`

  * **Description:** Solves a given maze using the **Manhattan distance** heuristic.
  * **Request Body:** `char[][]` - A 2D JSON array representing the maze grid to be solved.
  * **Returns:** `MazeSolutionResponse` - A JSON object containing:
      * `time` (long): Execution time in nanoseconds.
      * `path` (int[][]): An array of `[row, col]` coordinates for the optimal path.
      * `visitedCells` (List\<int[]\>): A list of all cells explored by the algorithm.

### `POST /solveE`

  * **Description:** Solves a given maze using the **Euclidean distance** heuristic.
  * **Request Body:** `char[][]` - A 2D JSON array representing the maze grid to be solved.
  * **Returns:** `MazeSolutionResponse` - A JSON object with the same structure as `/solve`.

-----

## 🚀 How to Run

### 1\. Backend (Spring Boot)

First, `cd` into the backend directory.

```bash
# Assuming you are using Maven
./mvnw spring-boot:run

# Or if you are using Gradle
./gradlew bootRun
```

The server will start on `http://localhost:8080`.

### 2\. Frontend (React)

Open a new terminal and `cd` into the frontend directory.

```bash
# Install all required packages
npm install
```

```bash
# Run the Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).