const https = require('https');

const url = 'https://zpkjmfaqwjnkoppvrsrl.supabase.co/rest/v1/subjects';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwa2ptZmFxd2pua29wcHZyc3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDMzMzIsImV4cCI6MjA4MTYxOTMzMn0.LlYAFQfEDZ8ObeK_voI4KLb3OPzLg002Lx28DBNkN3w';

const data = JSON.stringify({
    name: 'Schema Check',
    class: 'TestClass',
    code: 'SCHEMA-TEST'
});

const options = {
    method: 'POST',
    headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
};

const req = https.request(url, options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', responseBody);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
