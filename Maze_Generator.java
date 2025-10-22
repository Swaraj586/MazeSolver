import java.util.*;
public class Maze_Generator {
    static void fill(char[][] maze,int n){
        for(int i=0;i<=n;i++){
            for(int j=0;j<=n;j++){
                maze[i][j]='#';
            }
        }
    }
    static void display(char[][] maze,int n){
        for(int i=0;i<=n;i++){
            for(int j=0;j<=n;j++){
                System.out.print(maze[i][j]);
            }
            System.out.println();
        }
    }
    static void generate(char[][] maze, int n, int[] start) {
        Random ran = new Random();
        Stack<int[]> stack = new Stack<>();

        int x = start[0];
        int y = start[1];

        maze[x][y] = 'S';
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

            if (x - 2 > 0 && maze[x - 2][y] == '#') {
                neighbors.add(new int[]{x - 2, y});
            }
            if (x + 2 < n && maze[x + 2][y] == '#') {
                neighbors.add(new int[]{x + 2, y});
            }
            if (y - 2 > 0 && maze[x][y - 2] == '#') {
                neighbors.add(new int[]{x, y - 2});
            }
            if (y + 2 < n && maze[x][y + 2] == '#') {
                neighbors.add(new int[]{x, y + 2});
            }

            if (!neighbors.isEmpty()) {
                int[] chosen = neighbors.get(ran.nextInt(neighbors.size()));
                int nx = chosen[0];
                int ny = chosen[1];

                maze[(x + nx) / 2][(y + ny) / 2] = '.';
                maze[nx][ny] = '.';

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
        maze[goalX][goalY] = 'G';

        // And ensure 'S' is still at the start.
        maze[start[0]][start[1]] = 'S';
    }
    /*
    static void generate(char[][] maze,int n,int[] start){
        Random ran=new Random();
        int x=start[0],y=start[1];
        maze[x][y]='.';
        int i=20;
        while(i>0) {
            int way = ran.nextInt(4);
            if(way==0){
                if(x-1<=0 || maze[x-1][y]=='.') continue;
                maze[--x][y]='.';
            }
            else if(way==1){
                if(y+1>=n || maze[x][y+1]=='.') continue;
                maze[x][++y]='.';
            }
            else if(way==2){
                if(x+1>=n || maze[x+1][y]=='.') continue;
                maze[++x][y]='.';
            }
            else{
                if(y-1<=0 || maze[x][y-1]=='.') continue;
                maze[x][--y]='.';
            }
            i--;
        }
        maze[x][y]='G';
        maze[start[0]][start[1]]='S';
    }
    */
    public static void main(String[] args) {
        int n=10;
        char[][] maze=new char[n+1][n+1];
        int[] start=new int[2];
        start[0]=5;
        start[1]=5;
        fill(maze,n);
        generate(maze,n,start);
        display(maze,n);
    }
}