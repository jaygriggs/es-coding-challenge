

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

                initNav(is_admin);

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

                        let errors = [];
                        if ( !data.first_name ) { errors.push('First name is required'); }
                        if ( !data.last_name ) { errors.push('Last name is required'); }
                        if ( !data.phone ) { errors.push('Phone is required'); }
                        if ( data.phone && !/^[0-9\-\(\)\s\+\.]{7,20}$/.test(data.phone) ) {
                            errors.push('Phone format is invalid');
                        }

                        if ( errors.length ) {
                            showMessage(errors.join('; '), 'error');
                            return false;
                        }

                        api.updateData(employee_id, data).then(
                            function() {
                                showMessage('Saved successfully.', 'success');
                            }
                        )
                        .catch(
                            function() {
                                showMessage('Save failed. Please try again.', 'error');
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

const showMessage = function(message, type) {
    let msgEl = document.getElementById('save_msg');
    msgEl.className = 'message ' + type;
    msgEl.innerText = message;
    msgEl.style.display = 'block';
}

const initNav = function(is_admin) {
    let listLink = document.getElementById('nav_employee_list');
    if ( is_admin && listLink ) {
        listLink.style.display = 'inline';
    }

    let logoutLink = document.getElementById('nav_logout');
    if ( logoutLink ) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            let api = new EmployeeApi();
            api.doLogout().then(function() {
                document.location.href = '/frontend/login.html';
            });
        });
    }
}
