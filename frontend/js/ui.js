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

// Theme toggle — per-user via localStorage
const applyTheme = function() {
    let theme = localStorage.getItem('em_theme') || 'light';
    let cyber = localStorage.getItem('em_cyber') === 'true';

    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme-style', cyber ? 'cyber' : 'default');

    let btn = document.getElementById('btn_theme');
    if ( btn ) {
        if ( theme === 'dark' ) {
            btn.textContent = 'Light Mode';
            btn.classList.remove('btn-dark');
            btn.classList.add('btn-light');
        } else {
            btn.textContent = 'Dark Mode';
            btn.classList.remove('btn-light');
            btn.classList.add('btn-dark');
        }
    }

    let cyberBtn = document.getElementById('btn_cyber');
    if ( cyberBtn ) {
        if ( cyber ) {
            cyberBtn.textContent = 'Classic';
            cyberBtn.classList.remove('btn-outline-info');
            cyberBtn.classList.add('btn-info');
        } else {
            cyberBtn.textContent = 'Cyber';
            cyberBtn.classList.remove('btn-info');
            cyberBtn.classList.add('btn-outline-info');
        }
    }
}

const saveThemeToDB = function() {
    let theme = localStorage.getItem('em_theme') || 'light';
    let cyber = localStorage.getItem('em_cyber') === 'true';
    let dbTheme = cyber ? 'cyber' : theme;
    let api = new EmployeeApi();
    api.setTheme(dbTheme);
}

const loadThemeFromData = function(themePreference) {
    if ( themePreference === 'cyber' ) {
        localStorage.setItem('em_theme', 'dark');
        localStorage.setItem('em_cyber', 'true');
    } else if ( themePreference === 'dark' ) {
        localStorage.setItem('em_theme', 'dark');
        localStorage.setItem('em_cyber', 'false');
    } else {
        localStorage.setItem('em_theme', 'light');
        localStorage.setItem('em_cyber', 'false');
    }
    applyTheme();
}

const initThemeToggle = function() {
    applyTheme();
    let btn = document.getElementById('btn_theme');
    if ( btn ) {
        btn.addEventListener('click', function() {
            let current = localStorage.getItem('em_theme') || 'light';
            let next = current === 'dark' ? 'light' : 'dark';
            // Switching to light turns off cyber
            if ( next === 'light' ) {
                localStorage.setItem('em_cyber', 'false');
            }
            localStorage.setItem('em_theme', next);
            applyTheme();
            saveThemeToDB();
        });
    }

    let cyberBtn = document.getElementById('btn_cyber');
    if ( cyberBtn ) {
        cyberBtn.addEventListener('click', function() {
            let current = localStorage.getItem('em_cyber') === 'true';
            localStorage.setItem('em_cyber', !current);
            // Cyber forces dark mode
            if ( !current ) {
                localStorage.setItem('em_theme', 'dark');
            }
            applyTheme();
            saveThemeToDB();
        });
    }
}

// Apply theme on every page EXCEPT login
if ( !window.location.pathname.includes('login.html') ) {
    applyTheme();
}

const initNavbar = function(auth_data) {
    let is_admin = auth_data && auth_data.is_admin == 1;
    let listLink = document.getElementById('nav_employee_list');
    if ( listLink ) {
        listLink.style.display = is_admin ? 'inline' : 'none';
    }

    let logoutLink = document.getElementById('nav_logout');
    if ( logoutLink ) {
        // Inject logout modal into page
        let modalDiv = document.createElement('div');
        modalDiv.innerHTML = '<div class="modal fade" id="logoutModal" tabindex="-1" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content">' +
            '<div class="modal-header border-0"><h5 class="modal-title">Log Out</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
            '<div class="modal-body"><p class="mb-0">Are you sure you want to log out?</p></div>' +
            '<div class="modal-footer border-0">' +
            '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>' +
            '<button type="button" class="btn btn-danger" id="confirmLogoutBtn">Log Out</button>' +
            '</div></div></div></div>';
        document.body.appendChild(modalDiv.firstChild);

        let logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));

        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.show();
        });

        document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
            logoutModal.hide();
            let api = new EmployeeApi();
            api.doLogout().then(function() {
                document.location.href = '/frontend/login.html';
            });
        });
    }
}
