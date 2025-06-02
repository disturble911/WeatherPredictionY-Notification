// Connect to Supabase
const SUPABASE_URL = 'https://nsosynftljmzagnvyiaq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb3N5bmZ0bGptemFnbnZ5aWFxIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDgwMTM2NDUsImV4cCI6MjA2MzU4OTY0NX0.Jth_lbwi3o49OQqhCOMWLwK_ig-JzZik-YEP0tRMcK0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Add user to database
async function registerUser(username, email, password) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, email, password }]);
  return { data, error };
}

// Handle signup form submit
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Check if fields are filled
  if (!username || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Try to register user
  const { data, error } = await registerUser(username, email, password);
  console.log('Supabase insert:', { data, error });

  if (error) {
    alert('Sign up failed: ' + error.message);
  } else {
    alert('Sign up successful!');
    window.location.href = 'login.html';
  }
});