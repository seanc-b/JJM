import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { company } from "@/content/home";

/**
 * The image shown when a page is shared (Facebook, LinkedIn, iMessage, Slack…): the hero photo under the
 * site's navy tint, the white logo, and what JJM does and where. Generated once at build time. Inner
 * pages inherit it.
 */
export const alt = "JJM Mechanical Group: plumbing, heating, gas fitting and backflow certification in Burnaby, BC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();

export default async function Image() {
  const [photo, logo] = await Promise.all([
    readFile(join(root, "public/images/hero-navien-plant-room.jpg")),
    readFile(join(root, "public/brand/jjm-logo-white.svg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#fff" }}>
        <img src={photoSrc} alt="" width={1200} height={656} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        {/* The site's photo tint: navy, deeper on the right where the text sits. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(90deg, rgba(23,53,93,0.82) 0%, rgba(23,53,93,0.86) 55%, rgba(23,53,93,0.94) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: "100%" }}>
          <img src={logoSrc} alt="" width={370} height={120} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 60, lineHeight: 1.08, letterSpacing: "-0.01em", textTransform: "uppercase", maxWidth: 900 }}>
              Plumbing, heating, gas fitting &amp; backflow
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30, fontSize: 30, color: "#c3c8d5" }}>
              <span>Burnaby &amp; the Lower Mainland</span>
              <span style={{ width: 9, height: 9, borderRadius: 9, background: "#5ab8ee" }} />
              <span style={{ color: "#fff" }}>{company.phone}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    // The image renderer's built-in sans: it can't read Work Sans, which is installed only as a variable font.
    size,
  );
}
