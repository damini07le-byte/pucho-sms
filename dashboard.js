// MASTER DASHBOARD ENGINE
const dashboard = {
    // Robust environment variable detection for both Vite and standard script contexts
    supabaseUrl: (typeof window !== 'undefined' && window.process && window.process.env) ? window.process.env.VITE_SUPABASE_URL : (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : ''),
    supabaseKey: (typeof window !== 'undefined' && window.process && window.process.env) ? window.process.env.VITE_SUPABASE_KEY : (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_KEY : ''),
    supabase: null,

    initSupabase: async function() {
        if (!this.supabaseUrl || !this.supabaseKey || this.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
             console.warn("[Supabase] Missing credentials, using mock mode.");
             return;
        }
        try {
            if (!window.createClient) {
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
                this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
            } else {
                this.supabase = window.createClient(this.supabaseUrl, this.supabaseKey);
            }
            console.log("[Supabase] Client Initialized");
        } catch (err) {
            console.error("[Supabase] Initialization failed:", err);
        }
    },

    get auth() { return window.auth; },
    get schoolDB() { return window.schoolDB; },

    isDbConnected: false,
    
    db: async function (table, method = 'GET', body = null, query = '') {
        if (!this.supabase) await this.initSupabase();
        if (!this.supabase) return null;
        try {
            let q = this.supabase.from(table);
            if (method === 'GET') {
                let selectClause = '*';
                const selectMatch = query.match(/select=([^&]+)/);
                if (selectMatch) selectClause = decodeURIComponent(selectMatch[1]);
                let res = q.select(selectClause);
                if (query.includes('eq.')) {
                    query.replace('?', '').split('&').forEach(f => {
                        if (f.includes('=eq.')) {
                            const [field, value] = f.split('=eq.');
                            res = res.eq(field, decodeURIComponent(value));
                        }
                    });
                }
                const { data, error } = await res;
                if (error) throw error;
                return data;
            } else if (method === 'POST') {
                const { data, error } = await q.insert(body).select();
                if (error) throw error;
                return data;
            }
            return null;
        } catch (err) {
            console.error(`[DB Error] ${table}:`, err);
            return null;
        }
    },

    syncDB: async function (silent = false) {
        try {
            const notices = await this.db('notices');
            if (notices) {
                window.schoolDB.notices = notices.map(n => ({
                    ...n,
                    target: (n.target || 'Global').toLowerCase(),
                    content: n.content || n.description || '',
                    image_url: n.image_url || ''
                }));
            }
            this.isDbConnected = true;
        } catch (e) {
            console.warn("Sync failed, using mocks.");
        }
    },

    init: async function () {
        console.log("[Dashboard] Initializing...");
        this.renderSidebar();
        await this.syncDB(true);
        const hash = window.location.hash.substring(1) || 'overview';
        this.loadPage(hash);
        
        // Setup Hash Routing
        if (!this._hashSetup) {
            window.addEventListener('hashchange', () => {
                const newHash = window.location.hash.substring(1) || 'overview';
                console.log("[Dashboard] Route Change:", newHash);
                this.loadPage(newHash);
            });
            this._hashSetup = true;
        }
    },

    getMenuItems: function (role) {
        const common = [{ id: 'overview', name: 'Overview', icon: '📊' }];
        const menus = {
            admin: [{ id: 'communication', name: 'Communication', icon: '📢' }],
            parent: [
                { id: 'parent_notices', name: 'Announcements', icon: '🔔' },
                { id: 'parent_homework', name: 'Homework', icon: '📖' }
            ],
            staff: [{ id: 'homework', name: 'Homework', icon: '📖' }]
        };
        return [...common, ...(menus[role.toLowerCase()] || [])];
    },

    renderSidebar: function () {
        const user = window.auth.currentUser;
        if (!user) return;
        const nav = document.getElementById('navLinks');
        if (!nav) return;
        nav.innerHTML = '';
        this.getMenuItems(user.role).forEach(item => {
            const link = document.createElement('a');
            link.href = `#${item.id}`;
            link.className = `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100 text-gray-700`;
            link.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span>`;
            nav.appendChild(link);
        });
    },

    loadPage: function (id) {
        console.log("[Dashboard] Loading page:", id);
        const content = document.getElementById('mainContent');
        if (!content) return;
        
        // Active state for sidebar
        document.querySelectorAll('#navLinks a').forEach(l => {
            l.classList.toggle('bg-gray-100', l.getAttribute('href') === `#${id}`);
        });

        if (this[id]) {
            content.innerHTML = this[id](window.auth.currentUser.role);
        } else {
            content.innerHTML = `<div class="p-20 text-center animate-fade-in">
                <div class="text-6xl mb-4">🚧</div>
                <h2 class="text-2xl font-bold text-gray-800">${id} Module</h2>
                <p class="text-gray-400 mt-2">This feature is coming soon.</p>
            </div>`;
        }
    },

    overview: function() {
        return `<div class="p-8 animate-fade-in">
            <h1 class="text-3xl font-bold text-gray-800">Welcome, ${window.auth.currentUser.name}</h1>
            <p class="text-gray-500 mt-2">Here is what is happening in your school today.</p>
        </div>`;
    },

    parent_notices: function () {
        const notices = (window.schoolDB.notices || []).filter(n => 
            n.target === 'parent' || n.target === 'parents' || n.target === 'global' || n.target === 'all'
        );
        return this.renderNoticeList(notices, 'School Announcements');
    },

    renderNoticeList: function (notices, title) {
        const cards = notices.map(n => {
            let img = n.image_url;
            let content = n.content || '';
            if (!img && content.includes('[[IMG:')) {
                const match = content.match(/\[\[IMG:(.*?)\]\]/);
                if (match) {
                    img = match[1];
                    content = content.replace(/\[\[IMG:.*?\]\]/g, '').trim();
                }
            }
            return `
                <div class="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden flex flex-col animate-fade-in hover:shadow-md transition-all">
                    ${img ? `<div class="h-48 overflow-hidden"><img src="${img}" class="w-full h-full object-cover"></div>` : ''}
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                             <h4 class="font-bold text-lg text-gray-800">${n.title}</h4>
                             <span class="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-400 font-bold uppercase">${n.date || 'Today'}</span>
                        </div>
                        <p class="text-gray-500 text-sm leading-relaxed">${content}</p>
                    </div>
                </div>`;
        }).join('');

        return `
            <div class="p-8 space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-800">${title}</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${cards || '<div class="col-span-2 py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100"><p class="text-gray-400 italic">No announcements found at the moment.</p></div>'}
                </div>
            </div>`;
    }
};

window.dashboard = dashboard;
