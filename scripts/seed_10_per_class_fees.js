const { chromium } = require('@playwright/test');

(async () => {
    let browser;
    try {
        console.log("🚀 Launching Specialized Seeding Engine (10 students per class + fees)...");
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        const result = await page.evaluate(async () => {
            const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';
            const CLASSES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
            const STUDENTS_PER_CLASS = 10;

            async function api(path, method = 'GET', body = null) {
                const url = `${supabaseUrl}/rest/v1/${path}`;
                const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
                const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
                if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);
                return await res.json();
            }

            async function authApi(path, method = 'POST', body = null) {
                const url = `${supabaseUrl}/auth/v1/admin/${path}`;
                const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
                const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
                if (!res.ok) throw new Error(`Auth Admin Error ${res.status}: ${await res.text()}`);
                return await res.json();
            }

            const results = [];
            
            // 1. CLEANUP: Delete all @pucho.test students (to start fresh)
            console.log("🧹 Cleaning up old test data...");
            const authUsersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, {
                headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
            });
            const { users } = await authUsersRes.json();
            const toDelete = users.filter(u => u.email && u.email.includes('@pucho.test'));
            
            for (const u of toDelete) {
                await fetch(`${supabaseUrl}/auth/v1/admin/users/${u.id}`, {
                    method: 'DELETE',
                    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
                });
            }
            results.push(`Cleanup: Deleted ${toDelete.length} old test student users.`);

            // 2. Ensure Classes & Sections
            const existingClasses = await api('classes?select=id,name');
            const classMap = {}; existingClasses.forEach(c => classMap[c.name] = c.id);
            for (const className of CLASSES) {
                if (!classMap[className]) {
                    const created = await api('classes', 'POST', { name: className });
                    classMap[className] = created[0].id;
                }
            }
            
            const existingSections = await api('sections?select=id,name,class_id');
            const sectionMap = {};
            existingSections.forEach(s => {
                const clsName = Object.keys(classMap).find(name => classMap[name] === s.class_id);
                if (clsName) sectionMap[`${clsName}-A`] = s.id;
            });

            for (const className of CLASSES) {
                const key = `${className}-A`;
                if (!sectionMap[key]) {
                    const created = await api('sections', 'POST', { name: 'A', class_id: classMap[className] });
                    sectionMap[key] = created[0].id;
                }
            }
            
            // 3. SEEDING
            const firstNames = ['Aarav', 'Ishani', 'Aryan', 'Anaya', 'Kabir', 'Diya', 'Rohan', 'Sana', 'Reyansh', 'Meera', 'Vihaan', 'Sara', 'Ivaan', 'Kiara', 'Arjun', 'Zoya', 'Advait', 'Sia', 'Vivaan', 'Tara'];
            const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Khan', 'Das'];
            
            for (const className of CLASSES) {
                const sectionId = sectionMap[`${className}-A`];
                console.log(`Seeding class: ${className}`);
                
                for (let i = 0; i < STUDENTS_PER_CLASS; i++) {
                    const rollNo = i + 1;
                    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
                    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
                    const studentName = `${fName} ${lName}`;
                    const email = `std_${className.toLowerCase().replace(/[^a-z0-9]/g, '')}_a_${rollNo}_${Math.random().toString(36).substring(7)}@pucho.test`;
                    
                    try {
                        // Create User
                        const userRes = await authApi('users', 'POST', { email, password: 'Password123!', email_confirm: true, user_metadata: { role: 'student' } });
                        const userUuid = userRes.id;
                        
                        // Create Profile
                        await api('profiles', 'POST', { id: userUuid, full_name: studentName, role: 'student', phone: '9876' + Math.floor(100000 + Math.random() * 900000) });
                        
                        // Create Student
                        await api('students', 'POST', {
                            id: userUuid,
                            section_id: sectionId,
                            admission_no: `ADM-${className.substring(0,2).toUpperCase()}-A-${rollNo}-${Math.random().toString(36).substring(2,5)}`.toUpperCase(),
                            roll_no: rollNo,
                            status: 'Active',
                            gender: i % 2 === 0 ? 'Male' : 'Female',
                            dob: '2015-05-15'
                        });

                        // 50/50 Fee Status
                        const isPaid = i < 5; // First 5 are Paid, rest 5 are Pending
                        
                        const uuidv4 = () => {
                            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });
                        };
                        await api('fees_payments', 'POST', {
                            id: uuidv4(),
                            student_id: userUuid,
                            amount_paid: 5000,
                            status: isPaid ? 'Paid' : 'Pending',
                            payment_date: isPaid ? new Date().toISOString() : null,
                            payment_method: isPaid ? 'Cash' : null
                        });

                        results.push(`Created: ${studentName} (${className}-A) | Fee: ${isPaid ? 'PAID' : 'PENDING'}`);
                    } catch (e) {
                        results.push(`Error creating student ${studentName}: ${e.message}`);
                    }
                }
            }
            return results;
        });
        
        console.log("Seeding Report Snapshot:");
        result.slice(0, 15).forEach(r => console.log(" - " + r));
        console.log(`... and ${result.length - 15} more results.`);
        console.log("✅ Seeding Process Finished.");
    } catch (err) {
        console.error("Critical Seeding Error:", err);
    } finally {
        if (browser) await browser.close();
    }
})();
