const storageKeys = {
  track: "bsa-stepup-todays-track",
  boards: "bsa-stepup-leaderboards",
  participants: "bsa-stepup-participants",
  currentParticipant: "bsa-stepup-current-participant",
  deviceParticipant: "bsa-stepup-device-participant"
};
const supabaseClient = createSupabaseClient();

const startFinish = { lat: 29.890434, lng: -97.941117 };

const routeOptions = {
  1: [
    {
      id: "music-building-starter-loop",
      name: "Music Building Starter Loop",
      description: "A gentle one-mile campus loop for first-timers and casual walkers.",
      stops: ["Start and finish at the Music Building", "Pass the Quad area", "Loop by LBJ Student Center", "Return through the campus core"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.8904, lng: -97.9431, label: "Quad area" },
        { lat: 29.8893, lng: -97.9448, label: "LBJ Student Center" },
        { lat: 29.8885, lng: -97.9436, label: "Campus walkway" },
        { lat: 29.8894, lng: -97.9418, label: "Music Building return" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    },
    {
      id: "quad-social-loop",
      name: "Quad Social Loop",
      description: "A short social route that keeps everyone close to central campus.",
      stops: ["Meet at the Music Building", "Walk through the Quad area", "Pass Alkek Library", "Finish back by the Music Building"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.8905, lng: -97.9427, label: "Quad area" },
        { lat: 29.8894, lng: -97.9443, label: "LBJ walkway" },
        { lat: 29.8882, lng: -97.9438, label: "Alkek Library" },
        { lat: 29.8889, lng: -97.9418, label: "Campus return" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    }
  ],
  1.5: [
    {
      id: "sewell-park-social-route",
      name: "Sewell Park Social Route",
      description: "A comfortable 1.5-mile route that reaches the river area without becoming too demanding.",
      stops: ["Start at the Music Building", "Walk toward Alkek Library", "Reach Sewell Park", "Return through central campus"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.8893, lng: -97.9439, label: "Alkek Library" },
        { lat: 29.8874, lng: -97.9428, label: "Campus descent" },
        { lat: 29.8864, lng: -97.9401, label: "Sewell Park" },
        { lat: 29.8879, lng: -97.9394, label: "River path" },
        { lat: 29.8896, lng: -97.9404, label: "Campus return" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    },
    {
      id: "lbj-sewell-loop",
      name: "LBJ and Sewell Loop",
      description: "A moderate 1.5-mile loop for a group that wants more movement while staying near Texas State.",
      stops: ["Start at the Music Building", "Pass LBJ Student Center", "Loop toward Sewell Park", "Return by the Quad area"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.8892, lng: -97.9447, label: "LBJ Student Center" },
        { lat: 29.8873, lng: -97.9438, label: "Alkek Library" },
        { lat: 29.8858, lng: -97.9412, label: "Sewell approach" },
        { lat: 29.8875, lng: -97.9399, label: "River return" },
        { lat: 29.8902, lng: -97.9417, label: "Quad area" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    }
  ],
  2: [
    {
      id: "stepup-campus-challenge",
      name: "StepUp Campus Challenge",
      description: "A longer two-mile route for an active group that wants the full BSA StepUp experience without overdoing it.",
      stops: ["Begin at the Music Building", "Pass LBJ Student Center", "Reach Sewell Park", "Extend toward the river edge", "Return through campus"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.889, lng: -97.9448, label: "LBJ Student Center" },
        { lat: 29.8871, lng: -97.9438, label: "Alkek Library" },
        { lat: 29.8855, lng: -97.9412, label: "Sewell Park" },
        { lat: 29.8842, lng: -97.9392, label: "River edge" },
        { lat: 29.8867, lng: -97.9387, label: "River return" },
        { lat: 29.8894, lng: -97.9401, label: "Campus core" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    },
    {
      id: "bobcat-social-challenge",
      name: "Bobcat Social Challenge",
      description: "A two-mile challenge route for a more energetic day, still centered around Texas State.",
      stops: ["Start from the Music Building", "Move through the Quad area", "Pass Sewell Park", "Take a longer river-side return", "Finish at the Music Building"],
      points: [
        { ...startFinish, label: "Music Building start" },
        { lat: 29.8904, lng: -97.9431, label: "Quad area" },
        { lat: 29.8883, lng: -97.9446, label: "LBJ walkway" },
        { lat: 29.8864, lng: -97.9426, label: "Alkek side" },
        { lat: 29.8851, lng: -97.9402, label: "Sewell Park" },
        { lat: 29.8867, lng: -97.9385, label: "River path" },
        { lat: 29.8898, lng: -97.9403, label: "Campus return" },
        { ...startFinish, label: "Music Building start/finish" }
      ]
    }
  ]
};

const defaultBoards = {
  female: [],
  male: []
};
const seedLeaderboardNames = new Set(["Nadia R.", "Tanzila A.", "Maliha C.", "Rafi H.", "Sakib M.", "Arman K."]);

const elements = {
  hostView: document.querySelector("#hostView"),
  participantView: document.querySelector("#participantView"),
  signupSection: document.querySelector("#signupSection"),
  leaveHost: document.querySelector("#leaveHost"),
  generateButton: document.querySelector("#generateTrack"),
  publishMessage: document.querySelector("#publishMessage"),
  refreshParticipant: document.querySelector("#refreshParticipant"),
  participantStatus: document.querySelector("#participantStatus"),
  hostParticipantList: document.querySelector("#hostParticipantList"),
  profileForm: document.querySelector("#profileForm"),
  profileSummary: document.querySelector("#profileSummary"),
  profileName: document.querySelector("#profileName"),
  profileCategory: document.querySelector("#profileCategory"),
  profileStatus: document.querySelector("#profileStatus"),
  milesPassed: document.querySelector("#milesPassed"),
  milesPassedLabel: document.querySelector("#milesPassedLabel"),
  milesLeft: document.querySelector("#milesLeft"),
  progressPercent: document.querySelector("#progressPercent"),
  useLocation: document.querySelector("#useLocation"),
  trackerStatus: document.querySelector("#trackerStatus"),
  walkerForm: document.querySelector("#walkerForm"),
  walkerName: document.querySelector("#walkerName"),
  walkerCategory: document.querySelector("#walkerCategory"),
  walkerMiles: document.querySelector("#walkerMiles")
};

let boards = loadBoards();
let participants = loadParticipants();
let currentParticipantId = localStorage.getItem(storageKeys.currentParticipant)
  || localStorage.getItem(storageKeys.deviceParticipant)
  || "";
let liveLocationWatchId = null;
let isHostMode = new URLSearchParams(window.location.search).get("host") === "1" || window.location.hash === "#host";
let mapState = {
  host: null,
  participant: null
};
const routedGeometryCache = new Map();

function selectedDistance() {
  return document.querySelector("input[name='distance']:checked").value;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureDeviceParticipantId() {
  if (!currentParticipantId) {
    currentParticipantId = createId();
  }

  localStorage.setItem(storageKeys.currentParticipant, currentParticipantId);
  localStorage.setItem(storageKeys.deviceParticipant, currentParticipantId);
  return currentParticipantId;
}

function loadBoards() {
  const saved = localStorage.getItem(storageKeys.boards);

  if (!saved) {
    return JSON.parse(JSON.stringify(defaultBoards));
  }

  try {
    return removeSeedBoardEntries(JSON.parse(saved));
  } catch {
    return JSON.parse(JSON.stringify(defaultBoards));
  }
}

function removeSeedBoardEntries(savedBoards) {
  return {
    female: Array.isArray(savedBoards?.female)
      ? savedBoards.female.filter((person) => !seedLeaderboardNames.has(person.name))
      : [],
    male: Array.isArray(savedBoards?.male)
      ? savedBoards.male.filter((person) => !seedLeaderboardNames.has(person.name))
      : []
  };
}

function saveBoards() {
  localStorage.setItem(storageKeys.boards, JSON.stringify(boards));
}

function createSupabaseClient() {
  if (!window.supabase || !window.BSA_SUPABASE_URL || !window.BSA_SUPABASE_ANON_KEY) {
    return null;
  }

  return window.supabase.createClient(window.BSA_SUPABASE_URL, window.BSA_SUPABASE_ANON_KEY);
}

function getStoredTrack() {
  const saved = localStorage.getItem(storageKeys.track);

  if (!saved) {
    return null;
  }

  try {
    const track = JSON.parse(saved);
    if (!Array.isArray(track.points)) {
      localStorage.removeItem(storageKeys.track);
      return null;
    }

    return normalizeTrack(track);
  } catch {
    localStorage.removeItem(storageKeys.track);
    return null;
  }
}

function saveTrack(track) {
  const normalized = normalizeTrack(track);
  localStorage.setItem(storageKeys.track, JSON.stringify(normalized));
  saveTrackRemote(normalized);
}

async function saveTrackRemote(track) {
  if (!supabaseClient) {
    return;
  }

  try {
    await supabaseClient
      .from("bsa_tracks")
      .upsert({ id: "today", track, updated_at: new Date().toISOString() });
  } catch {
    elements.publishMessage.textContent = "Route saved on this device. Supabase sync is not available right now.";
  }
}

function generateTrack() {
  const distance = selectedDistance();
  const options = routeOptions[distance];
  const route = options[Math.floor(Math.random() * options.length)];
  const track = normalizeTrack({
    ...route,
    distance: Number(distance),
    host: "Sabid",
    start: "Music Building, Texas State University",
    publishedAt: new Date().toISOString()
  });

  saveTrack(track);
  if (isHostMode) {
    renderTrack("host", track);
  } else {
    renderTrack("participant", track);
  }
  updateProgress(0);
  elements.publishMessage.textContent = `Published ${track.name} for participants.`;
  elements.participantStatus.textContent = "The host has published today's route. Meet at the Music Building.";
}

function normalizeTrack(track) {
  const points = Array.isArray(track.points) ? track.points : [];
  const middle = points.slice(1, -1);

  return {
    ...track,
    points: [
      { ...startFinish, label: "Music Building start" },
      ...middle,
      { ...startFinish, label: "Music Building start/finish" }
    ]
  };
}

function buildOpenStreetMapLink(track) {
  return "route.html";
}

function renderTrack(scope, track) {
  const routeName = document.querySelector(`#${scope}RouteName`);
  const distance = document.querySelector(`#${scope}Distance`);
  const routeDescription = document.querySelector(`#${scope}RouteDescription`);
  const routeStops = document.querySelector(`#${scope}RouteStops`);
  const mapLink = document.querySelector(`#${scope}MapLink`);
  const fallback = document.querySelector(`#${scope}MapFallback`);

  if (!track) {
    routeName.textContent = "No track published yet";
    distance.textContent = "-- mi";
    routeDescription.textContent = scope === "host"
      ? "Generate a route to publish it for today's participants."
      : "Once the host publishes a route, it will appear here.";
    routeStops.innerHTML = "";
    mapLink.href = "#";
    fallback.classList.remove("hidden");
    return;
  }

  routeName.textContent = track.name;
  distance.textContent = `${track.distance} mi`;
  routeDescription.textContent = `${track.description} Start: ${track.start}.`;
  routeStops.innerHTML = track.stops.map((stop) => `<li>${escapeHtml(stop)}</li>`).join("");
  mapLink.href = buildOpenStreetMapLink(track);

  const topParticipantMapLink = document.querySelector("#participantMapLinkTop");
  if (topParticipantMapLink) {
    topParticipantMapLink.href = buildOpenStreetMapLink(track);
  }

  updateProgress(Number(elements.milesPassed.value || 0), { persist: false });
  renderLeafletMap(scope, track);
}

async function renderLeafletMap(scope, track) {
  const mapElement = document.querySelector(`#${scope}Map`);
  const fallback = document.querySelector(`#${scope}MapFallback`);

  if (!mapElement || mapElement.clientWidth === 0 || mapElement.clientHeight === 0) {
    return;
  }

  if (!window.L) {
    fallback.classList.remove("hidden");
    fallback.querySelector("span").textContent = "Leaflet could not load. Check your internet connection and reload.";
    return;
  }

  fallback.classList.add("hidden");

  if (!mapState[scope]) {
    const map = L.map(mapElement, {
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapState[scope] = {
      map,
      layers: L.layerGroup().addTo(map),
      participantLayers: L.layerGroup().addTo(map)
    };
  }

  const state = mapState[scope];
  state.layers.clearLayers();
  state.participantLayers.clearLayers();
  state.map.invalidateSize(false);

  const latLngs = await getRouteLatLngs(track);
  L.polyline(latLngs, {
    color: "#fffaf0",
    weight: 11,
    opacity: 0.65,
    lineJoin: "round"
  }).addTo(state.layers);

  const routeLine = L.polyline(latLngs, {
    color: "#d91624",
    weight: 7,
    opacity: 0.98,
    lineJoin: "round"
  }).addTo(state.layers);

  addRouteMarker(state.layers, track.points[0], "S/F", "Start and finish: Music Building", "start-finish-marker");
  track.points.slice(1, -1).forEach((point, index) => {
    const alignedPoint = snapPointToRoute(point, latLngs);
    addRouteMarker(state.layers, alignedPoint, String(index + 1), point.label || `Checkpoint ${index + 1}`, "checkpoint-marker");
  });
  renderParticipantMarkers(scope);

  settleLeafletMap(scope, routeLine.getBounds());
}

function loadParticipants() {
  const saved = localStorage.getItem(storageKeys.participants);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveParticipants() {
  const deduped = [];
  const seen = new Set();

  participants.forEach((participant) => {
    if (!participant?.id || seen.has(participant.id)) {
      return;
    }

    seen.add(participant.id);
    deduped.push(participant);
  });

  participants = deduped;
  localStorage.setItem(storageKeys.participants, JSON.stringify(participants));
}

async function saveParticipantRemote(participant) {
  if (!supabaseClient || !participant) {
    return;
  }

  try {
    await supabaseClient
      .from("bsa_participants")
      .upsert({
        id: participant.id,
        name: participant.name,
        category: participant.category,
        miles_passed: Number(participant.milesPassed || 0),
        finished: Boolean(participant.finished),
        live: Boolean(participant.live),
        position: participant.position || null,
        updated_at: participant.updatedAt || new Date().toISOString()
      });
  } catch {
    elements.trackerStatus.textContent = "Saved on this device. Supabase sync is not available right now.";
  }
}

async function deleteParticipantRemote(id) {
  if (!supabaseClient) {
    return;
  }

  try {
    await supabaseClient.from("bsa_participants").delete().eq("id", id);
  } catch {
    elements.publishMessage.textContent = "Removed locally. Supabase sync is not available right now.";
  }
}

function currentParticipant() {
  return participants.find((participant) => participant.id === currentParticipantId);
}

function upsertCurrentParticipant(updates) {
  if (!currentParticipantId) {
    return null;
  }

  const index = participants.findIndex((participant) => participant.id === currentParticipantId);
  if (index === -1) {
    return null;
  }

  participants[index] = {
    ...participants[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveParticipants();
  saveParticipantRemote(participants[index]);
  renderParticipantProfile();
  renderHostParticipants();
  refreshParticipantMarkers();
  return participants[index];
}

function renderParticipantProfile() {
  const participant = currentParticipant();

  if (!participant) {
    elements.profileName.value = "";
    elements.profileCategory.value = "female";
    elements.profileForm.classList.remove("hidden");
    elements.profileSummary.classList.add("hidden");
    elements.profileSummary.innerHTML = "";
    elements.profileStatus.textContent = "Create a temporary profile so the host can track your progress.";
    return;
  }

  elements.profileName.value = participant.name;
  elements.profileCategory.value = participant.category;
  elements.profileForm.classList.add("hidden");
  elements.profileSummary.classList.remove("hidden");
  elements.profileSummary.innerHTML = `
    <span class="label">Saved profile</span>
    <strong>${escapeHtml(participant.name)}</strong>
    <span>${escapeHtml(participant.category)}</span>
  `;
  elements.profileStatus.textContent = "This browser is already registered for the event.";
  updateProgress(participant.milesPassed || 0, { persist: false });
}

function participantFromRemote(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    milesPassed: Number(row.miles_passed || 0),
    finished: Boolean(row.finished),
    live: Boolean(row.live),
    position: row.position || null,
    updatedAt: row.updated_at
  };
}

async function loadSupabaseState() {
  if (!supabaseClient) {
    return;
  }

  let trackRows = null;
  let participantRows = null;

  try {
    [{ data: trackRows }, { data: participantRows }] = await Promise.all([
      supabaseClient.from("bsa_tracks").select("track").eq("id", "today").maybeSingle(),
      supabaseClient.from("bsa_participants").select("*").order("updated_at", { ascending: false })
    ]);
  } catch {
    elements.profileStatus.textContent = "Supabase sync is offline. This device will use local data.";
    return;
  }

  if (trackRows?.track) {
    const track = normalizeTrack(trackRows.track);
    localStorage.setItem(storageKeys.track, JSON.stringify(track));
    renderTrack("host", track);
    renderTrack("participant", track);
  }

  if (participantRows) {
    const localCurrent = currentParticipant();
    participants = participantRows.map(participantFromRemote);

    if (localCurrent && !participants.some((participant) => participant.id === localCurrent.id)) {
      participants.push(localCurrent);
    }

    saveParticipants();
    renderParticipantProfile();
    renderHostParticipants();
    refreshParticipantMarkers();
  }
}

function subscribeSupabaseRealtime() {
  if (!supabaseClient) {
    return;
  }

  supabaseClient
    .channel("bsa-stepup-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "bsa_tracks" }, (payload) => {
      const track = normalizeTrack(payload.new.track);
      localStorage.setItem(storageKeys.track, JSON.stringify(track));
      renderTrack("host", track);
      renderTrack("participant", track);
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "bsa_participants" }, (payload) => {
      if (payload.eventType === "DELETE") {
        participants = participants.filter((participant) => participant.id !== payload.old.id);
      } else {
        const participant = participantFromRemote(payload.new);
        const index = participants.findIndex((item) => item.id === participant.id);
        if (index === -1) {
          participants.push(participant);
        } else {
          participants[index] = participant;
        }
      }

      saveParticipants();
      renderParticipantProfile();
      renderHostParticipants();
      refreshParticipantMarkers();
    })
    .subscribe();
}

function renderHostParticipants() {
  if (!elements.hostParticipantList) {
    return;
  }

  if (!participants.length) {
    elements.hostParticipantList.innerHTML = "<li class=\"empty-participant\">No temporary profiles yet.</li>";
    return;
  }

  elements.hostParticipantList.innerHTML = participants
    .map((participant) => {
      const miles = Number(participant.milesPassed || 0).toFixed(1);
      const liveStatus = participant.live ? "Live" : "Manual";
      const status = participant.finished ? "Finished" : `${miles} mi - ${liveStatus}`;
      const lastSeen = participant.updatedAt ? ` - ${formatLastSeen(participant.updatedAt)}` : "";
      const name = escapeHtml(participant.name);
      const category = escapeHtml(participant.category);
      return `
        <li>
          <div>
            <strong>${name}</strong>
            <span>${category} - ${status}${lastSeen}</span>
          </div>
          <div class="participant-row-actions">
            <button class="mark-finished-host" type="button" data-id="${escapeHtml(participant.id)}">Mark finished</button>
            <button class="remove-participant-host" type="button" data-id="${escapeHtml(participant.id)}">Remove</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function formatLastSeen(value) {
  const diff = Date.now() - new Date(value).getTime();
  const seconds = Math.max(Math.round(diff / 1000), 0);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  return `${Math.round(seconds / 60)}m ago`;
}

function renderParticipantMarkers(scope) {
  const state = mapState[scope];
  if (!state) {
    return;
  }

  state.participantLayers.clearLayers();
  const visibleParticipants = scope === "host"
    ? participants
    : participants.filter((participant) => participant.id === currentParticipantId);

  visibleParticipants
    .filter((participant) => participant.position)
    .forEach((participant) => {
      const icon = L.divIcon({
        className: `participant-position-marker ${participant.live ? "live-participant" : ""} ${participant.finished ? "finished-participant" : ""}`,
        html: `<span>${escapeHtml(participant.name.slice(0, 1).toUpperCase())}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      L.marker([participant.position.lat, participant.position.lng], { icon })
        .addTo(state.participantLayers)
        .bindPopup(`${escapeHtml(participant.name)}: ${participant.finished ? "Finished" : `${Number(participant.milesPassed || 0).toFixed(1)} mi`}`);
    });
}

function refreshParticipantMarkers() {
  renderParticipantMarkers("host");
  renderParticipantMarkers("participant");
}

function addRouteMarker(layerGroup, point, label, popupText, className) {
  const isStartFinish = className === "start-finish-marker";
  const size = isStartFinish ? 44 : 36;
  const icon = L.divIcon({
    className: `route-marker ${className}`,
    html: `<span>${escapeHtml(label)}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -18]
  });

  L.marker([point.lat, point.lng], { icon }).addTo(layerGroup).bindPopup(popupText);
}

function snapPointToRoute(point, latLngs) {
  let closest = { lat: point.lat, lng: point.lng };
  let closestDistance = Number.POSITIVE_INFINITY;

  latLngs.forEach(([lat, lng]) => {
    const distance = distanceBetween(point, { lat, lng });
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = { lat, lng };
    }
  });

  return closest;
}

async function getRouteLatLngs(track) {
  const cacheKey = `${track.id}-${track.distance}-${track.points.map((point) => `${point.lat},${point.lng}`).join("|")}`;

  if (routedGeometryCache.has(cacheKey)) {
    return routedGeometryCache.get(cacheKey);
  }

  const fallback = densifyPoints(track.points).map((point) => [point.lat, point.lng]);
  const coordinates = track.points.map((point) => `${point.lng},${point.lat}`).join(";");
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coordinates}?overview=full&geometries=geojson&continue_straight=false&steps=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Routing service unavailable");
    }

    const data = await response.json();
    const geometry = data.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(geometry) || geometry.length < 2) {
      throw new Error("Routing geometry missing");
    }

    const routed = geometry.map(([lng, lat]) => [lat, lng]);
    routedGeometryCache.set(cacheKey, routed);
    return routed;
  } catch {
    routedGeometryCache.set(cacheKey, fallback);
    return fallback;
  }
}

function densifyPoints(points) {
  const dense = [];

  points.forEach((point, index) => {
    const next = points[index + 1];
    dense.push(point);

    if (!next) {
      return;
    }

    for (let step = 1; step < 6; step += 1) {
      dense.push({
        lat: point.lat + ((next.lat - point.lat) * step / 6),
        lng: point.lng + ((next.lng - point.lng) * step / 6)
      });
    }
  });

  return dense;
}

function getBounds(points) {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const padding = 0.004;

  return {
    south: Math.min(...lats) - padding,
    north: Math.max(...lats) + padding,
    west: Math.min(...lngs) - padding,
    east: Math.max(...lngs) + padding
  };
}

function getCenter(points) {
  const total = points.reduce((sum, point) => ({
    lat: sum.lat + point.lat,
    lng: sum.lng + point.lng
  }), { lat: 0, lng: 0 });

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length
  };
}

function settleLeafletMap(scope, bounds) {
  const state = mapState[scope];

  if (!state) {
    return;
  }

  requestAnimationFrame(() => {
    state.map.invalidateSize(false);
    state.map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });

    setTimeout(() => {
      state.map.invalidateSize(false);
      state.map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });
    }, 250);
  });
}

function updateProgress(value, options = { persist: true }) {
  const track = getStoredTrack();
  const total = track?.distance || Number(selectedDistance());
  const passed = Math.min(Number(value), total);
  const left = Math.max(total - passed, 0);
  const percent = total ? Math.round((passed / total) * 100) : 0;

  elements.milesPassed.max = total;
  elements.milesPassed.value = passed;
  elements.milesPassedLabel.textContent = `${passed.toFixed(1)} mi`;
  elements.milesLeft.textContent = `${left.toFixed(1)} mi`;
  elements.progressPercent.textContent = `${percent}%`;

  if (options.persist) {
    upsertCurrentParticipant({
      milesPassed: passed,
      position: estimatePositionOnTrack(track, passed),
      finished: total > 0 && passed >= total
    });
  }
}

function estimatePositionOnTrack(track, milesPassed) {
  if (!track?.points?.length) {
    return startFinish;
  }

  const total = track.distance || Number(selectedDistance());
  const ratio = total ? Math.min(Math.max(milesPassed / total, 0), 1) : 0;
  const routeIndex = ratio * (track.points.length - 1);
  const startIndex = Math.floor(routeIndex);
  const endIndex = Math.min(startIndex + 1, track.points.length - 1);
  const localRatio = routeIndex - startIndex;
  const start = track.points[startIndex];
  const end = track.points[endIndex];

  return {
    lat: start.lat + ((end.lat - start.lat) * localRatio),
    lng: start.lng + ((end.lng - start.lng) * localRatio)
  };
}

function estimateProgressFromLocation(position) {
  const track = getStoredTrack();

  if (!track) {
    elements.trackerStatus.textContent = "No published route yet.";
    return;
  }

  const current = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  track.points.forEach((point, index) => {
    const distance = distanceBetween(current, point);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  const estimatedMiles = (closestIndex / Math.max(track.points.length - 1, 1)) * track.distance;
  updateProgress(estimatedMiles);
  upsertCurrentParticipant({
    position: current,
    milesPassed: estimatedMiles,
    live: liveLocationWatchId !== null,
    accuracy: position.coords.accuracy || null
  });
  elements.trackerStatus.textContent = liveLocationWatchId === null
    ? "Progress estimated from your location."
    : "Live location is sharing with the host.";
}

function distanceBetween(a, b) {
  const earthRadiusMiles = 3958.8;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const haversine = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function applyAccessMode() {
  document.body.classList.toggle("host-mode", isHostMode);
  document.body.classList.toggle("participant-mode", !isHostMode);
  elements.hostView.classList.toggle("hidden", !isHostMode);
  elements.signupSection.classList.toggle("hidden", !isHostMode);
  elements.leaveHost.classList.toggle("hidden", !isHostMode);
  elements.participantView.classList.toggle("hidden", isHostMode);

  if (isHostMode) {
    renderTrack("host", getStoredTrack());
  } else {
    renderTrack("participant", getStoredTrack());
  }

  renderBoard("female");
  renderBoard("male");
  renderHostParticipants();
}

function renderBoard(category) {
  const board = document.querySelector(`#${category}Board`);
  const sorted = [...boards[category]].sort((a, b) => b.miles - a.miles);

  if (!sorted.length) {
    board.innerHTML = "<li class=\"empty-board\">No walkers yet.</li>";
    return;
  }

  board.innerHTML = sorted
    .map((person, index) => {
      const miles = Number.isInteger(person.miles) ? person.miles : person.miles.toFixed(1);
      const name = escapeHtml(person.name);
      const removeButton = isHostMode
        ? `<button class="remove-person" type="button" data-category="${escapeHtml(category)}" data-id="${escapeHtml(person.id)}" aria-label="Remove ${name}">Remove</button>`
        : "";

      return `
        <li>
          <span class="rank">${index + 1}</span>
          <strong>${name}</strong>
          <span class="miles">${miles} mi</span>
          ${removeButton}
        </li>
      `;
    })
    .join("");
}

function removeFromBoard(category, id) {
  if (!isHostMode) {
    return;
  }

  boards[category] = boards[category].filter((person) => person.id !== id);
  saveBoards();
  renderBoard(category);
}

elements.leaveHost.addEventListener("click", () => {
  isHostMode = false;
  history.replaceState(null, "", window.location.pathname);
  applyAccessMode();
});

elements.generateButton.addEventListener("click", generateTrack);

elements.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentParticipant()) {
    renderParticipantProfile();
    return;
  }

  const name = elements.profileName.value.trim();
  const category = elements.profileCategory.value;

  if (!name) {
    return;
  }

  const deviceParticipantId = ensureDeviceParticipantId();
  const existing = currentParticipant();
  if (existing) {
    participants = participants.map((participant) => participant.id === existing.id
      ? { ...participant, name, category, updatedAt: new Date().toISOString() }
      : participant);
  } else {
    const participant = {
      id: deviceParticipantId,
      name,
      category,
      milesPassed: Number(elements.milesPassed.value || 0),
      finished: false,
      live: false,
      position: estimatePositionOnTrack(getStoredTrack(), Number(elements.milesPassed.value || 0)),
      updatedAt: new Date().toISOString()
    };
    participants.push(participant);
  }

  saveParticipants();
  saveParticipantRemote(currentParticipant());
  renderParticipantProfile();
  renderHostParticipants();
  refreshParticipantMarkers();
});

elements.refreshParticipant.addEventListener("click", () => {
  const track = getStoredTrack();
  renderTrack("participant", track);
  elements.participantStatus.textContent = track
    ? "The latest host-published route is loaded."
    : "Waiting for the host to publish today's route.";
});

elements.milesPassed.addEventListener("input", (event) => updateProgress(event.target.value));

function stopLiveLocation(message = "Live location stopped.") {
  if (liveLocationWatchId !== null) {
    navigator.geolocation.clearWatch(liveLocationWatchId);
    liveLocationWatchId = null;
  }

  elements.useLocation.textContent = "Start live location";
  upsertCurrentParticipant({ live: false });
  elements.trackerStatus.textContent = message;
}

function startLiveLocation() {
  if (!currentParticipant()) {
    elements.trackerStatus.textContent = "Create a temporary profile before sharing location.";
    return;
  }

  if (!navigator.geolocation) {
    elements.trackerStatus.textContent = "Location tracking is not available in this browser.";
    return;
  }

  elements.trackerStatus.textContent = "Starting live location...";
  elements.useLocation.textContent = "Stop live location";
  upsertCurrentParticipant({ live: true });

  liveLocationWatchId = navigator.geolocation.watchPosition(estimateProgressFromLocation, () => {
    stopLiveLocation("Location permission was not available. You can still move the tracker manually.");
  }, {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 15000
  });
}

elements.useLocation.addEventListener("click", () => {
  if (liveLocationWatchId !== null) {
    stopLiveLocation();
    return;
  }

  startLiveLocation();
});

elements.walkerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = elements.walkerName.value.trim();
  const category = elements.walkerCategory.value;
  const miles = Number(elements.walkerMiles.value);

  if (!name || !miles || !isHostMode) {
    return;
  }

  boards[category].push({ id: createId(), name, miles });
  saveBoards();
  renderBoard(category);
  elements.walkerForm.reset();
  elements.walkerMiles.value = selectedDistance();
});

document.querySelector(".leaderboard-grid").addEventListener("click", (event) => {
  const button = event.target.closest(".remove-person");
  if (button) {
    removeFromBoard(button.dataset.category, button.dataset.id);
  }
});

elements.hostParticipantList.addEventListener("click", (event) => {
  const finishButton = event.target.closest(".mark-finished-host");
  const removeButton = event.target.closest(".remove-participant-host");
  const track = getStoredTrack();

  if (finishButton) {
    let finishedParticipant = null;
    participants = participants.map((participant) => participant.id === finishButton.dataset.id
      ? {
          ...participant,
          milesPassed: track?.distance || participant.milesPassed || 0,
          finished: true,
          updatedAt: new Date().toISOString()
        }
      : participant);
    finishedParticipant = participants.find((participant) => participant.id === finishButton.dataset.id);
    saveParticipants();
    saveParticipantRemote(finishedParticipant);
    renderParticipantProfile();
    renderHostParticipants();
    refreshParticipantMarkers();
  }

  if (removeButton) {
    participants = participants.filter((participant) => participant.id !== removeButton.dataset.id);
    if (currentParticipantId === removeButton.dataset.id) {
      currentParticipantId = "";
      localStorage.removeItem(storageKeys.currentParticipant);
      localStorage.removeItem(storageKeys.deviceParticipant);
    }
    saveParticipants();
    deleteParticipantRemote(removeButton.dataset.id);
    renderParticipantProfile();
    renderHostParticipants();
    refreshParticipantMarkers();
  }
});

document.querySelectorAll("input[name='distance']").forEach((input) => {
  input.addEventListener("change", () => {
    elements.walkerMiles.value = selectedDistance();
    updateProgress(elements.milesPassed.value);
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === storageKeys.track) {
    const track = getStoredTrack();
    renderTrack("host", track);
    renderTrack("participant", track);
  }

  if (event.key === storageKeys.boards) {
    boards = loadBoards();
    renderBoard("female");
    renderBoard("male");
  }

  if (event.key === storageKeys.participants) {
    participants = loadParticipants();
    renderParticipantProfile();
    renderHostParticipants();
    refreshParticipantMarkers();
  }
});

const initialTrack = getStoredTrack();
renderTrack("participant", initialTrack);
renderParticipantProfile();
renderHostParticipants();
renderBoard("female");
renderBoard("male");
updateProgress(currentParticipant()?.milesPassed || 0, { persist: false });
applyAccessMode();
loadSupabaseState();
subscribeSupabaseRealtime();
