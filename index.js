const mapElement = document.querySelector("#map");
const toggleLasso = document.querySelector("#toggleLasso");
const contain = document.querySelector("#contain");
const intersect = document.querySelector("#intersect");
const lassoEnabled = document.querySelector("#lassoEnabled");
const lassoResult = document.querySelector("#lassoResult");

const map = L.map(mapElement, { center: [0, 0], zoom: 0 });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
const lassoControl = L.control.lasso().addTo(map);

// the same layers as in unit test
const startLatLng = [51.5, -0.11];
const latDelta = 0.01;
const lngDelta = latDelta * 1.75;
const latSmallDelta = 0.002;
const lngSmallDelta = latSmallDelta * 1.75;
const markers = new Array(9)
  .fill(undefined)
  .map((_, i) =>
    L.marker([
      startLatLng[0] + Math.floor(i / 3) * latDelta,
      startLatLng[1] + (i % 3) * lngDelta,
    ])
  );
const circleMarker = L.circleMarker(
  [startLatLng[0] + latDelta * 2, startLatLng[1] + lngDelta * 3],
  { radius: 21 }
);
const circle = L.circle(
  [startLatLng[0] + latDelta * 2, startLatLng[1] + lngDelta * 4],
  { radius: 250 }
);
const polyline = ((latLng) =>
  L.polyline([
    [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
    [latLng[0] + latSmallDelta, latLng[1] - lngSmallDelta],
    [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
    [latLng[0] - latSmallDelta, latLng[1] + lngSmallDelta],
  ]))([startLatLng[0] + latDelta * 1, startLatLng[1] + lngDelta * 3]);
const multiPolyline = ((latLng) =>
  L.polyline([
    [
      [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] - lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
      [latLng[0] - latSmallDelta, latLng[1] + lngSmallDelta],
    ],
    [
      [latLng[0] - latSmallDelta / 2, latLng[1] - lngSmallDelta / 2],
      [latLng[0] + latSmallDelta / 2, latLng[1] - lngSmallDelta / 2],
      [latLng[0] + latSmallDelta / 2, latLng[1] + lngSmallDelta / 2],
      [latLng[0] - latSmallDelta / 2, latLng[1] + lngSmallDelta / 2],
    ],
  ]))([startLatLng[0] + latDelta * 1, startLatLng[1] + lngDelta * 4]);
const rectangle = ((latLng) =>
  L.rectangle([
    [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
    [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
  ]))([startLatLng[0], startLatLng[1] + lngDelta * 3]);
const polygon = ((latLng) =>
  L.polygon([
    [
      [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] - lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
      [latLng[0] - latSmallDelta, latLng[1] + lngSmallDelta],
    ],
  ]))([startLatLng[0], startLatLng[1] + lngDelta * 4]);
const holedPolygon = ((latLng) =>
  L.polygon([
    [
      [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
      [latLng[0] - latSmallDelta, latLng[1] + lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
      [latLng[0] + latSmallDelta, latLng[1] - lngSmallDelta],
    ],
    [
      [latLng[0] - latSmallDelta / 2, latLng[1] - lngSmallDelta / 2],
      [latLng[0] - latSmallDelta / 2, latLng[1] + lngSmallDelta / 2],
      [latLng[0] + latSmallDelta / 2, latLng[1] + lngSmallDelta / 2],
      [latLng[0] + latSmallDelta / 2, latLng[1] - lngSmallDelta / 2],
    ],
  ]))([startLatLng[0], startLatLng[1] + lngDelta * 5]);
const multiPolygon = ((latLng) =>
  L.polygon([
    [
      [
        [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
        [latLng[0] - latSmallDelta, latLng[1]],
        [latLng[0], latLng[1]],
        [latLng[0], latLng[1] - lngSmallDelta],
      ],
    ],
    [
      [
        [latLng[0], latLng[1]],
        [latLng[0], latLng[1] + lngSmallDelta],
        [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
        [latLng[0] + latSmallDelta, latLng[1]],
      ],
    ],
  ]))([startLatLng[0], startLatLng[1] + lngDelta * 6]);
const holedMultiPolygon = ((latLng) =>
  L.polygon([
    [
      [
        [latLng[0] - latSmallDelta, latLng[1] - lngSmallDelta],
        [latLng[0] - latSmallDelta, latLng[1]],
        [latLng[0], latLng[1]],
        [latLng[0], latLng[1] - lngSmallDelta],
      ],
      [
        [
          latLng[0] - (latSmallDelta / 4) * 3,
          latLng[1] - (lngSmallDelta / 4) * 3,
        ],
        [latLng[0] - (latSmallDelta / 4) * 3, latLng[1] - lngSmallDelta / 4],
        [latLng[0] - latSmallDelta / 4, latLng[1] - lngSmallDelta / 4],
        [latLng[0] - latSmallDelta / 4, latLng[1] - (lngSmallDelta / 4) * 3],
      ],
    ],
    [
      [
        [latLng[0], latLng[1]],
        [latLng[0], latLng[1] + lngSmallDelta],
        [latLng[0] + latSmallDelta, latLng[1] + lngSmallDelta],
        [latLng[0] + latSmallDelta, latLng[1]],
      ],
      [
        [
          latLng[0] + (latSmallDelta / 4) * 3,
          latLng[1] + (lngSmallDelta / 4) * 3,
        ],
        [latLng[0] + (latSmallDelta / 4) * 3, latLng[1] + lngSmallDelta / 4],
        [latLng[0] + latSmallDelta / 4, latLng[1] + lngSmallDelta / 4],
        [latLng[0] + latSmallDelta / 4, latLng[1] + (lngSmallDelta / 4) * 3],
      ],
    ],
  ]))([startLatLng[0], startLatLng[1] + lngDelta * 7]);
const markerClusterGroup = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 40,
});
markerClusterGroup.addLayers(markers);
const layers = [
  markerClusterGroup,
  circleMarker,
  circle,
  polyline,
  multiPolyline,
  rectangle,
  polygon,
  holedPolygon,
  multiPolygon,
  holedMultiPolygon,
];

const featureGroup = L.featureGroup(layers).addTo(map);
map.fitBounds(featureGroup.getBounds(), { animate: false });

function resetSelectedState() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)) {
      layer.setIcon(new L.Icon.Default());
    } else if (layer instanceof L.Path) {
      layer.setStyle({ color: "#3388ff" });
    }
  });

  lassoResult.innerHTML = "";
}
function setSelectedLayers(layers) {
  resetSelectedState();

  layers.forEach((layer) => {
    if (layer instanceof L.Marker && !(layer instanceof L.MarkerCluster)) {
      layer.setIcon(new L.Icon.Default({ className: "selected " }));
    } else if (layer instanceof L.Path) {
      layer.setStyle({ color: "#ff4620" });
    }
  });

  lassoResult.innerHTML = layers.length
    ? `Selected ${layers.length} layers`
    : "";
}

map.on("mousedown", () => {
  resetSelectedState();
});
map.on("lasso.finished", (event) => {
  setSelectedLayers(event.layers);
});
map.on("lasso.enabled", () => {
  lassoEnabled.innerHTML = "Enabled";
  resetSelectedState();
});
map.on("lasso.disabled", () => {
  lassoEnabled.innerHTML = "Disabled";
});

toggleLasso.addEventListener("click", () => {
  if (lassoControl.enabled()) {
    lassoControl.disable();
  } else {
    lassoControl.enable();
  }
});
contain.addEventListener("change", () => {
  lassoControl.setOptions({ intersect: intersect.checked });
});
intersect.addEventListener("change", () => {
  lassoControl.setOptions({ intersect: intersect.checked });
});
