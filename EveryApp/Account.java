//
//
//

//================================================================== imports

import java.sql.*;

//================================================================== class

public class Account {

//================================================================== properties

    public String user;
    public String pass;
    public String accountType;
    public int accountTypeNum;

//================================================================== constructor

    public Account(String user, String pass, int accountTypeNum) {
        this.user = user;
        this.pass = pass;
        this.accountTypeNum = accountTypeNum;

        switch (accountTypeNum) {
            case 0:
                accountType = "User";
                break;
            case 1:
                accountType = "Moderator";
                break;
            case 2: 
                accountType = "Admin";
                break;
        }

    }

//================================================================== methods

    public static Account login(String user, String pass) {

        try {
            //connecting to the db
            Connection con=DriverManager.getConnection(  
                "jdbc:mysql://localhost:3306/db","root","password");

            //making the queuery
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM Accounts where Username = '"
            + user + "';");
            rs.next();

            String username = rs.getString(2);
            String password = rs.getString(3);

            //if the username and password match, create account object
            if (username.equals(user) && password.equals(pass)) {
                int accountNum = rs.getInt(4);
                Account acc = new Account(user, pass, accountNum);
                return acc;

            //if they don't match, return null
            } else {
                return null;
            }

        } catch(Exception e){ System.out.println(e);} 

        //if cant connect to db, return null
        return null;
    }

    public static Account createAccount(String username, String password) {
        return createAccount(username, password, 0);
    }

    public static Account createAccount(String username, String password, int accountTypeNum) {

        try {
            
            //connecting to db
            Connection con=DriverManager.getConnection(  
                "jdbc:mysql://localhost:3306/db","root","password");

            //MySQL statement that gets the max AppID to get the right number data rows
            Statement stmt=con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT MAX(AccountID) FROM Accounts");
            rs.next();
            int numberOfAccounts = rs.getInt(1);

            //making insert statement for appDecription table
            String query = " insert into Accounts (AccountID, Username, Password, Type)"
            + " values (?, ?, ?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(query);

            //puting data into the prepared statement
            preparedStmt.setInt(1, numberOfAccounts + 1);
            preparedStmt.setString(2, username);
            preparedStmt.setString(3, password);
            preparedStmt.setInt(4, accountTypeNum);
        
            //executing the prepared statement
            preparedStmt.execute();

            Account acc = new Account(username, password, accountTypeNum);
            return acc;

        }catch(Exception e){ System.out.println(e);} 
        return null;
    }
}
