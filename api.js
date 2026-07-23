// api.js — fetch module
const BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
 
export async function fetchEarthquakes(feed = '2.5_day') {
  const res = await fetch(`${BASE}/${feed}.geojson`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.features;   // array of GeoJSON Feature objects
}
// main.js — entry point
import { fetchEarthquakes } from './api.js';
 
document.getElementById('load-btn').addEventListener('click', async () => {
  try {
    const features = await fetchEarthquakes();
    renderTable(features);
  } catch (err) {
    console.error(err);
  }
});
 
function renderTable(features) {
  // your DOM manipulation goes here
}
