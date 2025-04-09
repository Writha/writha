import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrbgebaudtaiadrugfkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYmdlYmF1ZHRhaWFkcnVnZmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzUwNDAsImV4cCI6MjA1OTUxMTA0MH0.kOVbYJl4vJu1srkRUjJ1o5yq3J7jco5ot7mXKl0-5oc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUser() {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { full_name: 'John Doe', email: 'john@example.com' }
    ]);

  if (error) {
    console.error('Error adding user:', error);
  } else {
    console.log('User added successfully:', data);
  }
}

addUser();