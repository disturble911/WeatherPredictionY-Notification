// Show city history from localStorage and add clear history button

document.addEventListener('DOMContentLoaded', function() {
  const historyDiv = document.getElementById('historyList');
  const mainContent = historyDiv.parentElement;

  // Create and append the Clear History button AFTER the history list
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clearHistoryBtn';
  clearBtn.textContent = 'Clear History';
  clearBtn.className = 'bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition self-end mt-4';
  mainContent.appendChild(clearBtn);

  // Fetch history from Supabase
  async function fetchHistory() {
    const { data, error } = await window.supabase
      .from('history')
      .select('*')
      .order('date_time', { ascending: false });
    if (error) {
      historyDiv.innerHTML = '<p class="text-red-600">Failed to load history.</p>';
      console.error(error);
      return [];
    }
    return data;
  }

  // Render history from Supabase
  async function renderHistory() {
    const history = await fetchHistory();
    if (!history || history.length === 0) {
      historyDiv.innerHTML = '<p class="text-gray-700">No history records found.</p>';
    } else {
      historyDiv.innerHTML = '<ul class="list-disc pl-5">' +
        history.map(item => `<li class="text-blue-900 font-semibold mb-2">${item.message} <span class="text-xs text-gray-500">(${new Date(item.date_time).toLocaleString()})</span></li>`).join('') +
        '</ul>';
    }
  }

  // Clear history in Supabase
  clearBtn.onclick = async function() {
    const { error } = await window.supabase.from('history').delete().not('history_id', 'is', null);
    if (error) {
      alert('Failed to clear history!\n' + JSON.stringify(error, null, 2));
      console.error(error);
      return;
    }
    renderHistory();
  };

  renderHistory();

  // Show map for default city (optional, keep if needed)
  const defaultCity = localStorage.getItem('defaultCity') || 'Manila';
  if (window.updateMapByCity) {
      window.updateMapByCity(defaultCity);
  }
});

