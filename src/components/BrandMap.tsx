"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Button from "@/components/Button";
import { company } from "@/content/home";

/**
 * The "Find us" map, in the site's colours: pale grey-blue land, white roads, navy and ink labels, blue-tinted
 * water, and a navy JJM pin (a square with the flame mark and a notch pointing at the spot, like the navy bar
 * above the map). A card in the corner names the office with a Get directions button (Google Maps).
 *
 * Free and keyless: MapLibre (open source) draws OpenFreeMap's Positron style (OpenStreetMap data), recoloured
 * here. The library loads only when the map nears the screen. If it can't load, Google's plain embed shows.
 */

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** 8331 Eastlake Dr Unit 107, Burnaby. [longitude, latitude], as MapLibre takes them. */
const OFFICE: [number, number] = [-122.92251, 49.25902];

const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${company.name}, ${company.address}`)}`;

const C = {
  frost: "#e9ecf2",
  land: "#e5e9f0",
  park: "#d9e2eb",
  building: "#dde2ea",
  buildingLine: "#d0d6e0",
  mist: "#c3c8d5",
  water: "#bfd6ec",
  white: "#ffffff",
  navy: "#17355d",
  blue: "#3f74b7",
  ink: "#3e4d5d",
  muted: "#66768a",
};

/** Paint overrides by layer id, on top of Positron's own. */
const PAINT: Record<string, Record<string, string>> = {
  background: { "background-color": C.frost },
  park: { "fill-color": C.park },
  water: { "fill-color": C.water },
  waterway: { "line-color": C.water },
  landuse_residential: { "fill-color": C.land },
  landcover_wood: { "fill-color": C.park },
  building: { "fill-color": C.building, "fill-outline-color": C.buildingLine },
  highway_path: { "line-color": "#f3f5f9" },
  highway_minor: { "line-color": C.white },
  highway_major_casing: { "line-color": C.buildingLine },
  highway_major_inner: { "line-color": C.white },
  highway_major_subtle: { "line-color": C.white },
  highway_motorway_casing: { "line-color": C.mist },
  highway_motorway_inner: { "line-color": "#f3f5f9" },
  highway_motorway_subtle: { "line-color": C.white },
  highway_motorway_bridge_casing: { "line-color": C.mist },
  highway_motorway_bridge_inner: { "line-color": "#f3f5f9" },
  tunnel_motorway_casing: { "line-color": C.mist },
  tunnel_motorway_inner: { "line-color": "#f3f5f9" },
  railway: { "line-color": C.buildingLine },
  railway_transit: { "line-color": C.buildingLine },
  railway_service: { "line-color": C.buildingLine },
  railway_dashline: { "line-color": C.frost },
  railway_transit_dashline: { "line-color": C.frost },
  railway_service_dashline: { "line-color": C.frost },
  boundary_2: { "line-color": C.mist },
  boundary_3: { "line-color": C.mist },
  boundary_disputed: { "line-color": C.mist },
  water_name_point_label: { "text-color": C.blue, "text-halo-color": C.frost },
  water_name_line_label: { "text-color": C.blue, "text-halo-color": C.frost },
  waterway_line_label: { "text-color": C.blue, "text-halo-color": C.frost },
  "highway-name-path": { "text-color": C.muted, "text-halo-color": C.white },
  "highway-name-minor": { "text-color": C.muted, "text-halo-color": C.white },
  "highway-name-major": { "text-color": C.ink, "text-halo-color": C.white },
  airport: { "text-color": C.muted, "text-halo-color": C.frost },
  label_other: { "text-color": C.ink, "text-halo-color": C.frost },
};

/** Positron hides most street names until you're zoomed right in; these bring them in sooner (zoom levels). */
const MINZOOM: Record<string, number> = { "highway-name-major": 11, "highway-name-minor": 13, "highway-name-path": 15 };

/**
 * Street names, closer to Google's: every named road class (Positron skips motorways, pedestrian streets and
 * busways), repeated more often along long roads, and growing a little as you zoom in.
 */
const NAME_CLASSES: Record<string, string[]> = {
  "highway-name-major": ["motorway", "trunk", "primary", "secondary", "tertiary"],
  "highway-name-minor": ["minor", "service", "track", "pedestrian", "busway", "raceway"],
};
const NAME_LAYOUT = {
  "symbol-spacing": 320,
  "text-padding": 1,
  "text-size": ["interpolate", ["linear"], ["zoom"], 13, 11.5, 16, 13, 18, 15],
};

function streetNames<L extends StyleSpecification["layers"][number]>(layer: L): L {
  if (!layer.id.startsWith("highway-name") || layer.type !== "symbol") return layer;
  const classes = NAME_CLASSES[layer.id];
  return {
    ...layer,
    ...(classes ? { filter: ["match", ["get", "class"], classes, true, false] } : {}),
    layout: { ...layer.layout, ...NAME_LAYOUT },
  };
}

/** Detail Positron leaves out, added in the palette: place and business names (no icons), and house numbers. */
const EXTRA_LAYERS = [
  {
    id: "brand_poi",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "poi",
    minzoom: 15.5,
    filter: ["all", ["match", ["geometry-type"], ["MultiPoint", "Point"], true, false], ["has", "name"]],
    layout: {
      "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      "text-font": ["Noto Sans Italic"],
      "text-size": 11.5,
      "text-max-width": 9,
      "symbol-sort-key": ["get", "rank"],
    },
    paint: { "text-color": C.muted, "text-halo-color": C.frost, "text-halo-width": 1.5 },
  },
  {
    id: "brand_housenumber",
    type: "symbol",
    source: "openmaptiles",
    "source-layer": "housenumber",
    minzoom: 17,
    layout: { "text-field": ["get", "housenumber"], "text-font": ["Noto Sans Regular"], "text-size": 10.5 },
    paint: { "text-color": C.muted, "text-halo-color": C.frost, "text-halo-width": 1.5 },
  },
] as StyleSpecification["layers"];

/** Fetches Positron, recolours it in the brand palette, and adds detail. */
async function brandStyle(): Promise<StyleSpecification> {
  const res = await fetch(STYLE_URL);
  if (!res.ok) throw new Error(`Map style failed to load (${res.status})`);
  const style = (await res.json()) as StyleSpecification;
  style.layers = style.layers.map((layer) => {
    const over = PAINT[layer.id] ?? (layer.id.startsWith("label_") ? { "text-color": C.navy, "text-halo-color": C.frost } : null);
    const next = over ? ({ ...layer, paint: { ...("paint" in layer ? layer.paint : {}), ...over } } as typeof layer) : layer;
    return streetNames(layer.id in MINZOOM ? { ...next, minzoom: MINZOOM[layer.id] } : next);
  });
  // Above the roads, below the street names and place labels, so road names win where they collide.
  const at = style.layers.findIndex((l) => l.id === "highway-name-path");
  style.layers.splice(at < 0 ? style.layers.length : at, 0, ...EXTRA_LAYERS);
  return style;
}

/** The pin's markup: a navy square holding the white JJM mark, with a notch below pointing at the spot. */
function pinElement() {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = "pointer-events:none;filter:drop-shadow(0 8px 14px rgba(23,53,93,.35))";
  el.innerHTML =
    '<div style="display:flex;width:52px;height:52px;align-items:center;justify-content:center;background:#17355d">' +
    '<img src="/brand/jjm-mark-white.svg" alt="" width="34" height="34" style="display:block;width:34px;height:34px"/></div>' +
    '<div style="width:18px;height:10px;margin:0 auto;background:#17355d;clip-path:polygon(0 0,100% 0,50% 100%)"></div>';
  return el;
}

type Props = {
  title: string;
  /** Google's plain embed, shown if the map can't load. */
  fallbackSrc: string;
  className?: string;
};

export default function BrandMap({ title, fallbackSrc, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;

    const start = async () => {
      try {
        const [{ default: maplibregl }, style] = await Promise.all([import("maplibre-gl"), brandStyle()]);
        if (cancelled) return;
        map = new maplibregl.Map({
          container: el,
          style,
          center: OFFICE,
          zoom: 15,
          maxZoom: 19,
          attributionControl: { compact: true },
          // Two fingers (or Ctrl/Cmd + scroll) to move the map, so the page still scrolls past it.
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
        new maplibregl.Marker({ element: pinElement(), anchor: "bottom" }).setLngLat(OFFICE).addTo(map);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // Load the map library only when the map is about to scroll into view.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void start();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  if (failed) {
    return <iframe title={title} src={fallbackSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className={`block w-full border-0 [filter:saturate(0.55)_contrast(0.95)] ${className}`} />;
  }

  return (
    <div className="relative w-full">
      <div className={`relative w-full overflow-hidden bg-frost ${className}`}>
        {/* Sized with h-full, not inset-0: MapLibre makes its container position: relative. */}
        <div ref={box} role="region" aria-label={title} className="brand-map h-full w-full" />
      </div>
      {/* The office card, in the site's style: over the map's top-left corner from md, under the map on phones
          (where it would cover the pin). */}
      <div className="bg-white px-5 py-4 md:absolute md:left-[clamp(12px,2vw,28px)] md:top-[clamp(12px,2vw,28px)] md:z-[2] md:shadow-[0_12px_32px_-12px_rgba(23,53,93,0.45)]">
        <p className="font-bold uppercase leading-tight text-navy">{company.name}</p>
        <p className="mt-1 text-[0.9375rem] leading-snug text-ink">
          8331 Eastlake Dr Unit 107,
          <br />
          Burnaby, BC V5A 4W2
        </p>
        <Button href={directionsHref} tone="solid" external className="mt-3">
          Get directions
        </Button>
      </div>
    </div>
  );
}
