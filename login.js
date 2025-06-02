// Connect to Supabase
const SUPABASE_URL = 'https://nsosynftljmzagnvyiaq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb3N5bmZ0bGptemFnbnZ5aWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTM2NDUsImV4cCI6MjA2MzU4OTY0NX0.Jth_lbwi3o49OQqhCOMWLwK_ig-JzZik-YEP0tRMcK0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// When the login form is submitted
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Don't reload page
  // Get email and password from form
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Check if user exists in 'users' table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  // If login fails, show alert
  if (error || !data) {
    alert('Login failed: Invalid email or password.');
  } else {
    // Save user info and go to dashboard
    localStorage.setItem('user_session', JSON.stringify(data));
    window.location.href = 'dashboard.html';
  }
});

