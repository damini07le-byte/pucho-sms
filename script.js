// ========================================
// PUCHO PUBLIC SCHOOL - MAIN JAVASCRIPT
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ========================================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle hash links, not just "#"
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate form
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Success message
            alert('Thank you for contacting us! We will get back to you soon.');

            // Reset form
            contactForm.reset();
        });
    }

    // ========================================
    // STAFF LOGIN FORM HANDLING
    // ========================================
    const staffLoginForm = document.getElementById('staffLoginForm');
    if (staffLoginForm) {
        staffLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validate form
            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Mock validation for demo purposes
            if (email === 'staff@pucho.com' && password === 'staff123') {
                // Store login status
                sessionStorage.setItem('staffLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);

                // Redirect to staff dashboard
                window.location.href = 'staff-dashboard.html';
            } else {
                alert('Invalid staff credentials. Use staff@pucho.com / staff123');
            }
        });
    }

    // ========================================
    // PARENT LOGIN FORM HANDLING
    // ========================================
    const parentLoginForm = document.getElementById('parentLoginForm');
    if (parentLoginForm) {
        parentLoginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validate form
            if (!emailOrPhone || !password) {
                alert('Please enter both email/phone and password.');
                return;
            }

            // Basic validation - check if it's email or phone
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;

            if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
                alert('Please enter a valid email address or phone number.');
                return;
            }

            // Mock validation for demo purposes
            if (emailOrPhone === 'parent@pucho.com' && password === 'parent123') {
                // Store login status
                sessionStorage.setItem('parentLoggedIn', 'true');
                sessionStorage.setItem('userIdentifier', emailOrPhone);

                // Redirect to parent dashboard
                window.location.href = 'parent-dashboard.html';
            } else {
                alert('Invalid parent credentials. Use parent@pucho.com / parent123');
            }
        });
    }

    // ========================================
    // STAFF DASHBOARD - CHECK LOGIN STATUS
    // ========================================
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'staff-dashboard.html') {
        // Check if staff is logged in
        const staffLoggedIn = sessionStorage.getItem('staffLoggedIn');

        if (!staffLoggedIn) {
            // Redirect to login if not logged in
            alert('Please login to access the staff dashboard.');
            window.location.href = 'staff-login.html';
        }
    }

    // ========================================
    // PARENT DASHBOARD - CHECK LOGIN STATUS
    // ========================================
    if (currentPage === 'parent-dashboard.html') {
        // Check if parent is logged in
        const parentLoggedIn = sessionStorage.getItem('parentLoggedIn');

        if (!parentLoggedIn) {
            // Redirect to login if not logged in
            alert('Please login to access the parent dashboard.');
            window.location.href = 'parent-login.html';
        }
    }

    // ========================================
    // STAFF LOGOUT FUNCTIONALITY
    // ========================================
    const staffLogoutBtn = document.getElementById('staffLogout');
    if (staffLogoutBtn) {
        staffLogoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear session storage
                sessionStorage.removeItem('staffLoggedIn');
                sessionStorage.removeItem('userEmail');

                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
    }

    // ========================================
    // PARENT LOGOUT FUNCTIONALITY
    // ========================================
    const parentLogoutBtn = document.getElementById('parentLogout');
    if (parentLogoutBtn) {
        parentLogoutBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear session storage
                sessionStorage.removeItem('parentLoggedIn');
                sessionStorage.removeItem('userIdentifier');

                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
    }

    // ========================================
    // SIDEBAR MENU ACTIVE STATE
    // ========================================
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Don't prevent default for logout links
            if (this.id === 'staffLogout' || this.id === 'parentLogout') {
                return;
            }

            // For other links, prevent default and update active state
            if (this.getAttribute('href') === '#') {
                e.preventDefault();

                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');
            }
        });
    });

    // ========================================
    // FORM INPUT FOCUS EFFECTS
    // ========================================
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // BUTTON CLICK EFFECTS
    // ========================================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'scale(1)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // ========================================
    // MOBILE MENU TOGGLE (FOR FUTURE ENHANCEMENT)
    // ========================================
    // This can be enhanced later for mobile hamburger menu

    console.log('Pucho Public School - Website Loaded Successfully');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Function to format currency (Indian Rupees)
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
}
