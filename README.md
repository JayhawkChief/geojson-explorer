# GeoJSON Explorer

A vanilla JavaScript app that fetches live earthquake data from the USGS 
Earthquake API and displays it in a filterable table. No frameworks — just 
modern ES6+ JavaScript, async/await, and ES modules.

Built as part of a front-end ramp focused on GIS and spatial data.

![screenshot](screenshot.png)

# Installation

Install Node.js (if not already installed)

Download from https://nodejs.org - choose the LTS version
Verify install:

```bash
node --version # should print v20.x or higher
npm --version
```

# Create the project folder

```bash
mkdir geojson-explorer
cd geojson-explorer
npm init -y
npm install --save-dev vite
```

# Create the files

```bash
touch index.html main.js api.js
```

# Add a start script to package.json

```bash
// In package.json, under "scripts":
"start": "vite"
```

# Run the dev server

```bash
npm start
# Open http://localhost:5173 in your browser
```

# Features

- Fetches live GeoJSON from the USGS Earthquake Hazards Program API (no key required)
- Filter by time range: past hour, past 24 hours, past 7 days
- Filter by minimum magnitude (re-filters client-side without re-fetching)
- Color-coded rows: yellow for M3.0+, red for M5.0+
- Clickable detail links to each event's USGS page
- Loading state, empty state, and error handling

# Tech stack used

- Vanilla JS (ES2020) - no frameworks
- ES Modules (import/export)
- Vite (local dev server)
- Fetch API with async/await
- HTML5 / CSS3

# Project Strucutre

geojson-explorer/
- index.html #markup and table structure
- api.js #USGS fetch logic, separated from UI
- main.js #DOM references, event listeners, render and filter logic
- style.css #layout and magnitude color coding

# Why I built this

I'm a GIS and back-end developer ramping into front-end development. I wanted 
my first JavaScript project to use data I already understand — spatial data in 
GeoJSON format — rather than a generic todo app. This project rehearses the 
async patterns and module structure I'll use throughout the rest of the stack.


# What I learned

The most interesting part was the state management decision: storing the full 
API response in memory and re-filtering it locally on every slider change, 
rather than re-fetching on each filter. This keeps the UI snappy and reduces 
unnecessary API calls — the same pattern Angular uses with reactive forms and 
RxJS operators like `distinctUntilChanged`.

The GeoJSON coordinate array `[longitude, latitude, depth]` also caught me 
once — depth is the third element, not a named property, which is easy to miss 
if you're used to working with GeoJSON in a GIS context where depth is usually 
explicit.
