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
    if (answers.choices === 'Add Employee'){
      addEmployee();
    }
    if (answers.choices === 'Update Employee') {
      updateEmployee();
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

  // function to view all roles
  const viewAllRoles = () => {
    db.query("SELECT roles.id, roles.role_title AS title, department.department_name AS department, roles.role_salary AS salary FROM roles JOIN department ON roles.department_id = department.id", (err, res) => {
      if (err) throw err;
      console.table(res)
      prompt()
    })
  }

  // functions to view all Employees
  const viewAllEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.role_title, department.department_name, roles.role_salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON department.id = roles.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`,
    (err, res) => {
      if (err) throw err;
      console.table(res)
      prompt()
    }
    )
  }

  // function to add department
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

  // Add role 
  const addRole = () => {
    let departmentArr = [];    
    let departmentQuery = "SELECT department_name FROM department";
    db.query(departmentQuery, (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++){
            departmentArr.push(res[i].department);
            console.log(res)
  }
        let query = "SELECT roles.role_title, roles.role_salary, department.department_name FROM roles INNER JOIN department ON (roles.department_id = department.id";
        db.query = (query, (err, res) => {
          if (err) throw err;
          console.table(res);
    
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
      choices: departmentArr
    }
  ]).then((answer) => {
    let addDepartment = answer.departmentArr;
    let addDepartmentId = departmentArr.indexOf(addDepartment);
    addDepartmentId++;
    console.log(answer)
    
    db.query('INSERT INTO roles SET ?',
    {role_title: answer.role ,role_salary: answer.salary, department_id: addDepartmentId}, 
    (err, res) => {
      console.table(res)
      prompt();
  
      });
    });            
  })      
  })  
};
    


// Add Employee
const addEmployee = () => {
  let employeeArray = [];
  db.query("SELECT roles.role_title FROM roles;", (err, res) => {
    if (err) throw err;
    for(let i = 0; i < res.length; i++){
      employeeArray.push(res[i].role_title)
    }
    
  })
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employee\'s first name?'
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'What is the employee\'s last name?'
},
{
    type: 'list',
    name: 'role',
    message: 'What is the employee\'s role?',
    choices: employeeArray
}
// {
//     type: 'input',
//     name: 'manager',
//     message: 'Who is the employee\'s manager?',
//     choices: ""
// }
]).then((answer) => {
  let addEmployeeRole = answer.role;
  let addEmployeeId = employeeArray.indexOf(addEmployeeRole);
  addEmployeeId++;
  db.query('INSERT INTO employee SET ?',
      {first_name: answer.first_name,
       last_name: answer.last_name,
       role_id: addEmployeeId, 
      }, (err, res) => {
        if (err) throw err;
        prompt();
})
})
}

// update employee
const updateEmployee = () => {
  let updateArray = [];
  db.query("SELECT * FROM employee", (err, res) => {
    for(i = 0; i < res.length; i++) {
      
    }
  })
}

