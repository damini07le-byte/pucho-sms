// AUTHENTICATION LOGIC
const auth = {
    currentUser: JSON.parse(localStorage.getItem('sms_user')) || null,

    // Static Credentials
    credentials: {
        admin: { email: "admin", password: "123", role: "admin", name: "Supreme Admin" },
        staff: { email: "staff", password: "123", role: "staff", name: "Teacher Rahul" },
        student: { email: "student", password: "123", role: "student", name: "Arjun Das" },
        parent: { email: "parent", password: "123", role: "parent", name: "Vikram Das" }
    },

    login: async function (email, password, role) {
        // Fallback to static credentials if Supabase not ready
        if (dashboard.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
            let user = this.credentials[email] || Object.values(this.credentials).find(u => u.email === email && u.role === role);
            if (!user && this.credentials[role] && this.credentials[role].email === email) user = this.credentials[role];

            if (user && user.password === String(password)) {
                this.currentUser = user;
                localStorage.setItem('sms_user', JSON.stringify(user));
                return true;
            }
            return false;
        }

        // --- SUPABASE AUTH LOGIC ---
        try {
            const table = (role === 'admin' || role === 'staff') ? 'staff' : 'students';
            const query = `?email=eq.${email}&password=eq.${password}`;
            const users = await dashboard.db(table, 'GET', null, query);

            if (users && users.length > 0) {
                const user = users[0];
                // Map DB keys to expected UI keys if needed
                this.currentUser = {
                    ...user,
                    role: user.role || role,
                    name: user.name || user.student_name || 'User'
                };
                localStorage.setItem('sms_user', JSON.stringify(this.currentUser));
                return true;
            }
        } catch (err) {
            console.error("Auth Fail:", err);
        }
        return false;
    },

    logout: function () {
        this.currentUser = null;
        localStorage.removeItem('sms_user');
        window.location.reload();
    },

    checkSession: function () {
        if (this.currentUser) {
            // Smart Routing: Only redirect if hash indicates a dashboard page
            const hash = window.location.hash;
            const isDashboardRoute = hash && hash !== '#home' && hash !== '#' && hash.length > 2;

            if (isDashboardRoute) {
                // Show Dashboard
                if (document.getElementById('landingSection')) document.getElementById('landingSection').classList.add('hidden');
                if (document.getElementById('loginModal')) document.getElementById('loginModal').classList.add('hidden');
                document.getElementById('appShell').classList.remove('hidden');
                document.body.classList.remove('overflow-hidden');
                populateUserInfo(this.currentUser);
                dashboard.init();
            } else {
                // Stay on Landing Page - Logic to modify buttons REMOVED per user request
            }
        }
    },

    showForgotPass: function () {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('forgotModal').classList.remove('hidden');
    },

    handleForgotSubmit: function (e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const submitBtn = document.querySelector('#forgotModal button[type="submit"]');
        const originalText = submitBtn.innerText;

        // Check if user exists in our mock DB (credentials)
        const user = Object.values(this.credentials).find(u => u.email.toLowerCase() === email.toLowerCase());

        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            document.getElementById('forgotModal').classList.add('hidden');
            document.getElementById('loginModal').classList.remove('hidden');

            if (user) {
                if (user.role === 'staff' || user.role === 'admin') {
                    // Secure logic for staff/admin
                    showToast(`Recovery instruction sent to secure server.\nPlease contact IT department if not received.`, 'info');
                } else {
                    // Logic for Student/Parent
                    showToast(`Password reset link sent to: ${email}`, 'success');
                }
            } else {
                // Security best practice + Demo helpfulness
                showToast(`If an account exists for ${email}, a reset link has been sent.`, 'info');
            }
        }, 1500);
    }
};

// UI Helpers
function populateUserInfo(user) {
    if (document.getElementById('userName')) document.getElementById('userName').innerText = user.name;
    if (document.getElementById('userRole')) document.getElementById('userRole').innerText = user.role;
    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.innerText = user.name.charAt(0);
}

// Initial session check
document.addEventListener('DOMContentLoaded', () => {
    auth.checkSession();

    // Login Form Listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const isSignup = !document.getElementById('signupFields').classList.contains('hidden');
            const errorDiv = document.getElementById('loginError');

            const emailInput = document.getElementById('username');
            const passInput = document.getElementById('password');
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();

            const roleSelect = document.getElementById('loginRole');
            const role = roleSelect ? roleSelect.value.toLowerCase().trim() : 'parent';

            if (isSignup) {
                const name = document.getElementById('regName').value.trim();
                if (!name || !email || !pass) {
                    showToast("Please fill all fields.", 'error');
                    return;
                }
                auth.credentials[email] = { email: email, password: pass, role: 'parent', name: name };
                showToast(`Account Created!\nWelcome, ${name}.\nPlease login with your new credentials.`, 'success');
                router.showLogin();
                emailInput.value = email;
                return;
            }

            if (await auth.login(email, pass, role)) {
                errorDiv.classList.add('hidden');
                window.location.hash = '#overview'; // Force redirect to Dashboard
                auth.checkSession();
            } else {
                errorDiv.classList.remove('hidden');
                loginForm.classList.add('animate-pulse');
                setTimeout(() => loginForm.classList.remove('animate-pulse'), 500);
            }
        });
    }

    // Toggle Sidebar for mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sb = document.getElementById('sidebar');
            if (sb) sb.classList.toggle('-translate-x-full');
        });
    }
});

window.auth = auth;
