import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Camera({ link, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    if (link && videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 10,
        });
        hls.loadSource(link);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = link;
      }
    }

    // cleanup on unmount or link change
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [link]);

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "8px" }}>{title}</h3>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          borderRadius: "10px",
          background: "#000",
        }}
      />
    </div>
  );
}
