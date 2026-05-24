# BSA StepUp

BSA StepUp is a lightweight walking-challenge web app built for the Bangladesh Student Association at Texas State University. It helps event hosts publish a campus walking route, let participants join from their phones, and track live progress during a group walk around San Marcos.

The project is designed for a real student-organization event: participants use the public link, while event staff use a hidden host view to generate routes, monitor temporary profiles, and manage the leaderboard.

## Open The App

Participant app:

```text
https://sabidmahmud01.github.io/BSA-StepUp/
```

Host dashboard:

```text
https://sabidmahmud01.github.io/BSA-StepUp/?host=1
```

## Live App Flow

Participants open the normal site URL:

```text
https://sabidmahmud01.github.io/BSA-StepUp/
```

Hosts open the same site with host mode enabled:

```text
https://sabidmahmud01.github.io/BSA-StepUp/?host=1
```

The host publishes the route first. Participants then create one temporary profile per browser/device, view the route map, update progress, and optionally share live location if their phone allows it.

## Key Features

- Separate participant and hidden host interfaces
- Host route generator for 1, 1.5, and 2 mile walks
- Routes centered around the Music Building at Texas State University
- In-app Leaflet map using OpenStreetMap tiles
- Full-screen route page for easier phone navigation
- Temporary participant profiles, limited to one profile per browser/device
- Host participant tracker with progress, live/manual status, finish controls, and removal controls
- Female and male leaderboards that start empty for real event use
- Manual leaderboard entry tools for hosts
- Supabase sync for shared routes and participant locations
- Local browser fallback when Supabase is unavailable
- Installable app-style manifest for mobile-friendly use
- Netlify-ready static deployment

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- Leaflet.js for maps
- OpenStreetMap map tiles
- OpenStreetMap foot-routing service for route geometry
- Supabase for shared event state and realtime updates
- Netlify for deployment

## Real-World Usage

1. Deploy the app to Netlify.
2. Run `supabase-schema.sql` in Supabase.
3. Add your Supabase URL and public anon key in `config.js`.
4. Open the host URL with `?host=1`.
5. Generate and publish the event route.
6. Share the participant URL or QR code with attendees.
7. Ask participants to create their temporary profile from their own phone.
8. Use the host dashboard to monitor walkers and mark finishers.

## Supabase Setup

Create a Supabase project, open the SQL editor, and run:

```text
supabase-schema.sql
```

Then put your project URL and anon/public key in `config.js`:

```js
window.BSA_SUPABASE_URL = "https://your-project.supabase.co";
window.BSA_SUPABASE_ANON_KEY = "your-anon-or-publishable-key";
```

The app still works without Supabase on a single device, but Supabase is required for a real shared event where the host and participants use different phones or laptops.

## Project Files

- `index.html` - main participant and host app
- `app.js` - route generation, profile logic, progress tracking, leaderboards, and Supabase sync
- `route.html` - full-screen route map page
- `route-map.js` - standalone route map rendering
- `styles.css` - responsive visual design
- `supabase-schema.sql` - database tables, realtime setup, and public event policies
- `netlify.toml` - static Netlify deployment configuration
- `manifest.webmanifest` - installable app metadata

## Notes

This app is meant for a student-organization event environment, not a high-security race system. Participant profiles are temporary, host mode is hidden by URL rather than protected by authentication, and live location depends on each participant granting browser location permission.
