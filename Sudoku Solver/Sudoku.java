import java.util.ArrayList;

public class Sudoku {
    
    public static void main(String[] args) {

        int[][] puzzle = {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9}};

        // int[][] puzzle = {
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0},
        //     {0, 0, 0, 0, 0, 0, 0, 0, 0}};

        int[][] solution = new int[9][9];
        solution = copy(puzzle);
        solve(puzzle, solution);

        printPuzzle(puzzle);
        printPuzzle(solution);
    }

    /**
     * A method that solves a sudoku puzzle assuming it is solvable, does not work if 
     *  the puzzle is not possible to solve.
     * 
     * @param puzzle, a 2d integer array, the puzzle that you want to solve
     * @param solution, a 2d integer array, a copy of puzzle, ends as the finished puzzle
     */
    public static void solve(int[][] puzzle, int[][] solution) {

        //initializing variables
        int[][][] valid;     
        boolean solved = false;
        int counter;

        //while a solution hasn't been found
        while(!solved){
            valid = new int[9][9][];

            //setting Valid
            //for every row 
            for(int i = 0; i < 9; i++) {
                //for every column
                for(int j = 0; j < 9; j++) {
                    //make valid[i][j] the array of valid numbers at (i, j)
                    valid[i][j] = valid(solution, i, j).stream().mapToInt(x-> x).toArray();
                }
            }

            //filling solution w/ valid
            //for every row
            for(int i = 0; i < 9; i++) {
                //for every column
                for(int j = 0; j < 9; j++) {

                    //if the space is a filled cell already, skip
                    if (puzzle[i][j] != 0 || solution[i][j] != 0) {
                        continue;
                    }
                   
                    //if there is only 1 valid number
                    if(valid[i][j].length == 1) {
                        //make set that number in solution array
                        solution[i][j] = valid[i][j][0];
                    }
                }
            }

            //checking to see if solved
            //for every row
            counter = 0;
            for (int i = 0; i < 9; i++) {
                //for every column
                for (int j = 0; j < 9; j++) {
                    //if cell (i, j) has not been solved yet, add to the counter
                    if (solution[i][j] == 0 && puzzle[i][j] == 0) {
                       counter++;
                    } 
                }
            }

            //if their are 0 unsolved cells, end while loop
            if (counter == 0) {
                solved = true;
            }
        }
    };

    /**
     * A method that returns a list of every valid number for a given cell
     * 
     * @param puzzle, a 2d integer array, the puzzle you want to solve
     * @param x, an integer, the x coordinate of the cell
     * @param y, an integer, the y coordinate of the cell
     * @return valid, an ArrayList of Integers, a list of valid numbers for the cell
     */
    public static ArrayList<Integer> valid(int[][] puzzle, int x, int y){

        ArrayList<Integer> valid = new ArrayList<Integer>();
        boolean has;

        //if it is not a 0, meaning that cell already has an answer in it, return the empty array list
        if(puzzle[x][y] != 0) {
            return valid;
        }

        //Checking the row
        for(int i = 1; i <= 9; i++) {
            has = false;

            for(int col = 0; col < 9; col++) {
                if (i == puzzle[col][y]){
                    has = true;
                    continue;
                }
            }

            if(has) {
                continue;
            }

            //Checking the col
            for(int row = 0; row < 9; row++){
                if (i == puzzle[x][row]){
                    has = true;
                    continue;
                }
            }

            if(has) {
                continue;
            }

            //checking the 3x3
            int col = (x/3);
            int row = (y/3);
            for(int a = 0; a < 3; a++) {
                for(int b = 0; b < 3; b++){
                    if(i == puzzle[(col*3)+a][(row*3)+b]) {
                        has = true;
                        continue;
                    }
                }
            }

            if(has) {
                continue;
            }

            valid.add(i);
        }

        return valid;
    }

    /**
     * A method for printing the puzzle, prints the puzzle seperated by 3x3 cells
     * 
     * @param puzzle, a 2d integer array, the puzzle you want to print
     */
    public static void printPuzzle(int[][] puzzle) {

        String thisRow = "";

        for (int row = 0; row < 9; row++) {
            if((row%3) == 0){
                System.out.println("-------------------------");
            }
            for (int col = 0; col < 9; col++) {
                if((col%3) == 0){
                    thisRow += "| ";
                }
                thisRow +=  Integer.toString(puzzle[row][col]) + " ";
            }
            thisRow += "|";
            System.out.println(thisRow);
            thisRow = "";
        }

        System.out.println("-------------------------");

    }

    /**
     * a method for copying puzzles 
     * 
     * @param puzzle, a 2d integer array, the puzzle you want to make a copy of
     * @return copy, a 2d integer array, a copy of puzzle
     */
    public static int[][] copy(int[][] puzzle){
        int[][] copy = new int[9][9];
        
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                copy[i][j] = puzzle[i][j];
            }
        }

        return copy;
    }
}

