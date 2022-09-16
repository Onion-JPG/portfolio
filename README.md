# Portfolio

A portfolio of code I have written in my academic career.

## Elevator Algorithm

Simply put, this is an algorithm used for routing elevators.  

Taking inspiration from SCAN, LOOK, OTHDSA, and other algorithms, this algorithm seeks to evenly distribute elevators among different sections of a building. The first scan that the elevator will complete will be on its own floor, before moving on the floor above it and floor below it. It will then seek two floors above the current floor, and then two floors beneath it. This will continue in this pattern until each floor of the building has been scanned by the elevator for requests. As it identifies requests on different floors, it will form an array of all of those requests from every possible floor. It ranks those requests based on two criteria: the distance the request is from the elevator’s current location, and whether or not the request is above or below the elevator’s current location, preferring that it is above the elevator. After scoring these requests, it places them into a priority queue and begins its journey to the floor of the first position in the queue.

Once reaching the floor of the first request in the queue, if a passenger is to get on at this stop as well, the elevator adds that to the priority queue and reranks every floor based on the previously stated conditions. Upon finishing the request, the elevator will remove the request from every priority queue from every elevator. This means that if elevator e0  completes a request on the third floor, it removes that request from the queues of e1 and e2 (assuming that there are three elevators operating in this example). The elevator then looks at the new, updated first request, and completes that, repeating the process above. This process will repeat until the queue is empty and there are no other requests to complete.

### Authors
Caden Citro
Darcy Hayes

## EveryApp

A cataloging application for categorizing and displaying different apps on various app stores.

### Authors
Caden Citro <br />
Amanda Harkins <br />
J Scherrer <br />
Bill Hutson
