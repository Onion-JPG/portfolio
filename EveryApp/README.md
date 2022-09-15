# EveryApp
EveryApp is a Java program which allows users to access programs across all OS platforms. This project is for our CSE201 - Software Developement class. To meet the clients needs, our program must allow all users to view, search, filter and sort through all of the apps in the repository. In addition, account holders can submit requests to admin for new apps to be added to the respository. The apps will have access links to how to download the apps on various platforms as well as a comment section about the apps. 

## .classpath
This file is needed for eclipes to recognize the .jar as a java file. It adds database funtionality and for the mysql-connector-java-8.0.28.jar file. 

## .gitignore
This is a file is for behind the scene github tracking information. 

## UserInterface.java
A GUI made with JFrame, used to display program content. With this Java class you find the buttons and tables we used for our GUI. It additionally sets up our tables in the GUI. We heavily used the mysql-connector-java-8.0.28.jar, lines which it is used is listed in our other documentation. This also uses infromation from our account object to display specific privilages.

This includes methods:
UserInterface() a constructor which build our GUI. It sets up panels which help to place our buttons in specific areas of the GUI. It also includes a text field for the search bar and a scroll pannel
FetchMainAppTable() builds and returns an empty Jtable for our app information.
setUpMainAppTableData() this is used to fill out empty Jtable with the information contained in our database. 
fetchQueueAppTable() This builds an area for the apps which are waiting to be approved by the admin.
setUpQueueAppTable() gets information about apps which have been submitted for review to be added to the main app table.
fetchCommentsTable() builds comment Jtable so that users can view and share comments about the app. 
setUpCommentsTable() gets information from the comments table of the database

## Account.java
A account object for use of logging in. This uses our mysql-connector-java-8.0.28.jar file to build queries to search for user account information as well as add new users to the our table. 

This includes methods : 
login() which takes two strings. It searches our db and returns an instance of the Account class.
createAccount() calls for two stings. It then classes a new method. It returns the an account object. 
createAccount() takes two strings and an int. The method will save the user inforation and assign the data and account type. It then creates and returns an account object with that new account information. 

## DBAdder.java
This class adds out EveryApp.txt files data into our database. 

This includes methods: 
main() creates the table with the txt file data. 
createsTables() connects to the data base and creates our respective tables. Application, appDiscription, AppstoAdd, Account, and Comments. 
add() takes a string array and creates inserts for our Application and appDiscription tables.

## lib
This contains our SQL connecter file. 
### mysql-connector-java-8.0.28.jar
It allows for us to run queries and make tables for our programs database. 

## EveryApp.java
This is our main class which is used to run the whole program. It creates a UserInterface object and sets some parameters. In its main method. 

## everyapp.txt
This contains the information which is getting loaded onto our main app table. It includes the related information found in our UML diagram for the app class. 

### Authors
Amanda Harkins  <br />
Caden Citro  <br />
J Scherrer  <br />
Bill Hutson   
