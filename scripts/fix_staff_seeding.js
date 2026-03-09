
const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

const adminHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
};

async function db(table, method, body, query = '') {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
        const err = await response.text();
        console.error(`Error in ${table} (${method}):`, err);
        return null;
    }
    return await response.json();
}

async function createUser(email, password, role) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
            email,
            password,
            email_confirm: true,
            user_metadata: { role }
        })
    });
    if (!response.ok) {
        const err = await response.text();
        if (err.includes('already exists')) {
            const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers: adminHeaders });
            const list = await listRes.json();
            return list.users.find(u => u.email === email);
        }
        return null;
    }
    return await response.json();
}

async function fixStaff() {
    console.log("🚀 Fixing Staff Seeding Final...");
    const staffNames = ["Ms. Sunita Rao", "Mr. Amit Kumar", "Dr. Ramesh Babu"];
    for (const name of staffNames) {
        const email = `${name.replace(/\s+/g, '.').toLowerCase()}@pucho.final`;
        const user = await createUser(email, 'pucho123', 'staff');
        if (user) {
            const profile = await db('profiles', 'POST', {
                id: user.id,
                full_name: name,
                role: 'teacher',
                phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`
            });
            if (profile) {
                // In this schema, it seems employee_id IS the join key to profiles.id
                await db('staff', 'POST', {
                    employee_id: user.id, // Using UUID here
                    name: name,
                    role: 'Teacher',
                    subject: 'All',
                    email: email,
                    password: '123'
                });
            }
        }
    }
    console.log("✅ Fixed staff members.");
}

fixStaff();
