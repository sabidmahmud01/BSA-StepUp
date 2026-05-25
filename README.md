# BSA StepUp

BSA StepUp is a walking-challenge web app for the Bangladesh Student Association at Texas State University. It lets event staff publish a campus walking route and lets participants join from their phones, view the route, track progress, and appear on the host dashboard.

## Open The App

Click or copy this link for the normal participant app:

```text
https://sabidmahmud01.github.io/BSA-StepUp/
```

Click or copy this link for the host dashboard:

```text
https://sabidmahmud01.github.io/BSA-StepUp/?host=1
```

If you are on the GitHub page, you can also look at the right side of the page under **About** and click the website link if it has been added there.

## How Participants Use It

1. Open this link on your phone:

```text
https://sabidmahmud01.github.io/BSA-StepUp/
```

2. Wait for the host to publish the route.
3. Under **Temporary profile**, type your name.
4. Choose your category.
5. Tap **Save profile**.
6. After saving, your profile is locked for that browser so one phone creates one participant profile.
7. Use the **Miles passed** slider to update your progress manually.
8. Tap **Start live location** if you want to share live location with the host.
9. Tap **Open full route map** if you want a larger map view while walking.

## How Hosts Use It

1. Open this link on a laptop, tablet, or phone:

```text
https://sabidmahmud01.github.io/BSA-StepUp/?host=1
```

2. In **Choose today's distance**, select **1 mile**, **1.5 miles**, or **2 miles**.
3. Click **Generate and publish today's track**.
4. The route appears in the host dashboard and becomes visible to participants.
5. Use the **Participants** list to see who has joined.
6. Click **Mark finished** when a participant completes the walk.
7. Click **Remove** if a test profile or incorrect entry should be deleted.
8. Use **Add a Walker** if you need to manually add someone to the leaderboard.

## What To Share At The Event

Share only the participant link with attendees:

```text
https://sabidmahmud01.github.io/BSA-StepUp/
```

Keep the host link for event staff:

```text
https://sabidmahmud01.github.io/BSA-StepUp/?host=1
```

A simple event-day setup is:

1. Put the participant link into a QR code.
2. Show or print the QR code at check-in.
3. Open the host dashboard on the organizer's device.
4. Publish the route before participants begin walking.
5. Ask participants to save their profile once from their own phone.

## Important Notes

- The participant profile is temporary and tied to the browser/device.
- Once a profile is saved, that browser cannot change it from the participant view.
- The leaderboard starts empty so it is ready for a real event.
- Live location only works if the participant allows location permission in their browser.
- Host mode is hidden through the special `?host=1` link, but it is not password protected.

## Key Features

- Separate participant and host views
- Route generator for 1, 1.5, and 2 mile walks
- Routes centered around the Music Building at Texas State University
- In-app map and full-screen route map
- One temporary profile per browser/device
- Host participant tracker with finish and remove controls
- Empty female and male leaderboards for real event use
- Manual leaderboard entry tools for hosts
- Optional live location sharing
- Mobile-friendly static web app

## Technical Setup

The app is built with HTML, CSS, vanilla JavaScript, Leaflet, OpenStreetMap, Supabase, and GitHub Pages/Netlify-style static hosting.

For a real shared event across multiple devices, Supabase should be connected.

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL from `supabase-schema.sql`.
4. Open `config.js`.
5. Add your Supabase project URL and public anon key:

```js
window.BSA_SUPABASE_URL = "https://your-project.supabase.co";
window.BSA_SUPABASE_ANON_KEY = "your-anon-or-publishable-key";
```

Without Supabase, the app can still run in one browser, but the host and participants will not share live event data across separate devices.

## Project Files

- `index.html` - main participant and host app
- `app.js` - routes, profiles, progress, leaderboard, and Supabase sync
- `route.html` - full-screen route map page
- `route-map.js` - full-screen map logic
- `styles.css` - responsive app styling
- `supabase-schema.sql` - Supabase tables and realtime setup
- `netlify.toml` - static deployment configuration
- `manifest.webmanifest` - installable app metadata
