
-----

# 🤖 AI Maze Solver (Spring Boot + React)

This is a full-stack web application that demonstrates classic AI algorithms for pathfinding and generation. The backend, built with Spring Boot, generates complex, random mazes and solves them using the A\* search algorithm. The React frontend provides an interactive interface for users to generate mazes, visualize them, and watch the solving animation in real-time.

This was created as a mini-project for our AI course.

-----

## 🧠 How It Works

The core of this project lies in two key AI algorithms:

### 1\. Maze Generation: Recursive Backtracker

The backend generates a "perfect" maze (a maze with a single, unique path between any two points) using the **Recursive Backtracker** algorithm. It starts with a grid full of walls (`#`) and "carves" out paths (`.`) by performing a randomized Depth-First Search. This ensures a complex and solvable maze every single time.

### 2\. Maze Solving: A\* (A-Star) Search

To find the shortest path from the start (`'S'`) to the goal (`'G'`), we implement the **A\* (A-Star) search algorithm**. A\* is a powerful, informed search algorithm that uses a heuristic (in this case, the "Manhattan distance") to intelligently guess which path is most likely to be the correct one, making it much more efficient than uninformed methods like BFS or DFS.

-----

## ✨ Features

  * **Dynamic Maze Generation:** Generate new mazes of various sizes (20x20, 30x30, 40x40) with a single click.
  * **AI-Powered Solver:** Click "Solve" to have the A\* algorithm find the shortest path.
  * **Real-time Animation:** Watch the solution path be drawn on the grid step-by-step.
  * **Full-Stack Architecture:** A clear separation of concerns, with a Spring Boot backend handling all AI logic and a React frontend for visualization.

-----

## 🛠️ Tech Stack

  * **Backend:** **Spring Boot** (Java)
  * **Frontend:** **React** (Vite + JavaScript)
  * **AI Algorithms:** Recursive Backtracker (Generation), A\* Search (Solving)
  * **API:** REST

-----

## 🔌 API Endpoints

The backend exposes two simple REST endpoints:

### `GET /generate`

  * **Description:** Generates a new random maze of a given size.
  * **Query Parameter:** `n` (e.g., `/generate?n=20`) - The size of the maze to be generated.
  * **Returns:** `String[][]` - A 2D JSON array representing the maze grid.

### `POST /solve`

  * **Description:** Solves a given maze and returns the shortest path.
  * **Request Body:** `char[][]` - A 2D JSON array representing the maze grid to be solved.
  * **Returns:** `int[][]` - A 2D JSON array of `[x, y]` coordinates representing the solution path from start to goal.

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

# Run the Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

-----