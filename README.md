# Portfolio

A portfolio of code I have written in my academic career.

## CastHelper

Case Helper is a python program that interfaces with the RIOT Games API using a library called Cassiopia (https://github.com/meraki-analytics/cassiopeia). Cast Helper is designed to help broadcasters of the game League Of Legends by providing a quick and easy way to find ability names of champions being played in a match. This project also makes use of CustomTkinter (https://github.com/TomSchimansky/CustomTkinter) to create a better user experience. Unfortunately this project does not work unless you have a RIOT games API key.

To use this tool, download the files and make a file named config.py. within that file make a apikey variable with the line:
 ```apikey = "PUT A VALID API KEY HERE"```

## Contract Management System

The Contract Management System is a collaboration between myself and 3 other students for our senior capstone. While this was a group project, I did the majority of the programing in the project.

This project is a web based hub for a company to keep track of workflows, contracts, and users. Each workflow has dynamically built steps and documents attached to each part of it's lifecycle.

## Personal Portfolio Website

This is my [website](https://www.onionjpg.dev/)! I used Vue to simulate a MacOS terminal with links to my various socials and portfolio pieces.

## Elevator Algorithm

Simply put, this is an algorithm used for routing elevators.  

Taking inspiration from SCAN, LOOK, OTHDSA, and other algorithms, this algorithm seeks to evenly distribute elevators among different sections of a building. The first scan that the elevator will complete will be on its own floor, before moving on the floor above it and floor below it. It will then seek two floors above the current floor, and then two floors beneath it. This will continue in this pattern until each floor of the building has been scanned by the elevator for requests. As it identifies requests on different floors, it will form an array of all of those requests from every possible floor. It ranks those requests based on two criteria: the distance the request is from the elevator’s current location, and whether or not the request is above or below the elevator’s current location, preferring that it is above the elevator. After scoring these requests, it places them into a priority queue and begins its journey to the floor of the first position in the queue.

Once reaching the floor of the first request in the queue, if a passenger is to get on at this stop as well, the elevator adds that to the priority queue and reranks every floor based on the previously stated conditions. Upon finishing the request, the elevator will remove the request from every priority queue from every elevator. This means that if elevator e0  completes a request on the third floor, it removes that request from the queues of e1 and e2 (assuming that there are three elevators operating in this example). The elevator then looks at the new, updated first request, and completes that, repeating the process above. This process will repeat until the queue is empty and there are no other requests to complete.

## EveryApp

A cataloging application for categorizing and displaying different apps on various app stores. This was a collaboration between myself and 3 other students.

## Sudoku Solver

A java program that solves Sudoku puzzles. It takes in a 2D array, where each 9 element array represents the nth row, and each element the nth column. This project originated from doing a technical interview for a company, which I was unable to solve in the time given, but worked on after the fact to make sure I could do it in the future.

