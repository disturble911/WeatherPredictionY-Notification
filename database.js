// --- Supabase Setup ---
// Use these credentials to connect to your Supabase project
const SUPABASE_URL = 'https://nsosynftljmzagnvyiaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb3N5bmZ0bGptemFnbnZ5aWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTM2NDUsImV4cCI6MjA2MzU4OTY0NX0.Jth_lbwi3o49OQqhCOMWLwK_ig-JzZik-YEP0tRMcK0';
// Make Supabase client available everywhere
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Test Connection ---
// Try to fetch all users from 'Users' table to check if Supabase works
// Uncomment testConnection() to test your connection
async function testConnection() {
  const { data, error } = await supabase.from('Users').select('*');
  if (error) console.error('Supabase connection error:', error.message);
  else console.log('Supabase connection successful:', data);
}
// testConnection(); // Uncomment to test

// --- User Signup ---
// Add a new user to 'users' table
async function signUp(username, email, password) {
  const { data, error } = await supabase.from('users').insert([{ username, email, password }]);
  if (error) {
    console.error('Error signing up:', error.message);
    return null;
  }
  console.log('Sign up successful:', data);
  return data;
}

// --- Save Weather Data ---
// Save weather info for a city to 'weather' table
async function saveWeatherToSupabase(city, weatherData) {
  const { data, error } = await supabase.from('weather').insert([{
    city: city,
    date: new Date().toISOString(),
    weather_json: JSON.stringify(weatherData)
  }]);
  if (error) {
    console.error('Error saving weather:', error.message);
    return null;
  }
  console.log('Weather saved:', data);
  return data;
}

// --- Add History Message ---
// Add a message to 'history' table (for logs, actions, etc.)
async function addHistoryMessage(message) {
  await window.supabase.from('history').insert([{
    message: message,
    date_time: new Date().toISOString()
  }]);
}