import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";

export default function Camera({ link, title, cameraName, bitrate = 0, cameraId, onUpdate }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editovateľné polia
  const [editTitle, setEditTitle] = useState(title);
  const [editSource, setEditSource] = useState(cameraName);
  const [editLink, setEditLink] = useState(link);

  // Funkcia na uloženie zmien
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cameras/${cameraId}`, {
        title: editTitle,
        source: editSource,
        link: editLink
      });
      
      if (response.data.success) {
        alert("Kamera úspešne aktualizovaná!");
        setIsEditing(false);
        
        // Ak existuje callback na update, zavolaj ho
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err) {

      console.error("Chyba pri aktualizácii kamery:", err);
      alert("Nepodarilo sa aktualizovať kameru!", err);
    }
  };

  // Zrušenie editácie
  const handleCancel = () => {
    setEditTitle(title);
    setEditSource(cameraName);
    setEditLink(link);
    setIsEditing(false);
  };

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
    <div className="camera-container">
      <div className="camera-header">
        <span className="camera-title">{title}</span>
        <div className="camera-header-controls">
          <span className="bitrate-badge">
            {bitrate > 0 ? `${bitrate.toFixed(0)} kbps` : "Načítava sa..."}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`details-button ${showDetails ? "active" : ""}`}
          >
            ℹ️ Info
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-button ${isEditing ? "active" : ""}`}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <video
        ref={videoRef}
        className="camera-video"
        controls
        muted
        playsInline
      />

      {/* Rolovacia lišta s detailmi */}
      <div className={`details-panel ${showDetails ? "expanded" : ""}`}>
        <div className="details-content">
          <div className="detail-item">
            <strong>Názov kamery:</strong>
            <div className="detail-value">
              {cameraName || title}
            </div>
          </div>
          
          <div className="detail-item">
            <strong>URL adresa:</strong>
            <div className="detail-value url-display">
              {link}
            </div>
          </div>
        </div>
      </div>

      {/* Edit panel */}
      <div className={`edit-panel ${isEditing ? "expanded" : ""}`}>
        <div className="edit-content">
          <div className="form-group">
            <label>Názov kamery:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label>RTSP Source:</label>
            <input
              type="text"
              value={editSource}
              onChange={(e) => setEditSource(e.target.value)}
              className="edit-input monospace"
            />
          </div>

          <div className="form-group">
            <label>HLS Link:</label>
            <input
              type="text"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              className="edit-input monospace"
            />
          </div>

          <div className="edit-buttons">
            <button
              onClick={handleCancel}
              className="cancel-button"
            >
              Zrušiť
            </button>
            <button
              onClick={handleSave}
              className="save-button"
            >
              Uložiť
            </button>
          </div>
        </div>
      </div>
      {!isPlaying && (
        <div className="loading-overlay">
          Pripája sa...
        </div>
      )}
    </div>
  );
}