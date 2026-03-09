const https = require('https');

const supabaseUrl = 'zpkjmfaqwjnkoppvrsrl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA0MzMzMiwiZXhwIjoyMDgxNjE5MzMyfQ.o7hfaphdAeuNR-cXvSZ_XQVk1jV8hSBOxSMEb7Gds9s';

const options = {
    hostname: supabaseUrl,
    path: '/rest/v1/subjects?select=name,class&limit=30',
    method: 'GET',
    headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const subjects = JSON.parse(data);
            console.log('=== SUBJECTS TABLE (class column values) ===');
            const classSet = new Set();
            subjects.forEach(s => classSet.add(s.class));
            console.log('Unique class values in DB:', [...classSet]);
            console.log('\nSample subjects:');
            subjects.slice(0, 10).forEach(s => console.log(' -', s.name, '|', s.class));
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});
req.on('error', console.error);
req.end();
