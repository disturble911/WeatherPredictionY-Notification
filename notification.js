// Dashboard JS – manages notifications and menu dropdown toggles

// Notification dropdown toggle
const notifBtn = document.getElementById('notifBtn');
const notifDropdown = document.getElementById('notifDropdown');
document.addEventListener('click', function(e) {
  if (notifBtn && notifBtn.contains(e.target)) {
    notifDropdown.classList.toggle('hidden');
  } else if (notifDropdown && !notifDropdown.contains(e.target)) {
    notifDropdown.classList.add('hidden');
  }
});

// Save notification to Supabase
async function saveNotification({ user_id, weather_id, message }) {
  const { error } = await window.supabase.from('notification').insert([
    {
      user_id: user_id,
      weather_id: weather_id,
      message: message,
      date_time_sent: new Date().toISOString()
    }
  ]);
  if (error) {
    console.error('Supabase notification insert error:', error);
  }
}

// Fetch current user ID from Supabase Auth
async function getCurrentUserId() {
  const { data, error } = await window.supabase.auth.getUser();
  if (!data || !data.user) {
    // No user logged in, just return null silently
    return null;
  }
  return data.user.id;
}

// Fetch and show notifications for the logged-in user
async function loadUserNotifications() {
  let notifList = notifDropdown.querySelector('.notif-list');
  if (!notifList) {
    notifList = document.createElement('div');
    notifList.className = 'notif-list max-h-64 overflow-y-auto divide-y';
    notifDropdown.appendChild(notifList);
  }
  notifList.innerHTML = '';

  // Fetch ALL notifications (not just for a user)
  const { data, error } = await window.supabase
    .from('notification')
    .select('message, date_time_sent')
    .order('date_time_sent', { ascending: false })
    .limit(10);

  if (error) {
    notifList.innerHTML = '<div class="p-2 text-red-500">Error loading notifications.</div>';
    console.error('Error fetching notifications:', error);
    return;
  }

  if (!data || data.length === 0) {
    notifList.innerHTML = '<div class="p-2 text-gray-500">No new notifications.</div>';
    return;
  }

  data.forEach(notification => {
    const notifItem = document.createElement('div');
    notifItem.className = 'p-2 border-b border-gray-200';
    notifItem.textContent = `${notification.message} - ${new Date(notification.date_time_sent).toLocaleString()}`;
    notifList.appendChild(notifItem);
  });
}

// Show notification in the dropdown
function notifyUser(message) {
  if (notifDropdown) {
    // Find or create the notification list container
    let notifList = notifDropdown.querySelector('.notif-list');
    if (!notifList) {
      notifList = document.createElement('div');
      notifList.className = 'notif-list';
      notifDropdown.appendChild(notifList);
    }
    // Add the new notification
    const notifItem = document.createElement('div');
    notifItem.className = 'p-2 border-b border-gray-200';
    notifItem.textContent = message;
    notifList.prepend(notifItem);

    // Add badge to notification bell
    const bell = document.getElementById('notifBtn');
    if (bell && !document.getElementById('notif-badge')) {
      const badge = document.createElement('span');
      badge.id = 'notif-badge';
      badge.style.position = 'absolute';
      badge.style.top = '0';
      badge.style.right = '0';
      badge.style.width = '10px';
      badge.style.height = '10px';
      badge.style.background = 'red';
      badge.style.borderRadius = '50%';
      badge.style.display = 'inline-block';
      bell.appendChild(badge);
    }
  }
}

function showNotificationTitleOnly() {
  if (notifDropdown) {
    let notifList = notifDropdown.querySelector('.notif-list');
    if (!notifList) {
      notifList = document.createElement('div');
      notifList.className = 'notif-list';
      notifDropdown.appendChild(notifList);
    }
    notifList.innerHTML = ''; // Remove all notifications
  }
}

// Call this function when the notification bell is clicked
if (typeof notifBtn !== 'undefined' && notifBtn) {
  notifBtn.addEventListener('click', function () {
    loadUserNotifications(); // Load notifications from Supabase

    // Remove badge when dropdown is opened
    const badge = document.getElementById('notif-badge');
    if (badge) badge.remove();
  });
}

// Load notifications on page load for the logged-in user
document.addEventListener('DOMContentLoaded', function() {
  loadUserNotifications();
});

// Replace with your real API key and endpoint
const WEATHER_API_KEY = 'c368e4da9fea46d1af0132931250106'; // <-- Put your real API key here

async function fetchAndNotifyWeather(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=7`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.current && data.location) {
      const condition = data.current.condition.text;
      const message = `Weather update for ${data.location.name}: ${condition}`;
      notifyUser(message);
      saveNotification({ user_id: null, weather_id: null, message });
    } else {
      notifyUser('Weather data not available for this city.');
    }
  } catch (error) {
    notifyUser('Failed to fetch weather data.');
  }
}

// In your weather.js or main script
searchButton.addEventListener('click', function() {
  const city = cityInput.value.trim();
  if (city) {
    fetchAndNotifyWeather(city);
  }
});


