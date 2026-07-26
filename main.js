import { fetchEarthquakes } from './api.js';

// ── DOM references ────────────────────────────────────────────────────────────
const loadBtn      = document.getElementById('load-btn');
const feedSelect   = document.getElementById('feed-select');
const magFilter    = document.getElementById('mag-filter');
const statusMsg    = document.getElementById('status-msg');
const table        = document.getElementById('earthquake-table');
const tableBody    = document.getElementById('table-body');
const tableHead    = document.querySelector('#earthquake-table thead tr');

// ── State ─────────────────────────────────────────────────────────────────────
let allFeatures = []; // holds the raw data so filters re-render without re-fetching
let sortState = {
    column: 'time',     //deafult sort: most recent first
    direction: 'desc'   // 'asc' or 'desc'
};

// ── Event listeners ───────────────────────────────────────────────────────────
loadBtn.addEventListener('click', loadData);
magFilter.addEventListener('input', renderTable); // re-filter on slider change

// Column header click -> sort
tableHead.addEventListener('click', e => {
  const th = e.target.closest('th[data-col]');
  if (!th) return;

  const col = th.dataset.col;

  if (sortState.column === col) {
    // Same column — flip direction
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // New column — default to ascending, except time defaults to descending
    sortState.column = col;
    sortState.direction = col === 'time' ? 'desc' : 'asc';
  }

  renderTable();
});

// ── Load data ─────────────────────────────────────────────────────────────────
async function loadData() {
  const feed = feedSelect.value;

  setStatus('Loading...', false);
  loadBtn.disabled = true;
  table.hidden = true;
  tableBody.innerHTML = '';

  try {
    allFeatures = await fetchEarthquakes(feed);
    setStatus(`Loaded ${allFeatures.length} earthquakes. Showing results below.`, false);
    renderTable();
  } catch (err) {
    setStatus(`Error: ${err.message}`, true);
    console.error(err);
  } finally {
    loadBtn.disabled = false;
  }
}

// ── Sort ──────────────────────────────────────────────────────────────────────
function sortFeatures(features) {
  const { column, direction } = sortState;
  const dir = direction === 'asc' ? 1 : -1;

  return [...features].sort((a, b) => {
    let aVal, bVal;

    switch (column) {
      case 'place':
        aVal = a.properties.place ?? '';
        bVal = b.properties.place ?? '';
        return dir * aVal.localeCompare(bVal);

      case 'mag':
        aVal = a.properties.mag ?? -Infinity;
        bVal = b.properties.mag ?? -Infinity;
        break;

      case 'depth':
        aVal = a.geometry.coordinates[2] ?? -Infinity;
        bVal = b.geometry.coordinates[2] ?? -Infinity;
        break;

      case 'time':
        aVal = a.properties.time ?? 0;
        bVal = b.properties.time ?? 0;
        break;

      default:
        return 0;
    }

    return dir * (aVal - bVal);
  });
}

// ── Filter + render ───────────────────────────────────────────────────────────
function renderTable() {
  const minMag = parseFloat(magFilter.value) || 0;

  const filtered = allFeatures.filter(f => {
    const mag = f.properties.mag;
    return mag !== null && mag >= minMag;
  });

  if (filtered.length === 0) {
    setStatus('No earthquakes match the current filter.', false);
    table.hidden = true;
    return;
  }

  const sorted = sortFeatures(filtered);

  // Update header arrows
  tableHead.querySelectorAll('th[data-col]').forEach(th => {
    const col = th.dataset.col;
    const arrow = th.querySelector('.sort-arrow');
    if (col === sortState.column) {
      arrow.textContent = sortState.direction === 'asc' ? ' ▲' : ' ▼';
      th.classList.add('active-sort');
    } else {
      arrow.textContent = ' ⇅';
      th.classList.remove('active-sort');
    }
  });

  tableBody.innerHTML = ''; // clear previous rows

  sorted.forEach(feature => {
    const p = feature.properties;
    const depth = feature.geometry.coordinates[2]; // third coordinate is depth
    const time = new Date(p.time).toLocaleString(); // convert Unix ms to readable date

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.place ?? 'Unknown'}</td>
      <td>${p.mag?.toFixed(1) ?? 'N/A'}</td>
      <td>${depth?.toFixed(1) ?? 'N/A'}</td>
      <td>${time}</td>
      <td><a href="${p.url}" target="_blank" rel="noopener">View</a></td>
    `;

    // Color-code rows by magnitude
    if (p.mag >= 5) row.classList.add('mag-high');
    else if (p.mag >= 3) row.classList.add('mag-medium');

    tableBody.appendChild(row);
  });

  setStatus(`Showing ${filtered.length} of ${allFeatures.length} earthquakes.`, false);
  table.hidden = false;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function setStatus(msg, isError) {
  statusMsg.textContent = msg;
  statusMsg.style.color = isError ? '#c0392b' : '#555';
}