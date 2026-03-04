

document.addEventListener('DOMContentLoaded', 
    function() {

        let api = new EmployeeApi();

        api.requireLogin().then(
            function( auth_data ) {

                let employee_id = auth_data.id;
                let is_admin = auth_data.is_admin == 1;
                let url_params = new URLSearchParams(window.location.search);
                let requested_id = parseInt(url_params.get('id'), 10);

                if ( is_admin && requested_id ) {
                    employee_id = requested_id;
                }

                initNavbar(auth_data);
                initThemeToggle();

                // Show delete button if admin is editing another employee
                if ( is_admin && requested_id && requested_id !== auth_data.id ) {
                    let deleteBtn = document.getElementById('btn_delete');
                    let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                    deleteBtn.style.display = 'inline-block';
                    deleteBtn.addEventListener('click', function() {
                        deleteModal.show();
                    });
                    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
                        deleteModal.hide();
                        api.deleteEmployee(employee_id).then(function() {
                            showToast('Employee deleted.', 'success');
                            setTimeout(function() {
                                document.location.href = '/frontend/employee_list.html';
                            }, 1000);
                        }).catch(function() {
                            showToast('Failed to delete employee.', 'error');
                        });
                    });
                }

                const form = document.getElementById('employee_record');

                loadData(employee_id).then(
                    function(employee_data) {
                        console.log(employee_data);
                        FormFiller.apply(employee_data);
                    }
                )
        
                form.addEventListener('submit',
                    function( e ) {
        
                        e.preventDefault();
        
                        let api = new EmployeeApi();
                        let formData = new FormData(form);
                        let data = {};

                        formData.forEach(function(value, key) {
                            data[key] = value.trim();
                        });

                        if ( !validateForm(data) ) {
                            showToast('Please correct the highlighted fields.', 'error');
                            return false;
                        }

                        api.updateData(employee_id, data).then(
                            function() {
                                showToast('Saved successfully.', 'success');
                            }
                        )
                        .catch(
                            function() {
                                showToast('Save failed. Please try again.', 'error');
                            }
                        );
                        return false;
                    }
                );
            }
        );
    }
);

const loadData = function( id ) {

    let api = new EmployeeApi();
    return api.getData(id);
    
}

const validateForm = function(data) {
    let valid = true;
    valid = validateField('first_name', data.first_name, 'First name is required') && valid;
    valid = validateField('last_name', data.last_name, 'Last name is required') && valid;
    valid = validateField('phone', data.phone, 'Phone is required') && valid;

    if ( data.phone && !/^[0-9\-\(\)\s\+\.]{7,20}$/.test(data.phone) ) {
        valid = invalidateField('phone', 'Enter a valid phone number') && valid;
    }
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
