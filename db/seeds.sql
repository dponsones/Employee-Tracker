INSERT INTO department (dept_name)
VALUES 
('Management'),
('Sales'),
('Accounting');
('Customer Service');


INSERT INTO job (title, salary, department_id)
VALUES 
('Branch Manager', 175000, 1),
('Assistant to the Regional Manager', 45000, 2),
('Salesman', 100000, 2),
('Accountant', 80000, 3),
('Customer Service Specialist', 55000, 4),
('Receptionist', 50000, 4);

INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES 
('Michael', 'Scott', 1, 1),
('Dwight', 'Schrute', 2, NULL),
('Pam', 'Beesly', 6, NULL),
('Jim', 'Halpert', 3, NULL),
('Angela', 'Martin', 4, NULL),
('Kevin', 'Malone', 4, NULL),
('Kelly', 'Kapoor', 5, NULL);