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
            window.scrollTo(0, 0);

            // Initialize Dashboard Logic based on route
            if (path === '/dashboard/staff') {
                this.initStaffDashboard();
            } else if (path === '/dashboard/parent') {
                this.initParentDashboard();
            } else if (path === '/dashboard/admin') {
                this.initAdminDashboard();
            }
        }
    }

    // ========================================
    // DASHBOARD LOGIC
    // ========================================

    initStaffDashboard() {
        this.setupDashboardNavigation(Pages.staffInner);
        this.renderDashboardPage('dashboard', Pages.staffInner); // Load default view
    }

    initParentDashboard() {
        this.setupDashboardNavigation(Pages.parentInner);
        this.renderDashboardPage('dashboard', Pages.parentInner); // Load default view
    }

    // Admin Dashboard Logic (Hash based)
    initAdminDashboard() {
        // Initial load based on current hash
        this.handleAdminHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleAdminHashChange());

        // Listen for specific admin forms
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'createStaffForm') {
                e.preventDefault();
                this.handleCreateStaff(e.target);
            }
            if (e.target.id === 'createParentForm') {
                e.preventDefault();
                this.handleCreateParent(e.target);
            }
        });
    }

    handleAdminHashChange() {
        // Only run if we are actually on the admin dashboard route
        if (window.location.pathname !== '/dashboard/admin') return;

        const hash = window.location.hash.slice(1) || 'dashboard'; // Remove #, default to dashboard

        // Map hash to template key
        let pageKey = 'dashboard';
        if (hash === 'create-staff') pageKey = 'createStaff';
        else if (hash === 'create-parent') pageKey = 'createParent';
        else if (hash === 'admissions') pageKey = 'admissions';
        else if (hash === 'fees') pageKey = 'fees';
        else if (hash === 'attendance') pageKey = 'attendance';
        else if (hash === 'reports') pageKey = 'reports';

        // Render content
        const mainContent = document.getElementById('adminMainContent');
        if (mainContent && Pages.adminInner[pageKey]) {
            mainContent.innerHTML = Pages.adminInner[pageKey];
        }

        // Update active sidebar link
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });

        // Default to dashboard active if no match (e.g. empty hash)
        if (hash === 'dashboard') {
            const dashLink = document.querySelector('.sidebar-menu a[href="#dashboard"]');
            if (dashLink) dashLink.classList.add('active');
        }
    }

    setupDashboardNavigation(templates) {
        // Sidebar Links
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Ignore logout
                if (link.id === 'logoutBtn') return;

                // If it's the Admin Dashboard, we let the default anchor behavior happen (hash change)
                if (window.location.pathname === '/dashboard/admin') {
                    // Do nothing, let hash change trigger handleAdminHashChange
                    return;
                }

                e.preventDefault();

                // Active state
                document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Determine page
                const text = link.innerText.toLowerCase();
                let page = 'dashboard';
                if (text.includes('attendance')) page = 'attendance';
                else if (text.includes('exam')) page = 'exams';
                else if (text.includes('student')) page = 'students';
                else if (text.includes('fee')) page = 'fee';
                else if (text.includes('result')) page = 'results';

                this.renderDashboardPage(page, templates);
            });
        });

        // Dynamic content links (e.g., Quick Actions)
        const mainContent = document.querySelector('.dashboard-content');
        if (mainContent) {
            mainContent.addEventListener('click', (e) => {
                if (e.target.matches('[data-dashboard-page]')) {
                    const page = e.target.dataset.dashboardPage;
                    this.renderDashboardPage(page, templates);
                }
            });
        }
    }

    renderDashboardPage(pageName, templates) {
        const mainContentContainer = document.querySelector('.dashboard-content');
        // Keep the header, replace the rest? No, usually replace the main part below header.
        // But our templates include the header. So we can try to find a container.
        // Actually, let's insert into a specific container if possible, OR just replace a wrapper.
        // For simplest migration, let's assume the Dashboard template has a #mainContent div or we replace .dashboard-content entirely?
        // Wait, the outer template in `pages.js` (staffDashboard) has `.dashboard-content`. 
        // The inner templates ALSO have `.content-header`. 
        // So we should replace the INNER HTML of `.dashboard-content`.

        if (mainContentContainer && templates[pageName]) {
            // Add logic to maintain the top "Hamburger" or "User" section if it existed, but here it's part of the template.
            // We will just replace innerHTML.
            mainContentContainer.innerHTML = templates[pageName];
        } else if (mainContentContainer) {
            mainContentContainer.innerHTML = `<h2>Page "${pageName}" under construction</h2>`;
        }
    }

    // ========================================
    // MODAL HANDLERS
    // ========================================
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'block';
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
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
    window.app = new Router(routes);
});
