// Handles showing/hiding the menu dropdown

const menuBtn = document.getElementById('menuBtn');         // The menu (hamburger) button
const menuDropdown = document.getElementById('menuDropdown'); // The dropdown menu

// Listen for clicks anywhere on the page
document.addEventListener('click', function(e) {
  if (menuBtn && menuBtn.contains(e.target)) {
    // If menu button is clicked, toggle dropdown
    menuDropdown.classList.toggle('hidden');
  } else if (menuDropdown && !menuDropdown.contains(e.target)) {
    // If clicked outside dropdown, hide it
    menuDropdown.classList.add('hidden');
  }
});