const connection = require('./connect');


class employeeDb {
  constructor(connection) {
    this.connection = connection;
  }

  allDepartments() {
    return this.connection.promise().query(
      `SELECT 
            department.id, 
            department.name 
            FROM department;`
    );
  }

  rolesList() {
    return this.connection.promise().query(
      `SELECT 
            role.id, 
            role.title, 
            department.name department, 
            role.salary FROM role 
            LEFT JOIN department on role.department_id = department.id;`
    );
  }

  allEmployees() {
    return this.connection.promise().query(
      `SELECT 
            employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            department.name department, 
            role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) manager 
            FROM employee 
            LEFT JOIN role on employee.role_id = role.id 
            LEFT JOIN department on role.department_id = department.id 
            LEFT JOIN employee manager on employee.manager_id = manager.id;`
    );
  }

  allManagers() {
    return this.connection.promise().query(
      `SELECT
            employee.id, 
            CONCAT(first_name, ' ', last_name) manager 
            FROM employee WHERE (id IN (SELECT manager_id FROM employee));`
    );
  }

  addDepartment(newDepartment) {
    return this.connection
      .promise()
      .query(`INSERT INTO department (name) VALUES (?);`, newDepartment);
  }

  addRole(newRole) {
    return this.connection.promise().query(`INSERT INTO role SET ?;`, newRole);
  }

  addEmployee(newEmployee) {
    return this.connection
      .promise()
      .query(`INSERT INTO employee SET ?;`, newEmployee);
  }

  updateEmployeeRole(role_id, employee_id) {
    return this.connection
      .promise()
      .query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [
        role_id,
        employee_id,
      ]);
  }

  insertDepartment(newDepartment) {
    return this.connection
      .promise()
      .query(`INSERT INTO department (name) VALUES (?);`, newDepartment);
  }

  insertRole(newRole) {
    return this.connection.promise().query(`INSERT INTO role SET ?;`, newRole);
  }

  insertEmployee(newEmployee) {
    return this.connection
      .promise()
      .query(`INSERT INTO employee SET ?;`, newEmployee);
  }
}

module.exports = new employeeDb(connection);