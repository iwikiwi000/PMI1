const express = require("express");
const dbHndler = require("../database/dbHandler");
const { startStream, stopStream, getStreamStatus } = require("../streamManager");
const router = express.Router();

router.get("/cameras", async (req, res) => {
  try {
    const cameras = await dbHndler.getCameras();
    res.json(cameras);
  } catch (err) {
    console.error("Chyba pri získavaní kamier:", err);
    res.status(500).json({ message: "Chyba servera pri získavaní kamier" });
  }
});

// Debug endpoint to check stream status
router.get("/streams/status", (req, res) => {
  const status = getStreamStatus();
  res.json(status);
});

router.post("/cameras", async (req, res) => {
  const { title, source } = req.body;
  const name = title.toLowerCase().replace(/\s+/g, "_");

  try {
    const hlsLink = `http://localhost:5000/hls/${name}/stream.m3u8`;
    
    // Add to database first
    await dbHndler.addCamera(title, source, hlsLink);
    
    // Then start the stream
    startStream(name, source);

    res.status(201).json({ 
      message: "Kamera pridaná", 
      link: hlsLink,
      name: name
    });
  } catch (err) {
    console.error("Error adding camera:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/cameras/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const camera = await dbHndler.getCameraById(id);
    if (!camera) return res.status(404).json({ message: "Kamera nenájdená" });

    const name = camera.title.toLowerCase().replace(/\s+/g, "_");
    stopStream(name);

    await dbHndler.removeCamera(id);
    res.status(200).json({ message: "Kamera odstránená" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;