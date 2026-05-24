# BSA StepUp

A lightweight event app for the Bangladesh Student Association walking challenge around Texas State University and San Marcos, Texas.

Open `index.html` in a browser to try the app. The prototype includes:

- Host and participant interfaces
- Today's track generator from the Music Building
- A published route view that participants can refresh
- Leaflet.js map rendering with OpenStreetMap tiles
- OpenStreetMap foot-routing geometry inside the app map
- Full-screen participant route map with a red route line and checkpoint markers
- Temporary participant profiles
- Participant position markers on the map
- Host participant tracker with finish controls
- Supabase sync for shared tracks and live participant locations
- Participant progress tracking for miles passed and miles left
- Removable leaderboard entries
- 1, 1.5, and 2 mile distance options
- Host display for the BSA secretary
- Separate female and male leaderboards
- Amazon gift card prize messaging
- Refreshment and marketing highlight sections
- A quick form for adding walkers to the leaderboard preview
- Basic app manifest for installable app-style deployment

The normal app opens directly to the participant interface. The host dashboard is hidden from regular users; open `index.html?host=1` to access host mode.

After deployment, share the normal site URL with participants and keep the host URL for event staff:

```text
https://your-site.netlify.app
https://your-site.netlify.app/?host=1
```

The in-app Leaflet map is the main route display. The external map link opens a full-screen route map because OpenStreetMap's public website is unreliable for showing a closed-loop multi-stop route that starts and ends at the Music Building.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase-schema.sql`.
3. In Supabase, copy your project URL and anon/public key.
4. Put them in `config.js`:

```js
window.BSA_SUPABASE_URL = "https://your-project.supabase.co";
window.BSA_SUPABASE_ANON_KEY = "your-anon-or-publishable-key";
```

The app still falls back to browser storage if Supabase is not configured.
