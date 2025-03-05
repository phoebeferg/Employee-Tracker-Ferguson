-- Active: 1740443733756@@127.0.0.1@5432@work_db
DROP DATABASE IF EXISTS work_db;
CREATE DATABASE work_db;


CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
)

SELECT * FROM department;



CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    Foreign Key (department_id) REFERENCES department(id)
)

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    Foreign Key (role_id) REFERENCES role(id)
)

SELECT setval('department_id_seq', COALESCE((SELECT MAX(id) FROM department), 1), false);

SELECT * FROM department;
SELECT nextval('department_id_seq');
SELECT currval('department_id_seq');

SELECT * FROM role;
SELECT nextval('role_id_seq');
SELECT currval('role_id_seq');

SELECT setval('role_id_seq', (SELECT MAX(id) FROM role) + 1);

SELECT * FROM employee;
SELECT nextval('employee_id_seq');
SELECT currval('employee_id_seq');

SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee) + 1);

SELECT * FROM employee;

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;
SELECT id, first_name, last_name, role_id, manager_id FROM employee;

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'employee';
