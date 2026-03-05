document.addEventListener('DOMContentLoaded',
    function() {

        let api = new EmployeeApi();

        api.requireLogin().then(
            function( auth_data ) {
                initNavbar(auth_data);
                initThemeToggle();
            }
        );
    }
);
