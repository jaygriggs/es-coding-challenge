
document.addEventListener('DOMContentLoaded',
    function() {

        let api = new EmployeeApi();

        api.requireLogin().then(
            function( auth_data ) {
                initNavbar(auth_data);
                if ( auth_data.is_admin == 1 ) {
                    let adminBtn = document.getElementById('admin_list_btn');
                    if ( adminBtn ) {
                        adminBtn.style.display = 'inline-block';
                    }
                }
            }
        );
    }
);
