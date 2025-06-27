const apiBaseUrl = 'https://5k58civ7m0.execute-api.us-east-1.amazonaws.com/workout';
const setsInput = document.getElementById('sets');
const repsInput = document.getElementById('reps');

// Submit workout
document.getElementById('workout-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const sets = parseInt(setsInput.value);
  const reps = parseInt(repsInput.value);

  // ✅ Validate input
  if (sets < 1 || reps < 1) {
    document.getElementById('submit-response').textContent = '❌ Sets and reps must be at least 1.';
    return;
  }

  const data = {
    user_id: document.getElementById('user_id').value,
    exercise: document.getElementById('exercise').value,
    sets: sets,
    reps: reps,
    notes: document.getElementById('notes').value,
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      document.getElementById('submit-response').textContent = '✅ Workout logged!';
      document.getElementById('workout-form').reset();
    } else {
      document.getElementById('submit-response').textContent = '❌ Error: ' + (result.error || 'Failed to log');
    }
  } catch (err) {
    document.getElementById('submit-response').textContent = '❌ Network error: ' + err.message;
  }
});

// View workout history
async function fetchWorkouts() {
  console.log("🔔 fetchWorkouts() called");
  const userId = document.getElementById('user_id').value;
  const results = document.getElementById('workout-results');
  const dateSelect = document.getElementById('date-select');
  const dateSelectContainer = document.getElementById('date-select-container');

  results.innerHTML = '';
  dateSelect.innerHTML = '<option value="">-- Select a date --</option>';
  dateSelectContainer.style.display = 'none'; // Hide by default

  if (!userId) {
    results.innerHTML = '<p style="color:red;">Please enter your User ID above first.</p>';
    return;
  }

  try {
    const res = await fetch(`${apiBaseUrl}?user_id=${encodeURIComponent(userId)}`);
    const data = await res.json();

    console.log("🔔 API status:", res.status);
    console.log("🔔 Response JSON:", data);

    if (res.ok && data.workouts.length > 0) {
      // Show dropdown
      console.log("Showing date dropdown...");
      dateSelectContainer.style.display = 'block';

      data.workouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const uniqueDates = [...new Set(data.workouts.map(w => new Date(w.timestamp).toLocaleDateString()))];

      uniqueDates.forEach(date => {
        const opt = document.createElement('option');
        opt.value = date;
        opt.textContent = date;
        dateSelect.appendChild(opt);
      });

      window.cachedWorkouts = data.workouts;

      if (uniqueDates.length > 0) {
        dateSelect.value = uniqueDates[0];
        displayWorkoutsForDate(uniqueDates[0]);
      }
    } else {
      results.innerHTML = '<p>No workouts found.</p>';
    }
  } catch (err) {
    results.innerHTML = `<p style="color:red;">Error fetching workouts: ${err.message}</p>`;
  }
}

function displayWorkoutsForDate(date) {
  const results = document.getElementById('workout-results');
  results.innerHTML = '';

  const workouts = window.cachedWorkouts || [];
  const filtered = workouts.filter(w => new Date(w.timestamp).toLocaleDateString() === date);

  if (filtered.length === 0) {
    results.innerHTML = '<p>No workouts found for that date.</p>';
    return;
  }

  filtered.forEach(w => {
    const div = document.createElement('div');
    div.className = 'workout';
    div.innerHTML = `
      <strong>Exercise:</strong> ${w.exercise}<br/>
      <strong>Sets:</strong> ${w.sets}, <strong>Reps:</strong> ${w.reps}<br/>
      ${w.notes ? `<strong>Notes:</strong> ${w.notes}<br/>` : ''}
      <strong>Timestamp:</strong> ${new Date(w.timestamp).toLocaleString()}
    `;
    results.appendChild(div);
  });
}

document.getElementById('date-select').addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  if (selectedDate) {
    displayWorkoutsForDate(selectedDate);
  }
})
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('view-btn').addEventListener('click', fetchWorkouts);
});