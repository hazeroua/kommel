import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// runtime: nodejs (default in Next.js 16, edge is deprecated)
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FBF4EF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fond décoratif — self-closing equiv via empty content */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#E8635A",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#1E4FB0",
            opacity: 0.1,
          }}
        />

        {/* Pastille type */}
        <div
          style={{
            display: "flex",
            background: "#F5B24C",
            color: "#4A3433",
            fontSize: 22,
            fontWeight: 800,
            padding: "10px 28px",
            borderRadius: 999,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          Association
        </div>

        {/* Nom */}
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 900,
            color: "#4A3433",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          {"KOM"}
          <span style={{ color: "#E8635A" }}>{"'"}</span>
          {"MEL"}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#7A6463",
            maxWidth: 720,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {site.tagline}
        </div>

        {/* URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 40,
            right: 56,
            fontSize: 20,
            color: "#B0A09F",
          }}
        >
          kommel.fr
        </div>
      </div>
    ),
    { ...size },
  );
}
