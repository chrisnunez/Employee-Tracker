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
figlet('Employee Manager', (err, data) => {
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
          'Add Role', 
          'View All Departments', 
          'Add Departments']
    }
  ]).then(answers => {

    if (answers.choices === 'View All Departments'){
      viewAllDepartments();
    }

    if (answers.choices === 'View All Roles') {
      viewAllRoles();
    }

    if (answers.choices === 'View All Employees') {
      viewAllEmployees();
    }

    if (answers.choices === 'Add Departments'){
      addDepartment();
    }

    if (answers.choices === 'Add Role'){
      addRole();
    }
    
    
  })
}
  // function to view all departments
  const viewAllDepartments = () => {
    db.query("SELECT id, department_name FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
      prompt()
    }
    )};

  const viewAllRoles = () => {
    db.query("SELECT roles.id, roles.role_title AS title, department.department_name AS department, roles.role_salary AS salary FROM roles JOIN department ON roles.department_id = department.id", (err, res) => {
      if (err) throw err;
      console.table(res)
      prompt()
    })
  }

  const viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.role_title, department.department_name, roles.role_salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON department.id = roles.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`,
    (err, res) => {
      if (err) throw err;
      console.table(res)
      prompt()
    }
    )
  }

  const addDepartment = () => {
      inquirer.prompt([
        {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
      }
    ]).then((answer) => {
      console.log(answer)
      db.query('INSERT INTO department SET ?',
      {department_name: answer.department}, (err, res) => {
        if (err) throw err;
        prompt();
      })
    })
  }

  const addRole = () => {
    inquirer.prompt([
      {
      type: 'input',
      name: 'role',
      message: 'What is the name of the Role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?'

    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department does the role belong to?',
      choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
    }
  ]).then((answer) => {
    console.log(answer)
    db.query('INSERT INTO roles SET ?',
    {role_title: answer.role},
    {role_salary: answer.salary},
    {department_id: answer.department}, 
    (err, res) => {
      console.table(res)
      prompt();
  
    }
  )})
  }
  
