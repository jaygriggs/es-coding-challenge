
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

                const form = document.getElementById('add_employee_form');

                form.addEventListener('submit',
                    function( e ) {
                        e.preventDefault();

                        let formData = new FormData(form);
                        let data = {};

                        formData.forEach(function(value, key) {
                            data[key] = value.trim();
                        });

                        if ( !validateAddForm(data) ) {
                            showToast('Please correct the highlighted fields.', 'error');
                            return false;
                        }

                        api.createEmployee(data).then(
                            function( result ) {
                                showToast('Employee created successfully!', 'success');
                                setTimeout(function() {
                                    document.location.href = '/frontend/employee_list.html';
                                }, 1500);
                            }
                        )
                        .catch(
                            function() {
                                showToast('Failed to create employee. Please try again.', 'error');
                            }
                        );
                        return false;
                    }
                );
            }
        );
    }
);

const validateAddForm = function(data) {
    let valid = true;
    valid = validateField('first_name', data.first_name, 'First name is required') && valid;
    valid = validateField('last_name', data.last_name, 'Last name is required') && valid;
    valid = validateField('username', data.username, 'Username is required') && valid;
    valid = validateField('password', data.password, 'Password is required') && valid;
    return valid;
}

const validateField = function(fieldId, value, message) {
    if ( value ) {
        clearFieldError(fieldId);
        return true;
    }
    return invalidateField(fieldId, message);
}

const invalidateField = function(fieldId, message) {
    let el = document.getElementById(fieldId);
    if ( el ) {
        el.classList.add('is-invalid');
        let feedback = el.parentElement.querySelector('.invalid-feedback');
        if ( feedback ) {
            feedback.textContent = message;
        }
    }
    return false;
}

const clearFieldError = function(fieldId) {
    let el = document.getElementById(fieldId);
    if ( el ) {
        el.classList.remove('is-invalid');
    }
}
