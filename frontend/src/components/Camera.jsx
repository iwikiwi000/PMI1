import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Camera({ streamUrl, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <div>
      <h2>{title}</h2>
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
