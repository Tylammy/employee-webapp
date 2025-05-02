import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import io.github.cdimascio.dotenv.Dotenv;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Dotenv dotenv = Dotenv.load();
        String dbUrl = dotenv.get("DB_URL");
        String dbUser = dotenv.get("DB_USER");
        String dbPassword = dotenv.get("DB_PASSWORD");

        System.out.print("Enter username or email: ");
        String input = scanner.nextLine();

        System.out.print("Enter password: ");
        String password = scanner.nextLine();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword);

            boolean loggedIn = false;

            String loginQuery = "SELECT role FROM users WHERE username = ? AND password = ?";
            PreparedStatement adminStmt = conn.prepareStatement(loginQuery);
            adminStmt.setString(1, input);
            adminStmt.setString(2, password);
            ResultSet rs = adminStmt.executeQuery();

            if (rs.next()) {
                String role = rs.getString("role");
                System.out.println("\u2705 Login successful. Role: " + role);

                if (role.equalsIgnoreCase("admin")) {
                    System.out.println("\u2696\ufe0f Welcome Admin! You have full access.");
                    
                    while (true) {
                        System.out.println("\nAdmin Options:");
                        System.out.println("1. Search employee information");
                        System.out.println("2. Update employee information");
                        System.out.println("3. Adjust employee salaries");
                        System.out.println("4. View employee payroll history");
                        System.out.println("5. View Employee Total Monthly Pay"); //doing number 10 - Tahia
                        System.out.println("6. Exit"); //exit is now option 6 -> see if condition for exit
                        System.out.print("Enter your choice (1-6): ");
                        String adminChoice = scanner.nextLine();
                        
                        if (adminChoice.equals("1")) {
                            searchEmployeeData(conn, scanner);
                        } 
                        else if (adminChoice.equals("2")) {
                            updateEmployeeWorkflow(conn, scanner);
                        }
                        else if (adminChoice.equals("3")) {
                            adjustSalaries(conn, scanner);
                        } 
                        else if (adminChoice.equals("4")) {
                            System.out.print("Enter Employee ID to view payroll history: ");
                            int empId = Integer.parseInt(scanner.nextLine());
                            viewPayrollHistory(conn, scanner, empId, true);
                        }
                        //doing number 10, option 5 for Monthly pay
                        else if (adminChoice.equals("5")) {
                            System.out.print("Generate Total Monthly Pay Report:\n ");
                            System.out.println("1. By Division - View Sum of Salaries for all Employees in each Division.");
                            System.out.println("2. By Job Title - View Sum of Salaries for all Employees in each Role.");
                            System.out.print("Enter your choice (1 or 2): ");
                            int reportType = Integer.parseInt(scanner.nextLine());

                            generateMonthlyPayReport(conn, reportType);
                        }

                        else if (adminChoice.equals("6")) { //exit is changed to option 6
                            System.out.println("Exiting the program...");
                            break;
                        } 
                        else {
                            System.out.println("Invalid choice. Please try again.");
                        }
                    }
                    loggedIn = true;
                }
            }

            if (!loggedIn) {
                if (password.equals("emppass")) {
                    String empQuery = "SELECT e.empid, e.Fname, e.Lname, e.email, e.HireDate, e.Salary, " +
                                     "RIGHT(e.SSN, 4) AS last4SSN, d.Name AS division_name, jt.job_title " +
                                     "FROM employees e " +
                                     "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                                     "LEFT JOIN division d ON ed.div_ID = d.ID " +
                                     "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                                     "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                                     "WHERE e.email = ?";
                    
                    PreparedStatement empStmt = conn.prepareStatement(empQuery);
                    empStmt.setString(1, input);
                    ResultSet empData = empStmt.executeQuery();

                    if (empData.next()) {
                        System.out.println("\u2705 Login successful. Role: employee");
                        System.out.println("\ud83d\udc64 Welcome Employee. Fetching your data...");
                        System.out.println("\n--- Your Employee Info ---");
                        System.out.println("Name: " + empData.getString("Fname") + " " + empData.getString("Lname"));
                        System.out.println("Employee ID: " + empData.getInt("empid"));
                        System.out.println("Email: " + empData.getString("email"));
                        System.out.println("Hire Date: " + empData.getDate("HireDate"));
                        System.out.println("Salary: $" + empData.getDouble("Salary"));
                        System.out.println("Division: " + empData.getString("division_name"));
                        System.out.println("Job Title: " + empData.getString("job_title"));
                        System.out.println("SSN (last 4): ****-**-" + empData.getString("last4SSN"));
                        
                        employeePayrollMenu(conn, scanner, empData.getInt("empid"));
                        loggedIn = true;
                    }
                    empData.close();
                    empStmt.close();
                }
                
                if (!loggedIn) {
                    System.out.println("\u274c Login failed. Invalid credentials.");
                }
            }

            conn.close();
            scanner.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void searchEmployeeData(Connection conn, Scanner scanner) {
        try {
            System.out.println("\nSearch employee by:");
            System.out.println("1. Name");
            System.out.println("2. Employee ID");
            System.out.println("3. Date of Birth");
            System.out.println("4. View all employees");
            System.out.println("5. Cancel");
            System.out.print("Enter choice (1-5): ");
            String choice = scanner.nextLine();

            PreparedStatement searchStmt = null;
            ResultSet results = null;

            if (choice.equals("1")) {
                System.out.print("Enter first name: ");
                String fname = scanner.nextLine();
                System.out.print("Enter last name: ");
                String lname = scanner.nextLine();

                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                               "FROM employees e " +
                               "JOIN address a ON e.empid = a.empid " +
                               "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                               "LEFT JOIN division d ON ed.div_ID = d.ID " +
                               "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                               "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                               "WHERE e.Fname LIKE ? AND e.Lname LIKE ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setString(1, "%" + fname + "%");
                searchStmt.setString(2, "%" + lname + "%");
                results = searchStmt.executeQuery();

            } else if (choice.equals("2")) {
                System.out.print("Enter Employee ID: ");
                int empid = Integer.parseInt(scanner.nextLine().trim());
                
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "WHERE e.empid = ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setInt(1, empid);
                results = searchStmt.executeQuery();

            } else if (choice.equals("3")) {
                System.out.print("Enter Date of Birth (YYYY-MM-DD): ");
                String dob = scanner.nextLine().trim();
                
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "WHERE a.DOB = ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setString(1, dob);
                results = searchStmt.executeQuery();

            } else if (choice.equals("4")) {
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "ORDER BY e.empid";
                searchStmt = conn.prepareStatement(query);
                results = searchStmt.executeQuery();

            } else if (choice.equals("5")) {
                return;
            } else {
                System.out.println("Invalid choice.");
                return;
            }

            System.out.println("\nSearch Results:");
            int count = 0;
            
            while (results.next()) {
                count++;
                System.out.println("\n--- Employee " + count + " ---");
                displayEmployeeInfo(results);
            }

            if (count == 0) {
                System.out.println("No employees found.");
            }

        } catch (SQLException e) {
            System.out.println("Database error: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid number.");
        }
    }

    private static void updateEmployeeWorkflow(Connection conn, Scanner scanner) {
        try {
            System.out.println("\nFirst, find the employee you want to update:");
            
            System.out.println("\nSearch employee by:");
            System.out.println("1. Name");
            System.out.println("2. Employee ID");
            System.out.println("3. Date of Birth");
            System.out.println("4. View all employees");
            System.out.println("5. Cancel");
            System.out.print("Enter choice (1-5): ");
            String choice = scanner.nextLine();
    
            PreparedStatement searchStmt = null;
            ResultSet results = null;
            boolean isMultiResultSearch = false;
    
            if (choice.equals("1")) {
                System.out.print("Enter first name: ");
                String fname = scanner.nextLine().trim();
                System.out.print("Enter last name: ");
                String lname = scanner.nextLine().trim();
    
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "WHERE e.Fname = ? AND e.Lname = ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setString(1, fname);
                searchStmt.setString(2, lname);
                results = searchStmt.executeQuery();
    
            } else if (choice.equals("2")) {
                System.out.print("Enter Employee ID: ");
                int empid = Integer.parseInt(scanner.nextLine().trim());
                
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "WHERE e.empid = ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setInt(1, empid);
                results = searchStmt.executeQuery();
    
            } else if (choice.equals("3")) {
                System.out.print("Enter Date of Birth (YYYY-MM-DD): ");
                String dob = scanner.nextLine().trim();
                
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "WHERE a.DOB = ?";
                searchStmt = conn.prepareStatement(query);
                searchStmt.setString(1, dob);
                results = searchStmt.executeQuery();
    
            } else if (choice.equals("4")) {
                String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title " +
                             "FROM employees e " +
                             "JOIN address a ON e.empid = a.empid " +
                             "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                             "LEFT JOIN division d ON ed.div_ID = d.ID " +
                             "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                             "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                             "ORDER BY e.empid";
                searchStmt = conn.prepareStatement(query);
                results = searchStmt.executeQuery();
                isMultiResultSearch = true;
    
            } else if (choice.equals("5")) {
                return;
            } else {
                System.out.println("Invalid choice.");
                return;
            }
    
            System.out.println("\nSearch Results:");
            int count = 0;
            int empIdToUpdate = -1;
            Map<Integer, Integer> resultMap = new HashMap<>();
            
            while (results.next()) {
                count++;
                int empId = results.getInt("empid");
                resultMap.put(count, empId);
                
                System.out.println("\n--- Employee " + count + " ---");
                displayEmployeeInfo(results);
            }
    
            if (count == 0) {
                System.out.println("No employees found.");
                return;
            }
    
            if (count == 1 && !isMultiResultSearch) {
                // Automatically select the single employee found
                empIdToUpdate = resultMap.get(1);
            } else {
                // For view all or multiple results, ask to select
                System.out.print("\nEnter the number of the employee to select (0 to cancel): ");
                int selection = Integer.parseInt(scanner.nextLine());
                if (selection > 0 && selection <= count) {
                    empIdToUpdate = resultMap.get(selection);
                } else {
                    return;
                }
            }
    
            if (empIdToUpdate != -1) {
                updateEmployeeData(conn, scanner, empIdToUpdate);
            }
    
        } catch (SQLException e) {
            System.out.println("Database error: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid number.");
        }
    }

    private static void adjustSalaries(Connection conn, Scanner scanner) {
        try {
            System.out.println("\nSalary Adjustment Options:");
            System.out.println("1. Adjust salary for all employees");
            System.out.println("2. Adjust salary for a specific employee");
            System.out.println("3. Cancel");
            System.out.print("Enter your choice (1-3): ");
            String choice = scanner.nextLine();
            
            if (choice.equals("3")) {
                System.out.println("Salary adjustment canceled.");
                return;
            }
            
            System.out.print("\nEnter percentage to adjust salaries (e.g., 5.5 for 5.5% increase, -3.2 for 3.2% decrease): ");
            double percentage = Double.parseDouble(scanner.nextLine());
            
            if (percentage < -20 || percentage > 20) {
                System.out.println("❌ Error: Percentage must be between -20% and +20%");
                return;
            }
            
            double multiplier = 1 + (percentage / 100);
            
            if (choice.equals("1")) {
                String updateQuery = "UPDATE employees SET Salary = Salary * ?";
                PreparedStatement stmt = conn.prepareStatement(updateQuery);
                stmt.setDouble(1, multiplier);
                
                int affectedRows = stmt.executeUpdate();
                System.out.println("✅ Adjusted salaries for " + affectedRows + " employees by " + percentage + "%");
                stmt.close();
                
            } else if (choice.equals("2")) {
                System.out.print("Enter Employee ID: ");
                int empId = Integer.parseInt(scanner.nextLine());
                
                String checkQuery = "SELECT empid, Fname, Lname, Salary FROM employees WHERE empid = ?";
                PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
                checkStmt.setInt(1, empId);
                ResultSet rs = checkStmt.executeQuery();
                
                if (rs.next()) {
                    double currentSalary = rs.getDouble("Salary");
                    double newSalary = currentSalary * multiplier;
                    
                    System.out.println("\nEmployee: " + rs.getString("Fname") + " " + rs.getString("Lname"));
                    System.out.printf("Current salary: $%.2f\n", currentSalary);
                    System.out.printf("New salary after %.1f%% adjustment: $%.2f\n", percentage, newSalary);
                    
                    System.out.print("Confirm this change? (y/n): ");
                    String confirm = scanner.nextLine();
                    
                    if (confirm.equalsIgnoreCase("y")) {
                        String updateQuery = "UPDATE employees SET Salary = ? WHERE empid = ?";
                        PreparedStatement updateStmt = conn.prepareStatement(updateQuery);
                        updateStmt.setDouble(1, newSalary);
                        updateStmt.setInt(2, empId);
                        
                        int affectedRows = updateStmt.executeUpdate();
                        if (affectedRows > 0) {
                            System.out.println("✅ Salary adjusted successfully");
                        } else {
                            System.out.println("❌ Failed to adjust salary");
                        }
                        updateStmt.close();
                    } else {
                        System.out.println("Salary adjustment canceled.");
                    }
                } else {
                    System.out.println("❌ Employee not found with ID: " + empId);
                }
                rs.close();
                checkStmt.close();
            }
        } catch (NumberFormatException e) {
            System.out.println("❌ Invalid number format. Please enter a valid number.");
        } catch (SQLException e) {
            System.out.println("❌ Database error: " + e.getMessage());
        }
    }

    private static void displayEmployeeInfo(ResultSet empResults) throws SQLException {
        System.out.println("ID: " + empResults.getInt("empid"));
        System.out.println("Name: " + empResults.getString("Fname") + " " + empResults.getString("Lname"));
        System.out.println("Email: " + empResults.getString("email"));
        System.out.println("Hire Date: " + empResults.getDate("HireDate"));
        System.out.println("Salary: $" + empResults.getDouble("Salary"));
        System.out.println("SSN: " + empResults.getString("SSN"));
        System.out.println("DOB: " + empResults.getDate("DOB"));
        System.out.println("Division: " + empResults.getString("division_name"));
        System.out.println("Job Title: " + empResults.getString("job_title"));
        System.out.println("----------------------------------");
    }

    private static void updateEmployeeData(Connection conn, Scanner scanner, int empidToUpdate) {
        try {
            // First get current job titles and divisions
            Map<Integer, String> jobTitles = new HashMap<>();
            String jobTitleQuery = "SELECT job_title_id, job_title FROM job_titles";
            PreparedStatement jobTitleStmt = conn.prepareStatement(jobTitleQuery);
            ResultSet jobTitleRs = jobTitleStmt.executeQuery();
            while (jobTitleRs.next()) {
                jobTitles.put(jobTitleRs.getInt("job_title_id"), jobTitleRs.getString("job_title"));
            }
            jobTitleRs.close();
            jobTitleStmt.close();

            Map<Integer, String> divisions = new HashMap<>();
            String divisionQuery = "SELECT ID, Name FROM division";
            PreparedStatement divisionStmt = conn.prepareStatement(divisionQuery);
            ResultSet divisionRs = divisionStmt.executeQuery();
            while (divisionRs.next()) {
                divisions.put(divisionRs.getInt("ID"), divisionRs.getString("Name"));
            }
            divisionRs.close();
            divisionStmt.close();

            System.out.println("\nEmployee Information for Update: ");
            String query = "SELECT e.*, a.DOB, d.Name AS division_name, jt.job_title, " +
                          "d.ID AS division_id, jt.job_title_id " +
                          "FROM employees e " +
                          "JOIN address a ON e.empid = a.empid " +
                          "LEFT JOIN employee_division ed ON e.empid = ed.empid " +
                          "LEFT JOIN division d ON ed.div_ID = d.ID " +
                          "LEFT JOIN employee_job_titles ejt ON e.empid = ejt.empid " +
                          "LEFT JOIN job_titles jt ON ejt.job_title_id = jt.job_title_id " +
                          "WHERE e.empid = ?";
                          
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, empidToUpdate);
            ResultSet empResults = stmt.executeQuery();

            if (empResults.next()) {
                displayEmployeeInfo(empResults);

                while (true) {
                    System.out.println("\nWhat would you like to update?");
                    System.out.println("1. Salary");
                    System.out.println("2. Job Title");
                    System.out.println("3. Division");
                    System.out.println("4. Done");
                    System.out.print("Enter your choice (1-4): ");
                    String choice = scanner.nextLine().trim();

                    if (choice.equals("1")) {
                        System.out.print("Enter new salary: ");
                        double newSalary = Double.parseDouble(scanner.nextLine().trim());
                        String updateSalary = "UPDATE employees SET Salary = ? WHERE empid = ?";
                        PreparedStatement updateStmt = conn.prepareStatement(updateSalary);
                        updateStmt.setDouble(1, newSalary);
                        updateStmt.setInt(2, empidToUpdate);
                        updateStmt.executeUpdate();
                        System.out.println("✅ Salary updated to $" + newSalary);
                        updateStmt.close();

                    } else if (choice.equals("2")) {
                        System.out.println("\nAvailable Job Titles:");
                        for (Map.Entry<Integer, String> entry : jobTitles.entrySet()) {
                            System.out.println(entry.getKey() + ". " + entry.getValue());
                        }
                        System.out.print("Enter the ID of the new job title: ");
                        int newJobTitleId = Integer.parseInt(scanner.nextLine().trim());
                        
                        if (jobTitles.containsKey(newJobTitleId)) {
                            // Check if employee already has a job title
                            String checkQuery = "SELECT COUNT(*) FROM employee_job_titles WHERE empid = ?";
                            PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
                            checkStmt.setInt(1, empidToUpdate);
                            ResultSet checkResult = checkStmt.executeQuery();
                            checkResult.next();
                            int count = checkResult.getInt(1);
                            
                            String updateJob;
                            if (count > 0) {
                                updateJob = "UPDATE employee_job_titles SET job_title_id = ? WHERE empid = ?";
                            } else {
                                updateJob = "INSERT INTO employee_job_titles (empid, job_title_id) VALUES (?, ?)";
                            }
                            
                            PreparedStatement updateStmt = conn.prepareStatement(updateJob);
                            updateStmt.setInt(1, newJobTitleId);
                            updateStmt.setInt(2, empidToUpdate);
                            updateStmt.executeUpdate();
                            System.out.println("✅ Job Title updated to: " + jobTitles.get(newJobTitleId));
                            updateStmt.close();
                        } else {
                            System.out.println("❌ Invalid job title ID");
                        }

                    } else if (choice.equals("3")) {
                        System.out.println("\nAvailable Divisions:");
                        for (Map.Entry<Integer, String> entry : divisions.entrySet()) {
                            System.out.println(entry.getKey() + ". " + entry.getValue());
                        }
                        System.out.print("Enter the ID of the new division: ");
                        int newDivisionId = Integer.parseInt(scanner.nextLine().trim());
                        
                        if (divisions.containsKey(newDivisionId)) {
                            // Check if employee already has a division
                            String checkQuery = "SELECT COUNT(*) FROM employee_division WHERE empid = ?";
                            PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
                            checkStmt.setInt(1, empidToUpdate);
                            ResultSet checkResult = checkStmt.executeQuery();
                            checkResult.next();
                            int count = checkResult.getInt(1);
                            
                            String updateDiv;
                            if (count > 0) {
                                updateDiv = "UPDATE employee_division SET div_ID = ? WHERE empid = ?";
                            } else {
                                updateDiv = "INSERT INTO employee_division (empid, div_ID) VALUES (?, ?)";
                            }
                            
                            PreparedStatement updateStmt = conn.prepareStatement(updateDiv);
                            updateStmt.setInt(1, newDivisionId);
                            updateStmt.setInt(2, empidToUpdate);
                            updateStmt.executeUpdate();
                            System.out.println("✅ Division updated to: " + divisions.get(newDivisionId));
                            updateStmt.close();
                        } else {
                            System.out.println("❌ Invalid division ID");
                        }

                    } else if (choice.equals("4")) {
                        System.out.println("✅ Done. Returning to main menu.");
                        break;
                    } else {
                        System.out.println("❌ Invalid choice. Please try again.");
                    }
                }

            } else {
                System.out.println("❌ Employee not found!");
            }
            empResults.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("❌ Database error: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.out.println("❌ Invalid number format. Please enter a valid number.");
        }
    }


// gauri changes below!!!!!!!
private static void viewPayrollHistory(Connection conn, Scanner scanner, int empId, boolean isAdmin) {
    try {
        // Verify employee exists and get salary
        String verifyQuery = "SELECT empid, Fname, Lname, Salary FROM employees WHERE empid = ?";
        PreparedStatement verifyStmt = conn.prepareStatement(verifyQuery);
        verifyStmt.setInt(1, empId);
        ResultSet verifyRs = verifyStmt.executeQuery();

        if (!verifyRs.next()) {
            System.out.println("❌ Employee not found with ID: " + empId);
            return;
        }

        double annualSalary = verifyRs.getDouble("Salary");
        double monthlySalary = annualSalary / 12;
        String employeeName = verifyRs.getString("Fname") + " " + verifyRs.getString("Lname");

        System.out.println("\n12-Month Payroll History for: " + employeeName);
        System.out.printf("Annual Salary: $%,.2f | Monthly Gross: $%,.2f%n", annualSalary, monthlySalary);
        System.out.println("==================================================================================");
        System.out.printf("%-10s %-10s %-10s %-10s %-10s %-10s %-10s %-10s %-10s%n", 
                        "Period", "Gross", "Fed Tax", "Medicare", "SS Tax", "State Tax", 
                        "401k", "Health", "Net Pay");
        System.out.println("----------------------------------------------------------------------------------");

        // Realistic deduction percentages (customize these as needed)
        final double FEDERAL_TAX_PERCENT = 0.12;    // 12%
        final double STATE_TAX_PERCENT = 0.03;      // 3%
        final double SOCIAL_SECURITY_PERCENT = 0.062; // 6.2%
        final double MEDICARE_PERCENT = 0.0145;     // 1.45%
        final double RETIREMENT_401K_PERCENT = 0.04; // 4%
        final double HEALTH_INSURANCE_PERCENT = 0.02; // 2%

        // Initialize totals
        double totalGross = 0;
        double totalFederalTax = 0;
        double totalMedicare = 0;
        double totalSSTax = 0;
        double totalStateTax = 0;
        double total401k = 0;
        double totalHealth = 0;
        double totalNet = 0;

        // Get current date and set up calendar for monthly iteration
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -11); // Start from 12 months ago

        // Generate 12 months of data
        for (int i = 0; i < 12; i++) {
            // Calculate deductions for this month
            double federalTax = monthlySalary * FEDERAL_TAX_PERCENT;
            double stateTax = monthlySalary * STATE_TAX_PERCENT;
            double socialSecurity = monthlySalary * SOCIAL_SECURITY_PERCENT;
            double medicare = monthlySalary * MEDICARE_PERCENT;
            double retirement401k = monthlySalary * RETIREMENT_401K_PERCENT;
            double healthInsurance = monthlySalary * HEALTH_INSURANCE_PERCENT;
            double netPay = monthlySalary - (federalTax + stateTax + socialSecurity + medicare + retirement401k + healthInsurance);

            // Format month/year display
            String monthYear = new SimpleDateFormat("MMM yyyy").format(cal.getTime());

            // Print this month's data
            System.out.printf("%-10s $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f%n",
                            monthYear,
                            monthlySalary,
                            federalTax,
                            medicare,
                            socialSecurity,
                            stateTax,
                            retirement401k,
                            healthInsurance,
                            netPay);

            // Accumulate totals
            totalGross += monthlySalary;
            totalFederalTax += federalTax;
            totalMedicare += medicare;
            totalSSTax += socialSecurity;
            totalStateTax += stateTax;
            total401k += retirement401k;
            totalHealth += healthInsurance;
            totalNet += netPay;

            // Move to next month
            cal.add(Calendar.MONTH, 1);
        }

        // Print totals
        System.out.println("==================================================================================");
        System.out.printf("%-10s $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f $%-9.2f%n",
                        "TOTALS:",
                        totalGross,
                        totalFederalTax,
                        totalMedicare,
                        totalSSTax,
                        totalStateTax,
                        total401k,
                        totalHealth,
                        totalNet);

        // Print percentage summary
        System.out.println("\nDeduction Summary (% of Gross):");
        System.out.printf("Federal Tax: %.2f%%%n", (totalFederalTax / totalGross) * 100);
        System.out.printf("State Tax: %.2f%%%n", (totalStateTax / totalGross) * 100);
        System.out.printf("Social Security: %.2f%%%n", (totalSSTax / totalGross) * 100);
        System.out.printf("Medicare: %.2f%%%n", (totalMedicare / totalGross) * 100);
        System.out.printf("401k: %.2f%%%n", (total401k / totalGross) * 100);
        System.out.printf("Health Insurance: %.2f%%%n", (totalHealth / totalGross) * 100);
        System.out.printf("NET PAY: %.2f%% of gross%n", (totalNet / totalGross) * 100);

        verifyRs.close();
        verifyStmt.close();

    } catch (SQLException e) {
        System.out.println("❌ Database error: " + e.getMessage());
    } catch (Exception e) {
        System.out.println("❌ Error: " + e.getMessage());
    }
}

    private static void employeePayrollMenu(Connection conn, Scanner scanner, int empId) {
        while (true) {
            System.out.println("\nEmployee Payroll Options:");
            System.out.println("1. View my payroll history");
            System.out.println("2. Return to main menu");
            System.out.print("Enter your choice (1-2): ");
            String choice = scanner.nextLine();
            
            if (choice.equals("1")) {
                viewPayrollHistory(conn, scanner, empId, false);
            } else if (choice.equals("2")) {
                break;
            } else {
                System.out.println("Invalid choice. Please try again.");
            }
        }
    }

// Total Monthly Report - Summary of salaries being paid across divisions and job titles
// By Division: View Sum of Salaries for all employees in each division
// By Job Title: View sum of salaries for all employees in each role
private static void generateMonthlyPayReport(Connection conn, int reportType) {
    try {
        String sql;
        if (reportType == 1) {
            sql = "SELECT ed.div_ID, SUM(e.Salary) AS total_monthly_pay " +
          "FROM employees e " +
          "JOIN employee_division ed ON e.empId = ed.empId " +  
          "GROUP BY ed.div_ID " +  
          "ORDER BY ed.div_ID";  

        } else {
          //job titles in left column and total monthly pay right column
          sql = "SELECT jt.job_title, SUM(e.Salary) AS total_monthly_pay " +  
          "FROM employees e " +
          "JOIN employee_job_titles ejp ON e.empId = ejp.empId " +
          "JOIN job_titles jt ON ejp.job_title_id = jt.job_title_id " +
          "GROUP BY jt.job_title " +  // Group by the name
          "ORDER BY jt.job_title";    // Order by name
        }
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        System.out.println("\nTotal Monthly Pay Report:");
        
        while (rs.next()) {
            String group = reportType == 1 ? rs.getString("div_ID") : rs.getString("job_title");
            double totalPay = rs.getDouble("total_monthly_pay");
            System.out.printf("%-20s: $%,.2f%n", group, totalPay); 
        }
        System.out.println("---------------------------------\n");
    
    } catch (SQLException e) {
        System.out.println("Error generating report: " + e.getMessage());
        // e.printStackTrace(); //for detailed debugging
    }
}

}