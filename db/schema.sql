DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db; 

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30)
  -- PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL,
  role_title VARCHAR(30) NOT NULL,
  role_salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
  REFERENCES roles(id)
 
);