import inquirer from 'inquirer'
import * as pg from 'pg'; const { Client } = pg
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()


const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

client.connect()

async function mainMenu(): Promise<void> {
    const { choice } = await inquirer.prompt<{ choice: string }>({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (choice) {
        case 'View all departments':
            await viewDepartments();
            break;
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            client.end();
            return;
    }

    mainMenu();
}

async function viewDepartments(): Promise<void> {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

async function viewRoles(): Promise<void> {
    const res = await client.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`);
    console.table(res.rows);
}

async function viewEmployees(): Promise<void> {
    const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, 
        department.name AS department, role.salary, 
        (SELECT first_name || ' ' || last_name FROM employee WHERE id = employee.manager_id) AS manager
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id`);
console.table(res.rows);
}

async function addDepartment(): Promise<void> {
    const { name } = await inquirer.prompt<{ name: string }>({ type: 'input', name: 'name', message: 'Enter department name:' });
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
}

async function addRole(): Promise<void> {
    const { title, salary, department_id } = await inquirer.prompt<{ title: string; salary: number; department_id: number }>([
        { type: 'input', name: 'title', message: 'Enter role title:' },
        { type: 'input', name: 'salary', message: 'Enter salary:', filter: (input) => parseFloat(input) },
        { type: 'input', name: 'department_id', message: 'Enter department ID:', filter: (input) => parseInt(input) }
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role: ${title}`);
}

async function addEmployee(): Promise<void> {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt<{ first_name: string; last_name: string; role_id: number; manager_id: number | null }>([
        { type: 'input', name: 'first_name', message: 'Enter first name:' },
        { type: 'input', name: 'last_name', message: 'Enter last name:' },
        { type: 'input', name: 'role_id', message: 'Enter role ID:', filter: (input) => parseInt(input) },
        { type: 'input', name: 'manager_id', message: 'Enter manager ID (or leave blank for none):', filter: (input) => input ? parseInt(input) : null }
    ]);
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee: ${first_name} ${last_name}`);
}

async function updateEmployeeRole(): Promise<void> {
    const { employee_id, role_id } = await inquirer.prompt<{ employee_id: number; role_id: number }>([
        { type: 'input', name: 'employee_id', message: 'Enter employee ID to update:', filter: (input) => parseInt(input) },
        { type: 'input', name: 'role_id', message: 'Enter new role ID:', filter: (input) => parseInt(input) }
    ]);
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee ID ${employee_id} to role ID ${role_id}`);
}

mainMenu();
