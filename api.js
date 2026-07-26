const BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// Feed options: all_hour, all_day, all_week
// Magnitude filters are handled client-side after fetch
export async function fetchEarthquakes(feed = 'all_day') {
  const url = `${BASE}/${feed}.geojson`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`USGS API error: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.features; // array of GeoJSON Feature objects
}

// Each feature looks like:
// {
//   type: 'Feature',
//   properties: { mag, place, time, url, depth },
//   geometry: { type: 'Point', coordinates: [lon, lat, depth] }
// }

