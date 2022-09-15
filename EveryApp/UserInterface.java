// Author: Caden Citro, J Scherrer, Amanda Harkins, Bill Hutson
// Date: 3-27-2022
// Purpose: A user interface method

//================================================================== imports

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

//================================================================== Class

public class UserInterface extends JFrame {

//================================================================== properties

	// JPanel
	private JPanel northPanel;
	private JPanel centerPanel;
	private JPanel southPanel;

	// JTable
	private static JTable appTable;
	private static JTable appsToAddTable;
	private static JTable commentsTable;

	// JButton
	private JButton descButton;
	private JButton addButton;
	private JButton filterButton;
	private JButton sortButton;
	private JButton removeButton;
	private JButton loginButton;
	private JButton searchButton;
	private JButton refreshButton;
	private JButton showQueueButton;

	// JTextField
	private JTextField searchField;

	// DefaultTableModel
	private static DefaultTableModel tableModel;
	private static DefaultTableModel appsToAddModel;
	private static DefaultTableModel commentsModel;

	// Deminsions
	static final int WIDTH = 700;
	static final int HEIGHT = 600;

	// Number of apps in db
	private int numberOfApps;
	private int numberOfAppsToAdd;
	private int numberOfComments;

	// 2D array that contains the data
	private String[][] data;

	// Account of the user
	Account userAccount = null;

//================================================================== Constructors

	public UserInterface() {
		UserInterfaceConstructor();
	}

//================================================================== Methods

	private void UserInterfaceConstructor() {
		// panel
		northPanel = new JPanel();
		centerPanel = new JPanel();
		southPanel = new JPanel();

		// setting up tables
		fetchMainAppTable();
		setUpMainAppTableData();

		fetchQueueAppTable();
		setUpQueueAppTableData();

		fetchCommentsTable();
		setUpCommentsTableData(1);

		// JScrollPane
		JScrollPane scrollPane = new JScrollPane(appTable);

		// JButtons
		descButton = new JButton("Show Description");
		addButton = new JButton("Add an App");
		removeButton = new JButton("Remove an App");
		filterButton = new JButton("Filter");
		sortButton = new JButton("Sort");
		loginButton = new JButton("Login");
		searchButton = new JButton("Search");
		refreshButton = new JButton("Refresh Table");
		showQueueButton = new JButton("Show Queue");

		// JTextField
		searchField = new JTextField(20);

		// button that searches the for any entries whos name contains the term
		searchButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {
				tableModel.setRowCount(0);

				try {
					// connect to the db
					Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");

					// MySQL select statement
					Statement stmt = con.createStatement();
					data = new String[numberOfApps][6];
					ResultSet rs = stmt.executeQuery(
							"select * from Application WHERE AppName LIKE '%" + searchField.getText() + "%';");

					// filling in data for the table
					for (int i = 0; i < numberOfApps; i++) {
						rs.next();
						data[i][0] = rs.getString("AppName");
						data[i][1] = rs.getString("Developer");
						data[i][2] = rs.getString("ReleaseDate");
						data[i][3] = rs.getString("AppPlatform");
						data[i][4] = rs.getString("AppVersion");
						data[i][5] = rs.getString("Price");
						tableModel.addRow(data[i]);
					}

					// close connection and remake table
					con.close();
					fetchMainAppTable();

				} catch (Exception e) {
					System.out.println(e);
				}

				// sets table model
				appTable.setModel(tableModel);
			}
		});

		// button that refreshes the table
		refreshButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {
				// clears the table by deleting all rows
				tableModel.setRowCount(0);

				// re-enters the data
				setUpMainAppTableData();
			}
		});

		// show queue to make pop up with a table for all the apps in the queue
		showQueueButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				if (numberOfAppsToAdd == 0) {
					JOptionPane.showMessageDialog(southPanel, "The queue is empty", "Empty", JOptionPane.ERROR_MESSAGE);
					return;
				}

				JPanel appToAddPanel = new JPanel();

				appToAddPanel.add(appsToAddTable);

				if (userAccount != null && userAccount.accountType == "Admin") {
					String[] options = { "Deny", "Approve" };
					int result = JOptionPane.showOptionDialog(southPanel, appToAddPanel, "Add App",
							JOptionPane.DEFAULT_OPTION, JOptionPane.INFORMATION_MESSAGE, null, options, options[1]);

					if (result == 1) {
						// approve
						// add app to table
						try {

							// connecting to db
							Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
									"password");

							// making insert statement for application table
							String query = " insert into Application (appId, AppName, Developer, ReleaseDate, AppPlatform, AppVersion, Price)"
									+ " values (?, ?, ?, ?, ?, ?, ?)";
							PreparedStatement preparedStmt = con.prepareStatement(query);

							// converting to addable objects
							String name = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 0);
							String dev = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 1);
							String date = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 2);
							java.sql.Date dateT = java.sql.Date.valueOf(date);
							String platform = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 3);
							String version = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 4);
							String description = (String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 5);
							double price = Double.parseDouble((String) appsToAddModel.getValueAt(appsToAddTable.getSelectedRow(), 6));

							// incrementing the number of apps
							numberOfApps = numberOfApps + 1;

							// puting the data into the prepared statement
							preparedStmt.setInt(1, numberOfApps);
							preparedStmt.setString(2, name);
							preparedStmt.setString(3, dev);
							preparedStmt.setDate(4, dateT);
							preparedStmt.setString(5, platform);
							preparedStmt.setString(6, version);
							preparedStmt.setDouble(7, price);

							// execute the prepared statement
							preparedStmt.execute();

							// making insert statement for appDecription table
							query = " insert into appDescription (descriptionID, appId, appDescription)"
									+ " values (?, ?, ?)";
							preparedStmt = con.prepareStatement(query);

							// puting data into the prepared statement
							preparedStmt.setInt(1, numberOfApps);
							preparedStmt.setInt(2, numberOfApps);
							preparedStmt.setString(3, description);

							// executing the prepared statement
							preparedStmt.execute();

							// adding row to JTable
							String priceString = "" + price;
							String[] rowData = { name, dev, date, platform, version, priceString };
							tableModel.addRow(rowData);
							tableModel.fireTableDataChanged();

							// getting the app that needs deleted from selected row
							String appToDelete = (String) appsToAddTable.getValueAt(appsToAddTable.getSelectedRow(), 0);

							// making the queuery
							Statement stmt = con.createStatement();
							ResultSet rs = stmt.executeQuery(
									"SELECT AppToAddId FROM AppsToAdd where AppName = '" + appToDelete + "';");
							rs.next();
							int appID = rs.getInt(1);

							// delete statements
							String sql = "DELETE FROM AppsToAdd WHERE AppToAddId = '" + appID + "';";
							stmt.executeUpdate(sql);

							// removing the row from the JTable
							appsToAddModel.removeRow(appsToAddTable.getSelectedRow());
							appsToAddModel.fireTableDataChanged();

							numberOfAppsToAdd--;

						} catch (Exception e) {
							System.out.println(e);
						}

						// remove app from queue
					} else if (result == 0) {
						// deny
						try {
							// connecting to the db
							Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
									"password");

							// getting the app that needs deleted from selected row
							String appToDelete = (String) appsToAddTable.getValueAt(appsToAddTable.getSelectedRow(), 0);

							// making the queuery
							Statement stmt = con.createStatement();
							ResultSet rs = stmt.executeQuery(
									"SELECT AppToAddId FROM AppsToAdd where AppName = '" + appToDelete + "';");
							rs.next();
							int appID = rs.getInt(1);

							// delete statements
							String sql = "DELETE FROM AppsToAdd WHERE AppToAddId = '" + appID + "';";
							stmt.executeUpdate(sql);

							// removing the row from the JTable
							appsToAddModel.removeRow(appsToAddTable.getSelectedRow());
							appsToAddModel.fireTableDataChanged();

							numberOfAppsToAdd--;

						} catch (Exception e) {
							System.out.println(e);
						}
					}
				} else {
					JOptionPane.showMessageDialog(southPanel, appToAddPanel);
				}
			}
		});

		// button fetches the description from the AppDescription table
		descButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				if (appTable.getSelectedRow() != -1) {
					try {
						// looper ensures comments window reopens where necessary
						boolean looper = true;
						while (looper) {
							// connect to the db
							Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
									"password");

							// making the MySQL statement to get the appID of the app
							Statement stmt = con.createStatement();
							ResultSet rs = stmt.executeQuery("select appID from Application where appName = '"
									+ appTable.getValueAt(appTable.getSelectedRow(), 0) + "';");
							rs.next();
							String IDOfApp = rs.getString(1);

							// making the MySQL statement to get the description of the app
							rs = stmt.executeQuery(
									"select appDescription from appDescription where appID = '" + IDOfApp + "';");
							rs.next();
							String descOfApp = rs.getString(1);

							// pop up that shows the description

							JPanel panel = new JPanel();
							JTextArea descArea = new JTextArea(5, 40);
							descArea.setWrapStyleWord(true);
							descArea.setLineWrap(true);
							descArea.append(descOfApp);
							JScrollPane desc = new JScrollPane(descArea);
							panel.add(desc);

							// ground work for comments here
							int appNum = Integer.parseInt(IDOfApp);
							commentsModel.setRowCount(0);
							setUpCommentsTableData(appNum);
							JScrollPane commentScroll = new JScrollPane(commentsTable);
							panel.add(commentScroll);
							looper = false;

							con.close();

							Object[] options = { "Remove Comment", "Add Comment", "OK" };
							int result = JOptionPane.showOptionDialog(southPanel, panel, "Details",
									JOptionPane.DEFAULT_OPTION, JOptionPane.DEFAULT_OPTION, null, options, options[1]);

							if (result == 0) {
								if (userAccount == null) {
									JOptionPane.showMessageDialog(southPanel, "Sign in then try again", "Error",
											JOptionPane.ERROR_MESSAGE);
									return;
								} else if (userAccount.accountType.equals("Admin")
										|| userAccount.accountType.equals("Moderator")) {
									if (commentsTable.getSelectedRow() != -1) {
										Object[] options1 = { "Cancel", "Remove" };
										int result1 = JOptionPane.showOptionDialog(southPanel,
												"Are you sure you want to remove the comment by "
														+ commentsTable.getValueAt(commentsTable.getSelectedRow(), 0),
												"Remove", JOptionPane.DEFAULT_OPTION, JOptionPane.WARNING_MESSAGE, null,
												options1, options1[1]);
										if (result1 == 1) {
											try {
												looper = true;
												// connecting to the db
												con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db",
														"root", "password");

												// getting the comment that needs deleted from selected row
												String comment = (String) commentsTable
														.getValueAt(commentsTable.getSelectedRow(), 1);

												// making the query
												stmt = con.createStatement();
												rs = stmt.executeQuery("SELECT commentID FROM Comments where comment = '"
												+ comment + "';");
												rs.next();
												int commentID = rs.getInt(1);

												// delete statements
												String sql = "DELETE FROM Comments WHERE commentID = '" + commentID
														+ "';";
												stmt.executeUpdate(sql);

												// removing the row from the JTable
												commentsModel.removeRow(commentsTable.getSelectedRow());
												commentsModel.fireTableDataChanged();

												con.close();

											} catch (Exception e) {
												System.out.println(e);
											}
										}
									} else {
										// if no row is selected, pop up error
										JOptionPane.showMessageDialog(southPanel, "No comment is selected. Try again.",
												"Error", JOptionPane.ERROR_MESSAGE);
									}
								} else {
									looper = true;
									JOptionPane.showMessageDialog(southPanel, "You do not have access", "Error",
											JOptionPane.ERROR_MESSAGE);
								}
							} else if (result == 1) {
								if (userAccount == null) {
									JOptionPane.showMessageDialog(southPanel, "Sign in then try again", "Error",
											JOptionPane.ERROR_MESSAGE);
									return;
								}
								// making a new panel for pop up
								JPanel addCommentPanel = new JPanel();
								GridLayout grid = new GridLayout(7, 2);
								addCommentPanel.setLayout(grid);

								// JTextFields for fillable info
								JTextField comment = new JTextField(50);

								// adding to comment panel
								addCommentPanel.add(new JLabel("Comment"));
								addCommentPanel.add(comment);

								// popup creation
								Object[] options2 = { "Cancel", "Add" };
								int result2 = JOptionPane.showOptionDialog(southPanel, addCommentPanel, "Add Comment",
										JOptionPane.DEFAULT_OPTION, JOptionPane.WARNING_MESSAGE, null, options2,
										options2[1]);
								if (result2 == 1) {
									try {
										looper = true;
										// connecting to db
										con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
												"password");

										// getting new commentID
										stmt = con.createStatement();
										rs = stmt.executeQuery("SELECT MAX(commentID) FROM Comments");
										rs.next();
										numberOfComments = rs.getInt(1);
										int newCommentID = numberOfComments + 1;

										// prepare sql statement
										String sql = "INSERT INTO Comments( commentID, appID, username, comment) VALUES (?, ?, ?, ?)";
										PreparedStatement preparedStmt = con.prepareStatement(sql);

										// set sql values
										preparedStmt.setInt(1, newCommentID);
										preparedStmt.setInt(2, appNum);
										preparedStmt.setString(3, userAccount.user);
										preparedStmt.setString(4, comment.getText());

										// run sql statement
										preparedStmt.execute();

										// adding row to JTable
										String[] commentData = { userAccount.user, comment.getText() };
										commentsModel.addRow(commentData);
										commentsModel.fireTableDataChanged();

										con.close();

									} catch (Exception e) {
										System.out.println(e);
									}

								}
							}
						}
					} catch (Exception e) {
						System.out.println(e);
					}

				} else {
					// if no row is selected, pop up error
					JOptionPane.showMessageDialog(southPanel, "Select a row then try again", "Error",
							JOptionPane.ERROR_MESSAGE);
				}
			}

		});

		// button that inserts a new app to the table
		addButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				if (userAccount == null) {
					JOptionPane.showMessageDialog(southPanel, "Sign in then try again", "Error",
							JOptionPane.ERROR_MESSAGE);
					return;
				}
				// making a new panel for pop up
				JPanel addAppPanel = new JPanel();
				GridLayout grid = new GridLayout(7, 2);
				addAppPanel.setLayout(grid);

				// JTextFields for fillable info
				JTextField name = new JTextField(50);
				JTextField dev = new JTextField(50);
				JTextField date = new JTextField(10);
				JTextField platform = new JTextField(50);
				JTextField version = new JTextField(50);
				JTextField description = new JTextField(50);
				JTextField price = new JTextField(50);

				// adding to add app panel
				addAppPanel.add(new JLabel("Name of app"));
				addAppPanel.add(name);
				addAppPanel.add(new JLabel("Developer of app"));
				addAppPanel.add(dev);
				addAppPanel.add(new JLabel("Publish Date of app"));
				addAppPanel.add(date);
				addAppPanel.add(new JLabel("Platform of app"));
				addAppPanel.add(platform);
				addAppPanel.add(new JLabel("Version of app"));
				addAppPanel.add(version);
				addAppPanel.add(new JLabel("Description of app"));
				addAppPanel.add(description);
				addAppPanel.add(new JLabel("Price of app"));
				addAppPanel.add(price);

				// popup creation
				Object[] options = { "Cancel", "Add" };
				int result = JOptionPane.showOptionDialog(southPanel, addAppPanel, "Add App",
						JOptionPane.DEFAULT_OPTION, JOptionPane.WARNING_MESSAGE, null, options, options[1]);
				if (result == 1) {
					if (userAccount.accountTypeNum == 2) {
						try {

							// connecting to db
							Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
									"password");

							// making insert statement for application table
							String query = " insert into Application (appId, AppName, Developer, ReleaseDate, AppPlatform, AppVersion, price)"
									+ " values (?, ?, ?, ?, ?, ?, ?)";
							PreparedStatement preparedStmt = con.prepareStatement(query);

							// converting date string to date object
							java.sql.Date dateT = java.sql.Date.valueOf(date.getText());

							// incrementing the number of apps
							numberOfApps = numberOfApps + 1;

							// puting the data into the prepared statement
							preparedStmt.setInt(1, numberOfApps);
							preparedStmt.setString(2, name.getText());
							preparedStmt.setString(3, dev.getText());
							preparedStmt.setDate(4, dateT);
							preparedStmt.setString(5, platform.getText());
							preparedStmt.setString(6, version.getText());
							preparedStmt.setDouble(7, Double.parseDouble(price.getText()));

							// execute the prepared statement
							preparedStmt.execute();

							// making insert statement for appDecription table
							query = " insert into appDescription (descriptionID, appId, appDescription)"
									+ " values (?, ?, ?)";
							preparedStmt = con.prepareStatement(query);

							// puting data into the prepared statement
							preparedStmt.setInt(1, numberOfApps);
							preparedStmt.setInt(2, numberOfApps);
							preparedStmt.setString(3, description.getText());

							// executing the prepared statement
							preparedStmt.execute();

							// adding row to JTable
							String[] rowData = { name.getText(), dev.getText(), date.getText(), platform.getText(),
									version.getText(), price.getText() };
							tableModel.addRow(rowData);
							tableModel.fireTableDataChanged();

						} catch (Exception e) {
							System.out.println(e);
						}
					} else {

						// add app to queue, table and sql
						try {

							// connecting to db
							Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
									"password");

							Statement stmt = con.createStatement();
							ResultSet rs = stmt.executeQuery("SELECT MAX(AppToAddId) FROM AppsToAdd");
							rs.next();
							numberOfAppsToAdd = rs.getInt(1);

							// making insert statement for application table
							String query = " insert into AppsToAdd (AppToAddId, AppName, Developer, ReleaseDate, AppPlatform, AppVersion, appDescription, price)"
									+ " values (?, ?, ?, ?, ?, ?, ?, ?)";
							PreparedStatement preparedStmt = con.prepareStatement(query);

							// converting date string to date object
							java.sql.Date dateT = java.sql.Date.valueOf(date.getText());

							// incrementing the number of apps to add
							numberOfAppsToAdd = numberOfAppsToAdd + 1;

							// puting the data into the prepared statement
							preparedStmt.setInt(1, numberOfAppsToAdd);
							preparedStmt.setString(2, name.getText());
							preparedStmt.setString(3, dev.getText());
							preparedStmt.setDate(4, dateT);
							preparedStmt.setString(5, platform.getText());
							preparedStmt.setString(6, version.getText());
							preparedStmt.setString(7, description.getText());
							preparedStmt.setDouble(8, Double.parseDouble(price.getText()));

							// execute the prepared statement
							preparedStmt.execute();

							// adding row to JTable
							if (appsToAddModel != null && appsToAddTable != null) {
								String[] rowData = { name.getText(), dev.getText(), date.getText(), platform.getText(),
										version.getText(), description.getText(), price.getText() };
								appsToAddModel.addRow(rowData);
								appsToAddModel.fireTableDataChanged();
							}

						} catch (Exception e) {
							System.out.println(e);
						}
					}
				}
			}

		});

		// button that removes the selected row from the JTable and MySQL db
		removeButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				if (userAccount == null) {
					JOptionPane.showMessageDialog(southPanel, "Sign in then try again", "Error",
							JOptionPane.ERROR_MESSAGE);
					return;
				}

				if (userAccount.accountType.equals("Admin")) {
					if (appTable.getSelectedRow() != -1) {
						Object[] options = { "Cancel", "Remove" };
						int result = JOptionPane.showOptionDialog(southPanel,
								"Are you sure you want to remove " + appTable.getValueAt(appTable.getSelectedRow(), 0),
								"Remove", JOptionPane.DEFAULT_OPTION, JOptionPane.WARNING_MESSAGE, null, options,
								options[1]);
						if (result == 1) {
							try {
								// connecting to the db
								Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
										"password");

								// getting the app that needs deleted from selected row
								String appToDelete = (String) appTable.getValueAt(appTable.getSelectedRow(), 0);

								// making the queuery
								Statement stmt = con.createStatement();
								ResultSet rs = stmt.executeQuery(
										"SELECT AppID FROM Application where AppName = '" + appToDelete + "';");
								rs.next();
								int appID = rs.getInt(1);

								// delete statements
								String sql = "DELETE FROM AppDescription WHERE AppID = '" + appID + "';";
								stmt.executeUpdate(sql);
								sql = "DELETE FROM Application WHERE AppID = '" + appID + "';";
								stmt.executeUpdate(sql);

								// removing the row from the JTable
								tableModel.removeRow(appTable.getSelectedRow());
								tableModel.fireTableDataChanged();

							} catch (Exception e) {
								System.out.println(e);
							}
						}
					} else {
						// if no row is selected, pop up error
						JOptionPane.showMessageDialog(southPanel, "No app is Selected. Try again.", "Error",
								JOptionPane.ERROR_MESSAGE);
					}
				} else {
					JOptionPane.showMessageDialog(southPanel, "You do not have access", "Error",
							JOptionPane.ERROR_MESSAGE);
				}

			}
		});

		// button that filters applications
		filterButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				JPanel filterPanel = new JPanel();
				GridLayout grid = new GridLayout(6, 6);
				filterPanel.setLayout(grid);

				// JTextField filterField = new JTextField(10);

				JLabel l1 = new JLabel("Filter by App Store");
				JRadioButton rb1 = new JRadioButton();
				rb1.setText("Apple App Store");
				JRadioButton rb2 = new JRadioButton();
				rb2.setText("Google Play");
				JRadioButton rb3 = new JRadioButton();
				rb3.setText("Microsoft Store");
				JRadioButton rb4 = new JRadioButton();
				rb4.setText("PlayStation Store");

				ButtonGroup g1 = new ButtonGroup();

				// filterPanel.add(filterField);
				filterPanel.add(l1);
				filterPanel.add(rb1);
				filterPanel.add(rb2);
				filterPanel.add(rb3);
				filterPanel.add(rb4);

				g1.add(rb1);
				g1.add(rb2);
				g1.add(rb3);
				g1.add(rb4);

				Object[] options = { "Cancel", "Filter" };
				int result = JOptionPane.showOptionDialog(southPanel, filterPanel, "Filter", JOptionPane.DEFAULT_OPTION,
						JOptionPane.QUESTION_MESSAGE, null, options, options[1]);

				if (result == 1) {
					try {
						// empties app catalog
						tableModel.setRowCount(0);

						// connecting to db
						Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
								"password");

						String column = null;
						String condition = null;

						if (rb1.isSelected()) {
							column = "AppPlatform";
							condition = "Apple";
						} else if (rb2.isSelected()) {
							column = "AppPlatform";
							condition = "Google";
						} else if (rb3.isSelected()) {
							column = "AppPlatform";
							condition = "Microsoft";
						} else {
							column = "AppPlatform";
							condition = "PlayStation";
						}

						// MySQL sort statement
						Statement stmt = con.createStatement();
						data = new String[numberOfApps][6];
						// System.out.println("SELECT * FROM Application WHERE AppPlatform LIKE '%" +
						// type + "%';");
						ResultSet rs = stmt.executeQuery(
								"SELECT * FROM Application WHERE " + column + " LIKE '%" + condition + "%';");

						// filling in data for the table
						for (int i = 0; i < numberOfApps; i++) {
							rs.next();
							data[i][0] = rs.getString("AppName");
							data[i][1] = rs.getString("Developer");
							data[i][2] = rs.getString("ReleaseDate");
							data[i][3] = rs.getString("AppPlatform");
							data[i][4] = rs.getString("AppVersion");
							data[i][5] = rs.getString("price");
							tableModel.addRow(data[i]);
						}

						// close connection and remake table
						con.close();
						fetchMainAppTable();

					} catch (Exception e) {
						System.out.println(e);
					}

					appTable.setModel(tableModel);
				}

			}
		});

		// button that sorts the table in various ways
		sortButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {

				JPanel sortPanel = new JPanel();
				GridLayout grid = new GridLayout(4, 4);
				sortPanel.setLayout(grid);

				JRadioButton rb1 = new JRadioButton();
				rb1.setText("Sort by Newest");
				JRadioButton rb2 = new JRadioButton();
				rb2.setText("Sort by Oldest");
				JRadioButton rb3 = new JRadioButton();
				rb3.setText("Sort alphabetically (A - Z)");
				JRadioButton rb4 = new JRadioButton();
				rb4.setText("Sort alphabetically (Z - A)");

				ButtonGroup g1 = new ButtonGroup();

				sortPanel.add(rb1);
				sortPanel.add(rb2);
				sortPanel.add(rb3);
				sortPanel.add(rb4);

				g1.add(rb1);
				g1.add(rb2);
				g1.add(rb3);
				g1.add(rb4);

				Object[] options = { "Cancel", "Sort" };
				int result = JOptionPane.showOptionDialog(southPanel, sortPanel, "Sort", JOptionPane.DEFAULT_OPTION,
						JOptionPane.QUESTION_MESSAGE, null, options, options[1]);

				if (result == 1) {
					try {
						// empties app catalog
						tableModel.setRowCount(0);

						// connecting to db
						Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root",
								"password");

						String type = null;
						String order = null;

						if (rb1.isSelected()) {
							type = "ReleaseDate";
							order = "DESC";
						} else if (rb2.isSelected()) {
							type = "ReleaseDate";
							order = "ASC";
						} else if (rb3.isSelected()) {
							type = "AppName";
							order = "ASC";
						} else {
							type = "AppName";
							order = "DESC";
						}

						// MySQL sort statement
						Statement stmt = con.createStatement();
						data = new String[numberOfApps][6];
						ResultSet rs = stmt
								.executeQuery("SELECT * FROM Application ORDER BY " + type + " " + order + ";");

						// filling in data for the table
						for (int i = 0; i < numberOfApps; i++) {
							rs.next();
							data[i][0] = rs.getString("AppName");
							data[i][1] = rs.getString("Developer");
							data[i][2] = rs.getString("ReleaseDate");
							data[i][3] = rs.getString("AppPlatform");
							data[i][4] = rs.getString("AppVersion");
							data[i][5] = rs.getString("price");
							tableModel.addRow(data[i]);
						}

						// close connection and remake table
						con.close();
						fetchMainAppTable();

					} catch (Exception e) {
						System.out.println(e);
					}

					appTable.setModel(tableModel);
				}

			}
		});

		// button that lets you log in
		loginButton.addActionListener(new java.awt.event.ActionListener() {
			@Override
			public void actionPerformed(java.awt.event.ActionEvent evt) {
				// making a new panel for pop up
				JPanel loginPanel = new JPanel();
				GridLayout grid = new GridLayout(4, 2);
				loginPanel.setLayout(grid);

				// JTextFields for fillable info
				JTextField username = new JTextField(20);
				JTextField password = new JTextField(20);

				// adding to login panel
				loginPanel.add(new JLabel("Username:"));
				loginPanel.add(username);
				loginPanel.add(new JLabel("Password:"));
				loginPanel.add(password);

				while (userAccount == null) {
					// popup creation
					Object[] options = { "Create Account", "Log in" };
					int result = JOptionPane.showOptionDialog(southPanel, loginPanel, "Log in",
							JOptionPane.DEFAULT_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]);
					if (result == 1) {
						userAccount = Account.login(username.getText(), password.getText());
					} else if (result == 0) {
						userAccount = Account.createAccount(username.getText(), password.getText());
					} else if (result == JOptionPane.CLOSED_OPTION) {
						return;
					}
				}

				String[] options = { "Log out", "Close" };
				int result = JOptionPane.showOptionDialog(southPanel, "Welcome " + userAccount.user,
						"Log in successful", 0, JOptionPane.INFORMATION_MESSAGE, null, options, null);

				if (result == 0) {
					userAccount = null;
					JOptionPane.showMessageDialog(southPanel, "You have been logged out", "Log out Successful",
							JOptionPane.INFORMATION_MESSAGE);
					return;
				}
			}
		});

		// northPanel adding
		northPanel.add(searchField);
		northPanel.add(searchButton);
		northPanel.add(refreshButton);
		northPanel.add(showQueueButton);

		// centerPanel adding
		centerPanel.add(scrollPane);

		// southPanel adding
		southPanel.add(descButton);
		southPanel.add(addButton);
		southPanel.add(removeButton);
		southPanel.add(filterButton);
		southPanel.add(sortButton);
		southPanel.add(loginButton);

		// adding panels to frame
		add(northPanel, BorderLayout.NORTH);
		add(centerPanel, BorderLayout.CENTER);
		add(southPanel, BorderLayout.SOUTH);

	}

	/**
	 * A method that sets up an empty table to be filled
	 * 
	 * Not actually sure how it works I found it online ngl
	 * 
	 * @return an empty JTable to be filled with data
	 */
	private JTable fetchMainAppTable() {
		String[] columnNames = { "App name", "Developer", "Release Date", "Platform", "Version", "Price" };
		if (appTable == null) {
			appTable = new JTable() {
				public boolean isCellEditable(int nRow, int nCol) {
					return false;
				}
			};
		}
		DefaultTableModel appTableModel = (DefaultTableModel) appTable.getModel();
		appTableModel.setColumnIdentifiers(columnNames);
		appTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

		return appTable;
	}

	/**
	 * A method that fills the JTable with data from the db
	 */
	private void setUpMainAppTableData() {
		tableModel = (DefaultTableModel) appTable.getModel();

		try {

			// Connects to the db
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");

			// MySQL statement that gets the max AppID to get the right number data rows
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT MAX(AppID) FROM Application");
			rs.next();
			numberOfApps = rs.getInt(1);

			// 2d array to be filled with data
			data = new String[numberOfApps][6];

			// fills the array from the db and adds it to the table
			rs = stmt.executeQuery("select * from Application");
			for (int i = 0; i < numberOfApps; i++) {
				rs.next();
				data[i][0] = rs.getString("AppName");
				data[i][1] = rs.getString("Developer");
				data[i][2] = rs.getString("ReleaseDate");
				data[i][3] = rs.getString("AppPlatform");
				data[i][4] = rs.getString("AppVersion");
				data[i][5] = rs.getString("price");
				tableModel.addRow(data[i]);
			}

			// closes the connection
			con.close();

			// updates the table
			fetchMainAppTable();
		} catch (Exception e) {
			System.out.println(e);
		}

		// sets the table model
		appTable.setModel(tableModel);
	}

	private JTable fetchQueueAppTable() {
		String[] columnNames = { "App name", "Developer", "Release Date", "Platform", "Version", "Description",
				"Price" };
		if (appsToAddTable == null) {
			appsToAddTable = new JTable() {
				public boolean isCellEditable(int nRow, int nCol) {
					return false;
				}
			};
		}
		DefaultTableModel appToAddModel = (DefaultTableModel) appsToAddTable.getModel();
		appToAddModel.setColumnIdentifiers(columnNames);
		appsToAddTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

		return appsToAddTable;
	}

	private void setUpQueueAppTableData() {
		appsToAddModel = (DefaultTableModel) appsToAddTable.getModel();

		try {

			// Connects to the db
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");

			// MySQL statement that gets the max AppID to get the right number data rows
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT MAX(AppToAddId) FROM AppsToAdd");
			rs.next();
			numberOfAppsToAdd = rs.getInt(1);

			// 2d array to be filled with data
			data = new String[numberOfAppsToAdd][7];

			// fills the array from the db and adds it to the table
			rs = stmt.executeQuery("select * from AppsToAdd");
			for (int i = 0; i < numberOfAppsToAdd; i++) {
				rs.next();
				data[i][0] = rs.getString("AppName");
				data[i][1] = rs.getString("Developer");
				data[i][2] = rs.getString("ReleaseDate");
				data[i][3] = rs.getString("AppPlatform");
				data[i][4] = rs.getString("AppVersion");
				data[i][5] = rs.getString("appDescription");
				data[i][6] = rs.getString("price");
				appsToAddModel.addRow(data[i]);
			}

			// closes the connection
			con.close();
		} catch (Exception e) {
			System.out.println(e);
		}

		appsToAddTable.setModel(appsToAddModel);
	}

	private JTable fetchCommentsTable() {
		String[] columnNames = { "Username", "Comment" };
		if (commentsTable == null) {
			commentsTable = new JTable() {
				public boolean isCellEditable(int nRow, int nCol) {
					return false;
				}
			};
		}
		DefaultTableModel commentsTableModel = (DefaultTableModel) commentsTable.getModel();
		commentsTableModel.setColumnIdentifiers(columnNames);
		commentsTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

		return commentsTable;
	}

	/**
	 * A method that fills the JTable with data from the db
	 */
	private void setUpCommentsTableData(int selectedApp) {
		commentsModel = (DefaultTableModel) commentsTable.getModel();

		try {

			// Connects to the db
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");

			// MySQL statement that gets the max AppID to get the right number data rows
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("SELECT MAX(commentID) FROM Comments");
			rs.next();
			numberOfComments = rs.getInt(1);

			// 2d array to be filled with data
			data = new String[numberOfComments][2];

			// fills the array from the db and adds it to the table
			rs = stmt.executeQuery("select * from Comments");
			for (int i = 0; i < numberOfApps; i++) {
				rs.next();
				if (selectedApp == rs.getInt("appID")) {
					data[i][0] = rs.getString("Username");
					data[i][1] = rs.getString("Comment");
					commentsModel.addRow(data[i]);
				}
			}

			// closes the connection
			con.close();

			// updates the table
			fetchCommentsTable();
		} catch (Exception e) {
			System.out.println(e);
		}

		// sets the table model
		commentsTable.setModel(commentsModel);
	}
}