import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";

export default function Camera({ link, title, cameraName, bitrate = 0 }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // HLS video player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(link);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => {
          console.error("Chyba pri prehrávaní:", err);
        });
        setIsPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("Kritická chyba HLS:", data);
          setIsPlaying(false);
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = link;
      video.addEventListener("loadedmetadata", () => {
        video.play();
        setIsPlaying(true);
      });
    }
  }, [link]);

  return (
    <div style={{ 
      border: "2px solid #ff6b17", 
      borderRadius: "8px", 
      overflow: "hidden",
      backgroundColor: "#000"
    }}>
      <div style={{
        backgroundColor: "#ff6b17",
        color: "white",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontWeight: "bold" }}>{title}</span>
        <span style={{ 
          fontSize: "0.9em",
          backgroundColor: "rgba(255,255,255,0.2)",
          padding: "4px 8px",
          borderRadius: "4px"
        }}>
          {bitrate > 0 ? `${bitrate.toFixed(0)} kbps` : "Načítava sa..."}
        </span>
      </div>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "auto", display: "block" }}
        controls
        muted
        playsInline
      />
      {!isPlaying && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "1.2em"
        }}>
          Pripája sa...
        </div>
      )}
    </div>
  );
}