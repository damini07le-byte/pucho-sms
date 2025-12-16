// ========================================
// ADMIN AUTHENTICATION
// ========================================

// Mock admin credentials (for demo purposes)
const ADMIN_CREDENTIALS = {
    username: 'admin@puchopublicschool.edu.in',
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
});
