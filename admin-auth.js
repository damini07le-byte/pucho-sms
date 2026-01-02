// ========================================
// ADMIN AUTHENTICATION
// ========================================

// Mock admin credentials (for demo purposes)
const ADMIN_CREDENTIALS = {
    username: 'admin@pucho.com',
    password: 'admin123'
};

// Alternative admin credentials
const ADMIN_CREDENTIALS_ALT = {
    username: 'admin',
    password: 'admin123'
};

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // ADMIN LOGIN FORM HANDLING
    // ========================================
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('errorMessage');

            // Clear previous errors
            errorMessage.classList.add('hidden');
            errorMessage.textContent = '';

            // Validate form
            if (!username || !password) {
                showError('Please enter both username and password.');
                return;
            }

            // Check credentials
            if ((username === ADMIN_CREDENTIALS.username || username === ADMIN_CREDENTIALS_ALT.username) &&
                password === ADMIN_CREDENTIALS.password) {

                // Store admin session
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('userRole', 'admin');
                sessionStorage.setItem('adminUsername', username);
                sessionStorage.setItem('loginTime', new Date().toISOString());

                // Redirect to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                showError('Invalid username or password. Please try again.');
            }
        });
    }

    // ========================================
    // ADMIN DASHBOARD - CHECK LOGIN STATUS
    // ========================================
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'admin-dashboard.html') {
        // Check if admin is logged in
        const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
        const userRole = sessionStorage.getItem('userRole');

        if (!adminLoggedIn || userRole !== 'admin') {
            // Redirect to admin login if not logged in or not admin
            alert('Please login as admin to access the dashboard.');
            window.location.href = 'admin.html';
        }
    }

    // ========================================
    // ADMIN LOGOUT FUNCTIONALITY
    // ========================================
    const adminLogoutBtn = document.getElementById('adminLogout');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear all session storage
                sessionStorage.clear();

                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
    }

    // Export to global scope for onclick handlers
    window.togglePasswordVisibility = function (inputId) {
        const input = document.getElementById(inputId);
        const iconContainer = input.parentElement.querySelector('.password-toggle-icon');
        if (input && iconContainer) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            // Toggle icon SVG
            if (isPassword) {
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            } else {
                iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
        }
    };
});
