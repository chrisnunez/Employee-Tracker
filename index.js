const inquirer = require('inquirer');
const cTable = require('console.table')
const fs = require('fs');
const mysql = require('mysql2');
const figlet = require('figlet');



// Creates connection to SQL
const db = mysql.createConnection(
  {
    host: '127.0.0.1', // go to here
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
  );

  db.connect((err) => {
    if (err) throw err;
// Figlet art 
figlet('Employee Tracker', (err, data) => {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  } 
  console.log(data)
  prompt()
})
  });
  

// Initializes prompt questions 
const prompt = () => {
inquirer
  .prompt([
    {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: [
          'View All Employees', 
          'Add Employee',
          'Update Employee', 
          'View All Roles', 
          'Add role', 
          'View All Departments', 
          'Add Departments']
    }
  ]).then(answers => {

    if (answers.choices === 'View All Departments'){
      viewAllDepartments();
    }
  })
}
  // function to view all departments
  const viewAllDepartments = () => {
    db.query("SELECT id, department_name FROM department", (err, results) => {
      if (err) throw err;
      console.table(results);
      prompt()
    }
    )};

