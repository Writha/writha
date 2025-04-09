const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hrbgebaudtaiadrugfkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYmdlYmF1ZHRhaWFkcnVnZmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzUwNDAsImV4cCI6MjA1OTUxMTA0MH0.kOVbYJl4vJu1srkRUjJ1o5yq3J7jco5ot7mXKl0-5oc';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple log to verify script execution
console.log('Supabase client created!');

// Example fetch users function
async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Fetched users:', data);
  }
}

// Run fetchUsers function
fetchUsers();