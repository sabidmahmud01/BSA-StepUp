const routeStorageKey = "bsa-stepup-todays-track";
const participantsStorageKey = "bsa-stepup-participants";
const currentParticipantStorageKey = "bsa-stepup-current-participant";
const supabaseClient = createSupabaseClient();

function createSupabaseClient() {
  if (!window.supabase || !window.BSA_SUPABASE_URL || !window.BSA_SUPABASE_ANON_KEY) {
    return null;
  }

  return window.supabase.createClient(window.BSA_SUPABASE_URL, window.BSA_SUPABASE_ANON_KEY);
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

function getPublishedTrack() {
  const saved = localStorage.getItem(routeStorageKey);

  if (!saved) {
    return null;
  }

  try {
    const track = JSON.parse(saved);
    return Array.isArray(track.points) ? normalizeTrack(track) : null;
  } catch {
    return null;
  }
}

function normalizeTrack(track) {
  const startFinish = { lat: 29.890434, lng: -97.941117 };
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

function getCurrentParticipant() {
  const currentId = localStorage.getItem(currentParticipantStorageKey);
  const saved = localStorage.getItem(participantsStorageKey);

  if (!currentId || !saved) {
    return null;
  }

  try {
    const participants = JSON.parse(saved);
    return participants.find((participant) => participant.id === currentId) || null;
  } catch {
    return null;
  }
}

function addParticipantMarker(layerGroup, participant) {
  if (!participant?.position) {
    return;
  }

  const icon = L.divIcon({
    className: "participant-position-marker",
    html: `<span>${escapeHtml(participant.name.slice(0, 1).toUpperCase())}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });

  L.marker([participant.position.lat, participant.position.lng], { icon })
    .addTo(layerGroup)
    .bindPopup(`${escapeHtml(participant.name)}: your position`);
}

async function drawFullRoute(track) {
  const fallback = document.querySelector("#routeFullFallback");
  const title = document.querySelector("#routePageTitle");
  const mapElement = document.querySelector("#routeFullMap");

  if (!track || !window.L) {
    fallback.classList.remove("hidden");
    return;
  }

  title.textContent = `${track.name} - ${track.distance} mi`;
  fallback.classList.add("hidden");

  const map = L.map(mapElement, {
    zoomControl: true,
    scrollWheelZoom: true
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const layerGroup = L.layerGroup().addTo(map);
  const latLngs = await getRouteLatLngs(track);
  L.polyline(latLngs, {
    color: "#fffaf0",
    weight: 12,
    opacity: 0.75,
    lineJoin: "round"
  }).addTo(layerGroup);
  const routeLine = L.polyline(latLngs, {
    color: "#d91624",
    weight: 7,
    opacity: 0.98,
    lineJoin: "round"
  }).addTo(layerGroup);

  addRouteMarker(layerGroup, track.points[0], "S/F", "Start and finish: Music Building", "start-finish-marker");
  track.points.slice(1, -1).forEach((point, index) => {
    const alignedPoint = snapPointToRoute(point, latLngs);
    addRouteMarker(layerGroup, alignedPoint, String(index + 1), point.label || `Checkpoint ${index + 1}`, "checkpoint-marker");
  });
  addParticipantMarker(layerGroup, getCurrentParticipant());

  requestAnimationFrame(() => {
    map.invalidateSize(false);
    map.fitBounds(routeLine.getBounds(), { padding: [36, 36], maxZoom: 16 });
  });
}

loadAndDrawRoute();

async function loadAndDrawRoute() {
  let track = getPublishedTrack();

  if (!track && supabaseClient) {
    let data = null;

    try {
      ({ data } = await supabaseClient
        .from("bsa_tracks")
        .select("track")
        .eq("id", "today")
        .maybeSingle());
    } catch {
      data = null;
    }

    if (data?.track) {
      track = normalizeTrack(data.track);
      localStorage.setItem(routeStorageKey, JSON.stringify(track));
    }
  }

  drawFullRoute(track);
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

async function getRouteLatLngs(track) {
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

    return geometry.map(([lng, lat]) => [lat, lng]);
  } catch {
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
