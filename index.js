const inquirer = require("inquirer");
const employeeDb = require ('./db/queries');
require("console.table");
init();

function init() {
  console.log('test');
};

function menu() {
  // Prompt the user with a list of menu choices
  inquirer.prompt([
    {
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: [
        { name: 'View all departments', value: 1 },
        { name: 'View all roles', value: 2 },
        { name: 'View all employees', value: 3 },
        { name: 'Add a department', value: 4 },
        { name: 'Add a role', value: 5 },
        { name: 'Add an employee', value: 6 },
        { name: 'Update an employee role', value: 7 },
        { name: 'Exit', value: 8 }
      ]
    }
  ])
    .then(answer => {
      switch (answer.menuChoice) {
        case 1:
          listDepart();
          break;
        case 2:
          listRoles();
          break;
        case 3:
          listEmployees();
          break;
        case 4:
          addDepart();
          break;
        case 5:
          addRole();
          break;
        case 6:
          addEmployee();
          break;
        case 7:
          updateEmployee();
          break;
        case 8:
          employeeDb.connection.end();
          break;
      }
    });
}

function listDepart() {
  // Retrieve all departments from the database and display them in a table
  employeeDb.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.table('Departments', departments);
    })
    .then(menu);
}

function listRoles() {
  // Retrieve all roles from the database and display them in a table
  employeeDb.rolesList()
    .then(([rows]) => {
      let roles = rows;
      console.table('Roles', roles);
    })
    .then(menu);
}

function listEmployees() {
  // Retrieve all employees from the database and display them in a table
  employeeDb.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.table('Employees', employees);
    })
    .then(menu);
}

function addDepart() {
  // Prompt the user to enter the name of a new department
  inquirer.prompt([
    {
      type: 'input',
      name: 'newDepart',
      message: 'Enter the name of the new department'
    }
  ])
    .then((answer) => {
      let name = answer.newDepart;
      // Insert the new department into the database
      employeeDb.insertDepartment(name);
      console.log(`'${name}' added to department database`);
    })
    .then(menu);
}

function addRole() {
  // Retrieve all departments from the database to display as choices for the department the role belongs to
  employeeDb.allDepartments()
    .then(([rows]) => {
      let departments = rows;
      const seeDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      // Prompt the user to enter details of the new role
      return inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the new role'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for this role',
          validate: (answer) => {
            if (isNaN(answer)) {
              return "Do not include '$' or ',' in salary input";
            }
            return true;
          }
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Enter the department this role belongs to',
          choices: seeDepartment
        }
      ]);
    })
    .then((answer) => {
      return employeeDb.insertRole(answer);
    })
    .then(() => {
      console.log(`${answer.title} added to role database`);
    })
    .then(menu);
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee',
      },
    ])
    .then((answer) => {
      const firstName = answer.first_name;
      const lastName = answer.last_name;

      // Retrieve all roles from the database to display as choices for the employee's role
      employeeDb.rolesList()
        .then(([rows]) => {
          const roles = rows;

          const showRoles = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          return inquirer.prompt([
            {
              type: 'list',
              name: 'role_id',
              message: "Enter the employee's role",
              choices: showRoles,
            },
          ]);
        })
        .then((answer) => {
          const roleID = answer.role_id;

          // Retrieve all employees from the database to display as choices for the employee's manager
          return employeeDb.allEmployees();
        })
        .then(([rows]) => {
          const managers = rows;
          const listManagers = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          }));

          return inquirer.prompt([
            {
              type: 'list',
              name: 'manager_id',
              message: "Enter the employee's manager",
              choices: listManagers,
            },
          ]);
        })
        .then((answer) => {
          const managerID = answer.manager_id;

          // Create a new employee object with the provided information
          const newEmployee = {
            first_name: firstName,
            last_name: lastName,
            role_id: roleID,
            manager_id: managerID,
          };

          // Insert the new employee into the database
          return employeeDb.insertEmployee(newEmployee);
        })
        .then(() => {
          console.log(`${firstName} ${lastName} has been added to the employee database.`);
          menu(); // Return to the main menu
        });
    });
}

function updateEmployee() {
  employeeDb.allEmployees()
    .then(([rows]) => {
      const employees = rows;

      // Display a list of employees for the user to select from
      const listEmployees = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Select the employee to update:',
          choices: listEmployees,
        },
      ]);
    })
    .then((answer) => {
      const employeeId = answer.employee;

      // Retrieve all roles from the database to display as choices for the new role of the employee
      return employeeDb.rolesList();
    })
    .then(([rows]) => {
      const roles = rows;
      const listRoles = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      return inquirer.prompt([
        {
          type: 'list',
          name: 'role_id',
          message: 'Select the new role for the employee:',
          choices: listRoles,
        },
      ]);
    })
    .then((answer) => {
      const newRoleId = answer.role_id;

      // Update the employee's role in the database
      return employeeDb.updateEmployeeRole(newRoleId, employeeId);
    })
    .then(() => {
      console.log('Employee role has been updated.');
      menu();
    });
}


menu();