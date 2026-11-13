import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vinayak Maheshwari — CalC";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#141210",
          color: "#e9e4da",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: "#d97e54",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9b9488",
            }}
          >
            vinm.me
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Vinayak Maheshwari
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 30,
              color: "#9b9488",
            }}
          >
            storage engines · self-hosted platforms · developer tools
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#9b9488",
            borderTop: "1px solid #2b2823",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>github.com/07calc</div>
          <div style={{ display: "flex", color: "#d97e54" }}>who am i without my silliness? a calc.</div>
        </div>
      </div>
    ),
    size
  );
}
