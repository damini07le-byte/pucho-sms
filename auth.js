// ========================================
// AUTHENTICATION & SESSION MANAGEMENT
// ========================================

const Auth = {
    // Check if user is logged in
    isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    // Get current user role
    getRole() {
        return localStorage.getItem('userRole');
    },

    // Get user info
    getUser() {
        return {
            role: localStorage.getItem('userRole'),
            email: localStorage.getItem('userEmail'),
            name: localStorage.getItem('userName')
        };
    },

    // Login user
    login(role, email, name = '') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name || email);
        localStorage.setItem('loginTime', new Date().toISOString());
    },

    // Logout user
    logout() {
        localStorage.clear();
    },

    // Check if user has required role
    hasRole(requiredRole) {
        return this.getRole() === requiredRole;
    },

    // Validate login (mock validation - accepts any non-empty input)
    validateLogin(username, password) {
        return username.trim() !== '' && password.trim() !== '';
    }
};

// ========================================
// ROUTE GUARDS
// ========================================

const RouteGuard = {
    // Check if route requires authentication
    requiresAuth(path) {
        const protectedRoutes = ['/dashboard/admin', '/dashboard/staff', '/dashboard/parent'];
        return protectedRoutes.some(route => path.startsWith(route));
    },

    // Get required role for a route
    getRequiredRole(path) {
        if (path.startsWith('/dashboard/admin')) return 'admin';
        if (path.startsWith('/dashboard/staff')) return 'staff';
        if (path.startsWith('/dashboard/parent')) return 'parent';
        return null;
    },

    // Check if user can access route
    canAccess(path) {
        // Public routes
        if (!this.requiresAuth(path)) return true;

        // Check authentication
        if (!Auth.isAuthenticated()) return false;

        // Check role
        const requiredRole = this.getRequiredRole(path);
        return Auth.hasRole(requiredRole);
    },

    // Redirect to appropriate page
    redirectUnauthorized(path) {
        if (!Auth.isAuthenticated()) {
            // Not logged in - redirect to home
            return '/';
        }

        // Logged in but wrong role - redirect to their dashboard
        const userRole = Auth.getRole();
        return `/dashboard/${userRole}`;
    }
};
