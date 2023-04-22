const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345',
  database: 'company_db',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Start the application
function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
    });
}

// View all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// View all roles
function viewAllRoles() {
  connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    INNER JOIN department ON role.department_id = department.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// View all employees
function viewAllEmployees() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.name,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department added!\n`);
          start();
        }
      );
    });
}

// Add a role
function addRole() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    const departmentChoices = res.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Which department does the role belong to?',
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} role added!\n`);
            start();
          }
        );
      });
  });
}

start();