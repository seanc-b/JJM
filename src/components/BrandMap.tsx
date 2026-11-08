"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { company } from "@/content/home";

/**
 * The "Find us" map, in the site's colours: pale grey-blue land, white roads, muted labels, no business
 * icons, and a navy JJM pin (a square with the flame mark and a notch pointing at the spot, like the navy
 * bar above the map). A card in the corner names the office with a Get directions button.
 *
 * It uses the Google Maps JavaScript API, which needs a key in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (see
 * .env.example). Without one, or if the API fails to load, it falls back to Google's plain embed.
 */

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** 8331 Eastlake Dr Unit 107, Burnaby. */
const OFFICE = { lat: 49.25902, lng: -122.92251 };

const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${company.name}, ${company.address}`)}`;

/** Brand palette for Google's map styling: frost land, white roads, ink labels, glacier-tinted water. */
const STYLES = [
  { elementType: "geometry", stylers: [{ color: "#e9ecf2" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5d6b7b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#e9ecf2" }, { weight: 3 }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#17355d" }] },
  { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ color: "#3e4d5d" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#e1e5ee" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", stylers: [{ visibility: "on" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8e2ea" }] },
  { featureType: "poi.park", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#3e4d5d" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 3 }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c3c8d5" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#17355d" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfd6ec" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3f74b7" }] },
];

// The Maps API is loaded at runtime from Google, so it has no types here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Google = any;

/** Loads the Maps JavaScript API once per page, however many maps ask for it. */
let loading: Promise<Google> | null = null;
function loadMaps(key: string): Promise<Google> {
  const w = window as unknown as { google?: Google; __jjmMapsReady?: () => void };
  if (w.google?.maps?.Map) return Promise.resolve(w.google);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    w.__jjmMapsReady = () => resolve(w.google);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&callback=__jjmMapsReady`;
    script.async = true;
    script.onerror = () => {
      loading = null;
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** The pin's markup: a navy square holding the white JJM mark, with a notch below pointing at the spot. */
function pinElement() {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = "position:absolute;transform:translate(-50%,-100%);pointer-events:none;filter:drop-shadow(0 8px 14px rgba(23,53,93,.35))";
  el.innerHTML =
    '<div style="display:flex;width:52px;height:52px;align-items:center;justify-content:center;background:#17355d">' +
    '<img src="/brand/jjm-mark-white.svg" alt="" width="34" height="34" style="display:block;width:34px;height:34px"/></div>' +
    '<div style="width:18px;height:10px;margin:0 auto;background:#17355d;clip-path:polygon(0 0,100% 0,50% 100%)"></div>';
  return el;
}

type Props = {
  title: string;
  /** The plain Google embed, shown without an API key. */
  fallbackSrc: string;
  className?: string;
};

export default function BrandMap({ title, fallbackSrc, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!KEY || !box.current) return;
    let cancelled = false;
    let overlay: Google = null;
    loadMaps(KEY)
      .then((google) => {
        if (cancelled || !box.current) return;
        const map = new google.maps.Map(box.current, {
          center: OFFICE,
          zoom: 15,
          styles: STYLES,
          backgroundColor: "#e9ecf2",
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          // Two fingers (or Ctrl/Cmd + scroll) to move the map, so the page still scrolls past it.
          gestureHandling: "cooperative",
        });

        // The pin is an HTML overlay pinned to the office's coordinates.
        class Pin extends google.maps.OverlayView {
          el = pinElement();
          onAdd() {
            this.getPanes().overlayMouseTarget.appendChild(this.el);
          }
          draw() {
            const p = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(OFFICE));
            if (p) {
              this.el.style.left = `${p.x}px`;
              this.el.style.top = `${p.y}px`;
            }
          }
          onRemove() {
            this.el.remove();
          }
        }
        overlay = new Pin();
        overlay.setMap(map);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      overlay?.setMap(null);
    };
  }, []);

  if (!KEY || failed) {
    return <iframe title={title} src={fallbackSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className={`block w-full border-0 [filter:saturate(0.55)_contrast(0.95)] ${className}`} />;
  }

  return (
    <div className={`relative w-full bg-frost ${className}`}>
      <div ref={box} role="region" aria-label={title} className="absolute inset-0" />
      {/* The office card, in the site's style, over the map's top-left corner. */}
      <div className="absolute left-[clamp(12px,2vw,28px)] top-[clamp(12px,2vw,28px)] max-w-[calc(100%-24px)] bg-white px-5 py-4 shadow-[0_12px_32px_-12px_rgba(23,53,93,0.45)]">
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
