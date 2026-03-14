
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkParents() {
    console.log("--- Parent Profiles ---");
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'parent');
    
    if (pError) {
        console.error("Error fetching profiles:", pError);
        return;
    }

    profiles.forEach(p => {
        console.log(`Email: ${p.email} | Name: ${p.full_name} | ID: ${p.id}`);
    });

    console.log("\n--- Student Links ---");
    const { data: students, error: sError } = await supabase
        .from('students')
        .select('id, name, guardian_name, parent_email, class, division');
    
    if (sError) {
        console.error("Error fetching students:", sError);
        return;
    }

    students.forEach(s => {
        if (s.parent_email || s.guardian_name) {
            console.log(`Student: ${s.name} (${s.class}-${s.division}) | Guardian: ${s.guardian_name} | Parent Email: ${s.parent_email}`);
        }
    });
}

checkParents();
