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

//  a Circle has always the same meter size / radius.
const circle = L.circle(
  [startLatLng[0] + latDelta * 2, startLatLng[1] + lngDelta * 4],
  { radius: 250 }
);

const layers = [circle];

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
  console.log("lasso finished event", event);
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
