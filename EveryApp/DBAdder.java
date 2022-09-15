//a quick class to add apps from a text file to our database for quick filling
//intended for 1 time use

import java.sql.*;
import java.io.File;  
import java.util.Scanner;

public class DBAdder {

    public static void main(String[] args) {


       try {

        createTables();
        
        File myObj = new File("everyApp.txt");
        Scanner reader = new Scanner(myObj);
        while (reader.hasNextLine()) {
            String data = reader.nextLine();
            String[] arr = data.split("\\t");
            
            add(arr);
        }
        reader.close();
           
       } catch (Exception e) { 
        System.out.println(e); 
        System.out.println(e.getStackTrace()[0]);
        } 

    }

    public static void createTables() throws Exception {

        try {
            //connecting to db
            Connection con=DriverManager.getConnection(  
                "jdbc:mysql://localhost:3306/db","root","password");

            //creating Application table
            PreparedStatement create = con.prepareStatement("CREATE TABLE Application( AppId integer NOT NULL, AppName varchar(50) NOT NULL, Developer varchar(50) NOT NULL, " +  
            "ReleaseDate date, AppPlatform varchar(50), AppVersion varchar(50) NOT NULL, price double, PRIMARY KEY (AppId));");
            create.executeUpdate();

            //creating appDescription table
            create = con.prepareStatement("CREATE TABLE AppDescription( descriptionID integer NOT NULL, appID integer NOT NULL, " +
                "appDescription varchar(1000), PRIMARY KEY (descriptionID), FOREIGN KEY (appID) REFERENCES Application (appID));");
            create.executeUpdate();

            //creating AppsToAdd table
            create = con.prepareStatement("CREATE TABLE AppsToAdd( AppToAddId integer NOT NULL, AppName varchar(50) NOT NULL, Developer varchar(50) NOT NULL, ReleaseDate date, " +
                "AppPlatform varchar(50), AppVersion varchar(50) NOT NULL, price double, appDescription varchar(1000));");
            create.executeUpdate();

            //creating Account table
            create = con.prepareStatement("CREATE TABLE Accounts( AccountID integer NOT NULL UNIQUE, Username varchar(20) NOT NULL UNIQUE, " +
            "Password varchar(20) NOT NULL, Type integer NOT NULL, PRIMARY KEY (AccountID));");
            create.executeUpdate();

            //creating Comments table
            create = con.prepareStatement("CREATE TABLE Comments(commentID integer NOT NULL UNIQUE, appID integer NOT NULL, username varchar(20) NOT NULL, " +
                "comment varchar(500), FOREIGN KEY (appID) REFERENCES Application (appID),  FOREIGN KEY (username) REFERENCES Accounts (username));");
            create.executeUpdate();

            con.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public static void add(String[] data) {
        try {

            //connecting to db
            Connection con=DriverManager.getConnection(  
                "jdbc:mysql://localhost:3306/db","root","password");

            //making insert statement for application table
            String query = " insert into Application (appId, AppName, Developer, ReleaseDate, AppPlatform, AppVersion, price)"
                + " values (?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(query);
            
            //converting date string to date object
            java.sql.Date dateT;
            try {
                dateT = java.sql.Date.valueOf(data[3]);
            } catch (Exception e) {
                dateT = null;
            }

            //puting the data into the prepared statement
            preparedStmt.setInt(1, Integer.parseInt(data[0]));
            preparedStmt.setString(2, data[1]);
            preparedStmt.setString(3, data[2]);

            
            preparedStmt.setDate(4, dateT);
            preparedStmt.setString(5, data[4]);
            preparedStmt.setString(6, data[5]);
            preparedStmt.setDouble(7, Double.parseDouble(data[6]));
        
            //execute the prepared statement
            preparedStmt.execute();
                
            //making insert statement for appDecription table
            query = " insert into appDescription (descriptionID, appId, appDescription)"
                + " values (?, ?, ?)";
            preparedStmt = con.prepareStatement(query);

            //puting data into the prepared statement
            preparedStmt.setInt(1, Integer.parseInt(data[0]));
            preparedStmt.setInt(2, Integer.parseInt(data[0]));
            preparedStmt.setString(3, data[7]);
            
            //executing the prepared statement
            preparedStmt.execute();
            con.close();
        } catch (Exception e) { System.out.println(e); }
    }
}
