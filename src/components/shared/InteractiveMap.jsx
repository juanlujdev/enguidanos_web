import React, { useState, useEffect, useRef } from 'react'
import POIS from '../../data/pois.json'
import POI_CAT from '../../data/poi-cats.json'

function InteractiveMap() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(1);
  const filtered = filter === "all" ? POIS : POIS.filter(p => p.cat === filter);

  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef({});
  const activeRef = useRef(active);
  const didInteract = useRef(false);
  activeRef.current = active;

  const makeIcon = (p, isActive) => window.L.divIcon({
    className: "poi-divicon",
    html: `<div class="poi-marker${isActive ? " active" : ""}" style="--c:${POI_CAT[p.cat].color}">${p.id}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  // Init map once
  useEffect(() => {
    if (!window.L || !mapEl.current || mapRef.current) return;
    const map = window.L.map(mapEl.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([39.6733, -1.6067], 13);
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    const cluster = window.L.markerClusterGroup
      ? window.L.markerClusterGroup({ maxClusterRadius: 44, showCoverageOnHover: false, spiderfyOnMaxZoom: true })
      : window.L.layerGroup();
    map.addLayer(cluster);
    mapRef.current = map;
    clusterRef.current = cluster;
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; clusterRef.current = null; markersRef.current = {}; };
  }, []);

  // Sync markers with current filter
  useEffect(() => {
    const map = mapRef.current, cluster = clusterRef.current;
    if (!map || !cluster || !window.L) return;
    cluster.clearLayers();
    markersRef.current = {};
    filtered.forEach(p => {
      const m = window.L.marker([p.lat, p.lng], { icon: makeIcon(p, p.id === activeRef.current) })
        .bindTooltip(p.name, { direction: "top", offset: [0, -12] })
        .on("click", () => setActive(p.id));
      markersRef.current[p.id] = m;
      cluster.addLayer(m);
    });
    if (filtered.length) {
      const bounds = window.L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filter]);

  // Highlight + reveal active
  useEffect(() => {
    const map = mapRef.current, cluster = clusterRef.current;
    if (!map || !cluster || !window.L) return;
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const p = POIS.find(x => x.id === Number(id));
      if (p) m.setIcon(makeIcon(p, Number(id) === active));
    });
    if (!didInteract.current) { didInteract.current = true; return; }
    const am = markersRef.current[active];
    if (!am) return;
    if (cluster.zoomToShowLayer) {
      cluster.zoomToShowLayer(am, () => am.openTooltip());
    } else {
      map.panTo(am.getLatLng(), { animate: true });
      am.openTooltip();
    }
  }, [active]);

  return (
    <section className="section map-section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Mapa interactivo</div>
            <h2 className="section-title">Descubre el <em>territorio</em></h2>
          </div>
          <div className="section-meta">Naturaleza, patrimonio, dónde comer y dormir. Filtra y haz clic en los puntos del mapa.</div>
        </div>
      </div>
      <div className="container">
        <div className="map-container reveal">
          <div className="map-sidebar">
            <div className="map-filters">
              <button className={`filter-chip ${filter==="all"?"active":""}`} onClick={() => setFilter("all")}>Todos</button>
              {Object.entries(POI_CAT).map(([k, v]) => (
                <button key={k} className={`filter-chip ${filter===k?"active":""}`} onClick={() => setFilter(k)}>
                  <span className="swatch" style={{background:v.color}}></span>{v.label}
                </button>
              ))}
            </div>
            <div className="poi-list">
              {filtered.map(p => (
                <div key={p.id} className={`poi-item ${active===p.id?"active":""}`} onClick={() => setActive(p.id)}>
                  <div className="poi-num" style={{background: POI_CAT[p.cat].color}}>{p.id}</div>
                  <div>
                    <div className="poi-name">{p.name}</div>
                    <div className="poi-cat">{POI_CAT[p.cat].label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="map-canvas">
            <div ref={mapEl} className="leaflet-map"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveMap
