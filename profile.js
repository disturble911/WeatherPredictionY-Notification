// Get user info from localStorage
const localUser = JSON.parse(localStorage.getItem('user_session'));

// Show basic user info immediately
document.getElementById('username').textContent = localUser.username ? `Username: ${localUser.username}` : 'Username: ';
document.getElementById('email').textContent = localUser.email ? `Email: ${localUser.email}` : 'Email: ';

// Fetch latest user info
async function loadUserProfile() {
  const { data, error } = await supabase
    .from('users')
    .select('username, email')
    .eq('id', localUser.id)
    .single();

  if (error) {
    console.error('Error loading user profile:', error.message);
    return;
  }

  document.getElementById('username').textContent = data.username ? `Username: ${data.username}` : 'Username: ';
  document.getElementById('email').textContent = data.email ? `Email: ${data.email}` : 'Email: ';

  localStorage.setItem('user_session', JSON.stringify({ ...localUser, ...data }));
}

// Dashboard redirect
function goToDashboard() {
  window.location.href = 'dashboard.html';
}
window.goToDashboard = goToDashboard;

// Load profile on page load
loadUserProfile();
