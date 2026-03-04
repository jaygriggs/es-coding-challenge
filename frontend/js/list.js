
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

const formatDOB = function(dateStr) {
    let parts = dateStr.split('-');
    return parseInt(parts[1]) + '-' + parseInt(parts[2]) + '-' + parts[0];
}

const renderEmployees = function(employees) {
    let tableBody = document.querySelector('#employee_table tbody');
    tableBody.innerHTML = '';

    employees.forEach(function(employee) {
        let row = document.createElement('tr');
        let nameCell = document.createElement('td');
        let usernameCell = document.createElement('td');
        let dobCell = document.createElement('td');
        let officeCell = document.createElement('td');
        let categoryCell = document.createElement('td');
        let roleCell = document.createElement('td');
        let phoneCell = document.createElement('td');
        let actionCell = document.createElement('td');
        let editLink = document.createElement('a');

        nameCell.textContent = employee.first_name + ' ' + employee.last_name;
        usernameCell.textContent = employee.username;
        usernameCell.classList.add('d-none', 'd-lg-table-cell');
        dobCell.textContent = employee.date_of_birth ? formatDOB(employee.date_of_birth) : '—';
        officeCell.textContent = employee.office_number || '—';
        officeCell.classList.add('d-none', 'd-lg-table-cell');
        categoryCell.textContent = employee.employee_category || '';
        categoryCell.classList.add('d-none', 'd-lg-table-cell');
        roleCell.textContent = employee.is_admin == 1 ? 'Admin' : 'Employee';
        roleCell.classList.add('d-none', 'd-lg-table-cell');
        if ( employee.phone ) {
            let phoneLink = document.createElement('a');
            phoneLink.href = 'tel:' + employee.phone;
            phoneLink.textContent = employee.phone;
            phoneCell.appendChild(phoneLink);
        } else {
            phoneCell.textContent = '—';
        }
        editLink.textContent = 'Edit';
        editLink.href = '/frontend/employee_edit.html?id=' + employee.id;
        editLink.classList.add('btn', 'btn-primary', 'btn-sm');

        actionCell.appendChild(editLink);
        row.appendChild(nameCell);
        row.appendChild(usernameCell);
        row.appendChild(dobCell);
        row.appendChild(officeCell);
        row.appendChild(categoryCell);
        row.appendChild(roleCell);
        row.appendChild(phoneCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

 
