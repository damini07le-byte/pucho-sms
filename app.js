// ========================================
// SPA ROUTER & APPLICATION
// ========================================

class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        // Handle initial page load
        this.loadRoute();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.loadRoute());

        // Handle link clicks
        document.addEventListener('click', (e) => {
            // Handle data-link navigation
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigate(href);
            }

            // Handle scroll links
            if (e.target.matches('[data-scroll]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            // Handle logout
            if (e.target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'staffLoginForm') {
                e.preventDefault();
                this.handleStaffLogin(e.target);
            }
            if (e.target.id === 'parentLoginForm') {
                e.preventDefault();
                this.handleParentLogin(e.target);
            }
            if (e.target.id === 'adminLoginForm') {
                e.preventDefault();
                this.handleAdminLogin(e.target);
            }
            if (e.target.id === 'contactForm') {
                e.preventDefault();
                this.handleContactForm(e.target);
            }
        });
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadRoute();
    }

    loadRoute() {
        const path = window.location.pathname;

        // Check route access
        if (!RouteGuard.canAccess(path)) {
            const redirectPath = RouteGuard.redirectUnauthorized(path);
            window.history.replaceState({}, '', redirectPath);
            this.renderRoute(redirectPath);
            return;
        }

        this.renderRoute(path);
    }

    renderRoute(path) {
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
        const app = document.getElementById('app');

        if (route) {
            app.innerHTML = route.component();
            // Scroll to top on route change
            window.scrollTo(0, 0);
        }
    }

    // ========================================
    // LOGIN HANDLERS
    // ========================================

    handleStaffLogin(form) {
        const email = form.querySelector('#staffEmail').value;
        const password = form.querySelector('#staffPassword').value;

        if (Auth.validateLogin(email, password)) {
            Auth.login('staff', email, email);
            this.navigate('/dashboard/staff');
        } else {
            alert('Please enter valid credentials');
        }
    }

    handleParentLogin(form) {
        const email = form.querySelector('#parentEmail').value;
        const password = form.querySelector('#parentPassword').value;

        if (Auth.validateLogin(email, password)) {
            Auth.login('parent', email, email);
            this.navigate('/dashboard/parent');
        } else {
            alert('Please enter valid credentials');
        }
    }

    handleAdminLogin(form) {
        const username = form.querySelector('#adminUsername').value;
        const password = form.querySelector('#adminPassword').value;

        if (Auth.validateLogin(username, password)) {
            Auth.login('admin', username, 'Administrator');
            this.navigate('/dashboard/admin');
        } else {
            alert('Please enter valid credentials');
        }
    }

    handleContactForm(form) {
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;

        if (name && email && message) {
            alert('Thank you for contacting us! We will get back to you soon.');
            form.reset();
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            Auth.logout();
            this.navigate('/');
        }
    }
}

// ========================================
// ROUTE DEFINITIONS
// ========================================

const routes = [
    { path: '/', component: Pages.home },
    { path: '/login/staff', component: Pages.staffLogin },
    { path: '/login/parent', component: Pages.parentLogin },
    { path: '/admin', component: Pages.adminLogin },
    { path: '/dashboard/staff', component: Pages.staffDashboard },
    { path: '/dashboard/parent', component: Pages.parentDashboard },
    { path: '/dashboard/admin', component: Pages.adminDashboard },
    { path: '*', component: Pages.notFound }
];

// ========================================
// INITIALIZE APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    new Router(routes);
});
