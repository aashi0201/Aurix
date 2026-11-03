import { ImageResponse } from "next/og";
export const alt = "Aurix Travels — Your next journey starts here";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#EAF6FF",
        padding: 80,
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#087AC7",
          fontSize: 26,
          letterSpacing: 5,
        }}
      >
        AURIX TRAVELS
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 74,
          color: "#102A43",
          marginTop: 40,
          lineHeight: 1.15,
        }}
      >
        Your next journey
        <br />
        starts here.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#526577",
          marginTop: 40,
        }}
      >
        Personal travel assistance. A world of possibilities.
      </div>
    </div>,
    size,
  );
}
