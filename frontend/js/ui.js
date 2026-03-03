const showToast = function(message, variant) {
    let toastEl = document.getElementById('app_toast');
    if ( !toastEl ) {
        return;
    }

    let body = toastEl.querySelector('.toast-body');
    if ( body ) {
        body.textContent = message;
    }

    toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-info');
    if ( variant === 'success' ) {
        toastEl.classList.add('text-bg-success');
    }
    else if ( variant === 'error' ) {
        toastEl.classList.add('text-bg-danger');
    }
    else {
        toastEl.classList.add('text-bg-info');
    }

    let toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
}

const initNavbar = function(auth_data) {
    let is_admin = auth_data && auth_data.is_admin == 1;
    let listLink = document.getElementById('nav_employee_list');
    if ( listLink ) {
        listLink.style.display = is_admin ? 'inline' : 'none';
    }

    let logoutLink = document.getElementById('nav_logout');
    if ( logoutLink ) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if ( !confirm('Are you sure you want to log out?') ) {
                return;
            }
            let api = new EmployeeApi();
            api.doLogout().then(function() {
                document.location.href = '/frontend/login.html';
            });
        });
    }
}
