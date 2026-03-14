// AUTHENTICATION LOGIC
const auth = {
    currentUser: JSON.parse(localStorage.getItem('sms_user')) || null,

    // Static Credentials
    credentials: {
        admin: { email: "admin", password: "123", role: "admin", name: "Supreme Admin" },
        staff: { email: "staff", password: "123", role: "staff", name: "Teacher Rahul" },
        parent: { email: "parent", password: "123", role: "parent", name: "Vikram Das" }
    },

    login: async function (email, password, role) {
        // 1. Check Static Credentials FIRST (for backward compatibility/demo)
        let user = this.credentials[email.toLowerCase().trim()];
        if (!user) {
            user = Object.values(this.credentials).find(u => u.email === email && u.role === role);
        }

        if (user && user.password === String(password)) {
            if (user.role === role) {
                console.log("Static Login Success:", user);
                this.currentUser = user;
                localStorage.setItem('sms_user', JSON.stringify(user));
                return true;
            }
        }

        // 2. REAL Supabase Auth Logic
        if (window.dashboard && window.dashboard.initSupabase) {
            if (!window.dashboard.supabase) await window.dashboard.initSupabase();
            
            if (window.dashboard.supabase) {
                const { data, error } = await window.dashboard.supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (data?.user) {
                    console.log("Supabase Auth Success:", data.user);
                    const metadata = data.user.user_metadata || {};
                    this.currentUser = {
                        id: data.user.id,
                        email: data.user.email,
                        role: metadata.role || role,
                        name: metadata.full_name || metadata.name || data.user.email.split('@')[0]
                    };
                    localStorage.setItem('sms_user', JSON.stringify(this.currentUser));
                    return true;
                }
                if (error) {
                    console.error("Supabase Auth Error:", error.message);
                    throw error;
                }
            }
        }

        return false;
    },

    logout: async function () {
        if (window.dashboard && window.dashboard.supabase) {
            await window.dashboard.supabase.auth.signOut();
        }
        this.currentUser = null;
        localStorage.removeItem('sms_user');
        window.location.reload();
    },

    showDashboard: function () {
        if (!this.currentUser) return;

        // Hide Landing & Modal
        const landing = document.getElementById('landingSection');
        const loginModal = document.getElementById('loginModal');
        const appShell = document.getElementById('appShell');

        if (landing) landing.classList.add('hidden');
        if (loginModal) {
            loginModal.classList.add('hidden');
            loginModal.classList.remove('flex');
        }

        // Show App Shell
        if (appShell) appShell.classList.remove('hidden');
        document.body.classList.remove('overflow-hidden');

        // Populate User Info
        populateUserInfo(this.currentUser);

        // Robust Initialization: Wait for dashboard object (Standard script sync issue)
        let retryCount = 0;
        const maxRetries = 50; // 5 seconds total
        const initChecker = setInterval(() => {
            if (window.dashboard && typeof window.dashboard.init === 'function') {
                clearInterval(initChecker);
                window.dashboard.init();
                // If no specific hash, go to overview
                if (!window.location.hash || window.location.hash === '#') {
                    window.location.hash = '#overview';
                }
                console.log("[Auth] Dashboard init successful.");
            } else {
                retryCount++;
                if (retryCount % 10 === 0) console.log(`[Auth] Still waiting for dashboard... (${retryCount}/${maxRetries})`);
                if (retryCount >= maxRetries) {
                    clearInterval(initChecker);
                    console.error("[Auth] Dashboard failed to load.");
                    if (typeof showToast === 'function') showToast("Dashboard failed to initialize.", "error");
                }
            }
        }, 100);
    },

    checkSession: function () {
        // We ALWAYS show the landing page first
        if (document.getElementById('landingSection')) document.getElementById('landingSection').classList.remove('hidden');
        if (document.getElementById('appShell')) document.getElementById('appShell').classList.add('hidden');
        
        const hash = window.location.hash.substring(1);
        const dashboardPages = ['overview', 'students', 'staff', 'fees', 'exams', 'attendance_all', 'ai_insights', 'communication', 'reports', 'settings', 'my_classes', 'mark_attendance', 'exam_marks', 'manage_quizzes', 'homework', 'staff_notices', 'parent_attendance', 'parent_homework', 'parent_fees', 'parent_results', 'parent_leave', 'parent_notices', 'subjects', 'leave_approvals'];
        
        if (this.currentUser && dashboardPages.includes(hash)) {
            this.showDashboard();
        }
    },

    showForgotPass: function () {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('forgotModal').classList.remove('hidden');
    },

    handleForgotSubmit: async function (e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const submitBtn = document.querySelector('#forgotModal button[type="submit"]');
        const originalText = submitBtn.innerText;

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending Link...";

        try {
            if (window.dashboard && !window.dashboard.supabase) await window.dashboard.initSupabase();

            if (window.dashboard && window.dashboard.supabase) {
                const { error } = await window.dashboard.supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/#settings',
                });

                if (error) throw error;
                
                showToast(`Reset link successfully sent to ${email}`, 'success');
                document.getElementById('forgotModal').classList.add('hidden');
                document.getElementById('loginModal').classList.remove('hidden');
            } else {
                throw new Error("Auth service unavailable");
            }
        } catch (err) {
            console.error("Forgot Pass Error:", err);
            showToast(err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    },

    signUp: async function (name, email, password, role = 'parent') {
        try {
            if (window.dashboard && !window.dashboard.supabase) await window.dashboard.initSupabase();
            const client = window.dashboard ? window.dashboard.supabase : null;

            if (!client) {
                showToast("Connection to server failed. Please try again.", 'error');
                return false;
            }

            const { data, error } = await client.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        role: role
                    }
                }
            });

            if (error) {
                console.error("Supabase Auth Error:", error);
                throw error;
            }

            if (data?.user) {
                const { error: profileError } = await client
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: name,
                            role: role,
                            phone: ''
                        }
                    ]);

                if (profileError) {
                    console.error("Profile Creation Failed:", profileError);
                }

                if (data.identities?.length === 0) {
                    showToast("User already exists. Please login.", 'warning');
                } else {
                    showToast(`Success! Verification email sent to: ${email}`, 'success');
                }
                return true;
            }
            return false;
        } catch (err) {
            console.error("SignUp Execution Error:", err);
            showToast(err.message || "Registration failed", 'error');
            return false;
        }
    }
};

// UI Helpers
function populateUserInfo(user) {
    if (document.getElementById('userName')) document.getElementById('userName').innerText = user.name;
    if (document.getElementById('userRole')) document.getElementById('userRole').innerText = user.role;
    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.innerText = (user.name || "U").charAt(0);
}

// Initial session check
document.addEventListener('DOMContentLoaded', () => {
    try {
        auth.checkSession();
    } catch (err) {
        console.error("Session Check Failed:", err);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
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
                    
                    const success = await auth.signUp(name, email, pass, role);
                    if (success) {
                        router.showLogin();
                        showToast(`Registration successful! Please sign in.`, 'success');
                    }
                    return;
                }

                try {
                    const success = await auth.login(email, pass, role);
                    if (success) {
                        if (errorDiv) errorDiv.classList.add('hidden');
                        auth.showDashboard();
                    } else {
                        if (errorDiv) errorDiv.classList.remove('hidden');
                        loginForm.classList.add('animate-shake');
                        setTimeout(() => loginForm.classList.remove('animate-shake'), 500);
                    }
                } catch (err) {
                    showToast(err.message, 'error');
                }
            } catch (err) {
                console.error("Login Error:", err);
            }
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sb = document.getElementById('sidebar');
            if (sb) sb.classList.toggle('-translate-x-full');
        });
    }
});

window.auth = auth;
