INSERT INTO department(id, name)
VALUES
    (1, 'Finance'),
    (2, 'Operations')

DROP TABLE if exists department;

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, 'Analyst', 100000.00, 001),
(2, 'Associate', 150000.00, 002)


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Phoebe', 'Ferguson', 1, 321),
(3, 'Leo', 'Gussack', 2, 654)