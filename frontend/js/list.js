
document.addEventListener('DOMContentLoaded',
    function() {

        let api = new EmployeeApi();

        api.requireLogin().then(
            function( auth_data ) {
                let is_admin = auth_data.is_admin == 1;
                initNavbar(auth_data);

                if ( !is_admin ) {
                    document.location.href = '/frontend/employee_edit.html';
                    return;
                }

                api.listEmployees().then(
                    function( employees ) {
                        renderEmployees(employees);
                    }
                ).catch(
                    function() {
                        showToast('Unable to load employee list.', 'error');
                    }
                );
            }
        );
    }
);

const renderEmployees = function(employees) {
    let tableBody = document.querySelector('#employee_table tbody');
    tableBody.innerHTML = '';

    employees.forEach(function(employee) {
        let row = document.createElement('tr');
        let nameCell = document.createElement('td');
        let usernameCell = document.createElement('td');
        let categoryCell = document.createElement('td');
        let roleCell = document.createElement('td');
        let actionCell = document.createElement('td');
        let editLink = document.createElement('a');

        nameCell.textContent = employee.first_name + ' ' + employee.last_name;
        usernameCell.textContent = employee.username;
        categoryCell.textContent = employee.employee_category || '';
        roleCell.textContent = employee.is_admin == 1 ? 'Admin' : 'Employee';
        editLink.textContent = 'Edit';
        editLink.href = '/frontend/employee_edit.html?id=' + employee.id;

        actionCell.appendChild(editLink);
        row.appendChild(nameCell);
        row.appendChild(usernameCell);
        row.appendChild(categoryCell);
        row.appendChild(roleCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

 
