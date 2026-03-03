

document.addEventListener('DOMContentLoaded', 
    function() {

        const form = document.getElementById('login_form');

        form.addEventListener('submit',
            function( e ) {
                e.preventDefault();

                let username = document.getElementById('username').value;
                let password = document.getElementById('password').value;

                clearFieldError('username');
                clearFieldError('password');

                let api = new EmployeeApi();

                if ( !username ) {
                    invalidateField('username');
                }
                if ( !password ) {
                    invalidateField('password');
                }

                if ( !username || !password ) {
                    showToast('Please enter your username and password.', 'error');
                    return;
                }

                api.doLogin(username, password).then (
                    function( data ) {
                        document.location.href = '/frontend/dashboard.html';
                    }
                )
                .catch( 
                    function(data) {
                        showToast('Invalid credentials. Please try again.', 'error');
                    }
                )
            }
        );

    }
);

const invalidateField = function(fieldId) {
    let el = document.getElementById(fieldId);
    if ( el ) {
        el.classList.add('is-invalid');
    }
}

const clearFieldError = function(fieldId) {
    let el = document.getElementById(fieldId);
    if ( el ) {
        el.classList.remove('is-invalid');
    }
}

