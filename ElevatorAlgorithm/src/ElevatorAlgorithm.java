
import java.util.Comparator;
import java.util.ArrayList;
import java.util.PriorityQueue;

public class ElevatorAlgorithm {
	
	public static void main(String[] args) {
			
		//declaring floor number, elevator number, and request array
		int n = 7;
		int e = 1;
		int[][] allReq = {{1, 3, 5}, {7, 7, 6}};

		//running the algorithm
		spiralAlg(n, e, allReq);		
	}
		
	/**
	 * The spiral algorithm which is a elevator scheduling algorithm
	 * 
	 * @param n - an int, the floors of the building
	 * @param e - an int, the number of elevators active in the building
	 * @param allReq - a 2d array of ints, all pick up request and their drop off request
	 */
	public static void spiralAlg(int n, int e, int[][] allReq){
		
		//initializing variables
		int[] curr = new int[e];
		ArrayList<Integer>[] visited = new ArrayList[e];
		PriorityQueue<Integer> req[] = new PriorityQueue[e];
		String[] floorLog = new String[e];
		int working;
		
		//for every elevator
		for(int i = 0; i < e; i++) {
			
			// make prio queue
			req[i] = new PriorityQueue<Integer>(5, (Comparator<? super Integer>) new Comparator<Integer>() {
				public int compare(Integer a, Integer b) {
					int rank =  (Math.abs(a - b));
					return rank;
				}});
			
			// make a visited list
			visited[i] = new ArrayList();
			
			// set current floor
			curr[i] = (int) Math.ceil(((i + 1.0) / (e + 1.0)) * n);
						
			// add base floor to log
			floorLog[i] = curr[i] + ": ";
						
			// scan for initial floors
			scan(i, e, n, req, allReq, curr, visited);
		}
		
		// variable for checking if empty
		boolean isEmpty = false;
		
		// while all queues are not empty
		while(!isEmpty) {
			
			// for every elevator
			for(working = 0; working < e; working++) {
				
				// clear and re add to queues
				req[working].clear();
				scan(working, e, n , req, allReq, curr, visited);
				
				//printing the log for every step in the algorithm
				System.out.print("[" + working + "] -> ");
				System.out.print(floorLog[working] + req[working].toString());	
				System.out.println();
				
				// check to see if any are empty
				for(int i = 0; i < req.length; i++) {
					if(!req[i].isEmpty()) {
						isEmpty = false;
					} else { 
						isEmpty = true;
					}
				}
			}
			
			// if all queues are empty, end
			if(isEmpty) {
				break;
			}
			
			// for each elevator
			for(working = 0; working < e; working++) {
				
				// check if the queue is empty
				if(req[working].isEmpty()) {
					break;
				}
				
				// move elevator to a new floor
				curr[working] = req[working].remove();
				
				// add new floor to the log
				floorLog[working] += curr[working] + " ";
				
				// add the new floor to visited list
				visited[working].add(curr[working]);
				
				// for every elevator
				for(int i = 0; i < e; i++) {
					
					// if that elevators queue has the current floor
					if(req[i].contains(curr[working])) {
						
						//while that floor is still in the queue
						while(req[i].contains(curr[working])) {
							
							//remove it from the queue
							req[i].remove(curr[working]);
						}
					}
				}
				
				// boolean for if it was a pick up or drop off
				boolean wasPickedup = false;
				
				// for every pick up of allReq
				for(int i = 0; i < allReq[0].length; i++) {
					
					// if the current floor is a pick up
					if(curr[working] == allReq[0][i]) {
						
						// as long as the queue doesn't already have it
						if (!req[working].contains(allReq[1][i])) {
							
							// add it to the queue
							req[working].add(allReq[1][i]);
							
							// if the requested floor has already been visited
							if (visited[working].contains(allReq[1][i])) {
							
								// remove it from the visited list
								visited[working].remove(Integer.valueOf(allReq[1][i]));
							}
							
							// set the floor to neg to show it was visited 
							allReq[0][i] = -allReq[0][i];
							
							// if the next element is the same this one
							// meaning if there are multiple pick ups on this floor
							if(allReq[0].length > i+1 && allReq[0][i] == -1 * allReq[0][i+1]) {
								// add the additional request
								req[working].add(allReq[1][i+1]);
								
								// if the requested floor has already been visited
								if (visited[working].contains(allReq[1][i+1])) {
									
									// remove it from the visited list
									visited[working].remove(allReq[1][i+1]);
								}
								
								//set the floor to neg to show it was visited
								allReq[0][i+1] = -allReq[0][i+1];
							}
							
							// set to show it was a pick up
							wasPickedup = false;
							break;
							
						// else meaning it already exist in the queue
						} else {
							
							// set the floor to neg, meaning it was visited
							allReq[0][i] = -allReq[0][i];
							
							// set to show it was a pick up
							wasPickedup = false;
							break;
						}
						
					// else meaning it was a drop off and not a pick up
					// it doesnt have to add a new floor to the queue
					} else {
						
						// set to show it was not a pick up
						wasPickedup = true;
					}
				}
				
				// if it was a drop off
				if (wasPickedup) {
					
					// check every element of the pick up request
					for(int i = 0; i < allReq[1].length; i++) {
						
						// if the current floor matches a request
						if (curr[working] == allReq[1][i]) {
							
							// set it to neg meaning it was visited
							allReq[1][i] = -allReq[1][i];
						}
					}
				}
			}
			System.out.println();
		}		
	}
	
	/**
	 * A method for creating queue's based on a scan of one above, one below, two above,
	 * 	two below, etc. until all floors have been searched.
	 * 
	 * @param working - an integer value, the working elevator, 
	 * @param e - an integer value, the number of elevators in the system
	 * @param n - an integer value, the number of floors in the system
	 * @param req - an array size e of Priority Queues, each elevators queue of request
	 * @param allReq - a 2 dimensional array of integers, every pick up and subsequent 
	 * 	drop off request in the system
	 * @param curr - an array of integer values, the current floor of every elevator
	 * @param visited - an array of Array List objects, a list of every elevators visited floors
	 */
	public static void scan(int working, int e, int n, PriorityQueue<Integer>[] req, int[][] allReq, int[] curr, ArrayList[] visited) {
			
		// for every floor of the building
		for(int i = 0; i < n; i++) {
			
			// check to make sure you are not going out of bounds above
			if((curr[working]+i) <= n) {
				
				// check every request in the pick up request
				for(int j = 0; j < allReq[0].length; j++) {
					
					// if the pick up request matches the current searched floor
					if (allReq[0][j] == curr[working]+i && allReq[0][j] > 0) {
						
						// add it to the queue
						req[working].add(curr[working]+i);
						
					// else if it matches a drop off request and has been visited already
					} else if (allReq[0][j] < 0 && allReq[1][j] == curr[working]+i
							&& visited[working].contains(-1 * allReq[0][j])) {
						
						// add it to the queue
						req[working].add(curr[working]+i);
					}
				}
			}
			
			// check to make sure you are not going out of bounds below (and not double 
			// dipping when i == 0
			if((curr[working]-i) >= 0 && i != 0) {
				
				// for every floor in the building
				for(int j = 0; j < allReq[0].length; j++) {
					
					// if the pick up request matches the current searched floor
					if (allReq[0][j] == curr[working]-i && allReq[0][j] > 0) {
						
						// if the queue does NOT already have the floor
						if(!req[working].contains(curr[working]-i)) {
							
							// add it to the queue
							req[working].add(curr[working]-i);
						}
					
					// else if the floor has already been checked (is negative), 
					// it's drop off request matches, and has already been visited
					} else if (allReq[0][j] < 0 && allReq[1][j] == curr[working]-i
							&& visited[working].contains(-1 * allReq[0][j])) {
						
						// if the queue does not already contain the searched floor
						if(!req[working].contains(curr[working]-i)) {
							
							// add it to the queue
							req[working].add(curr[working]-i);
						}
					}
				}
			}
		}
	}	 
}
