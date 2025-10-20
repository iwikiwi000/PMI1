import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Camera() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("http://localhost:5000/hls/stream.m3u8");
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = "http://localhost:5000/hls/stream.m3u8";
    }
  }, []);

  return (
    <div>
      <h2>Kamera 1</h2>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: "100%", borderRadius: "10px" }}
      />
    </div>
  );
}
