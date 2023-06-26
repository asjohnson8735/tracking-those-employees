USE employees;

INSERT INTO department (name)
VALUES 
  ('Management'),
  ('Human Resources'),
  ('Accounting'),
  ('Development');
  
INSERT INTO role (title, salary, department_id)
VALUES 
  ('CEO', 1000000, 1),
  ('Executive Assistant', 83000, 1),
  ('HR Manager', 90000, 2),
  ('HR Represenative', 68000, 2),
  ('Accountant', 77000, 3),
  ('Senior Developer', 88000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
  ('John', 'Man', 1, NULL),
  ('Person', 'Human', 2, 1),
  ('Craig', 'Guy', 3, 2),
  ('Iron', 'Man', 4, 3);
