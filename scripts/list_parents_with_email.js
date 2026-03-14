
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllParents() {
    console.log("Listing Parent Accounts...");
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
        console.error("Auth Error:", authError);
        return;
    }

    const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'parent');

    if (profError) {
        console.error("Profile Error:", profError);
        return;
    }

    profiles.forEach(p => {
        const user = users.find(u => u.id === p.id);
        console.log(`Email: ${user ? user.email : 'N/A'} | Name: ${p.full_name} | ID: ${p.id}`);
    });
}

listAllParents();
