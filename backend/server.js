const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(helmet());

const port = 5000;

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const cameraRoutes = require("./routes/cameras");

const dbHndler = require("./database/dbHandler");
const { updateCamera } = dbHndler;
const { startStream, stopStream, stopAllStreams, getStreamStatus } = require("./streamManager");
const ipWhitelist = require("./routes/ipWhitelist");

app.use(express.json());

app.set('trust proxy', true);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(ipWhitelist);

app.use("/hls", express.static(path.join(__dirname, "public/hls")));

(async () => {
  try {
    const cameras = await dbHndler.getCameras();
    console.log("DEBUG: Kamery z DB:", cameras);
    console.log(`${cameras.length} v DB`);
    
    if (cameras.length === 0) {
      console.log("No cameras found in database!");
      return;
    }
    
    cameras.forEach(cam => {
      const name = cam.title.toLowerCase().replace(/\s+/g, "_");
      console.log(`Starting stream for: ${cam.title}`);
      console.log(`Stream name: ${name}`);
      console.log(`RTSP source: ${cam.source}`);
      console.log(`HLS output: ${cam.link}`);
      
      try {
        startStream(name, cam.source);
        console.log(`Stream ${name} started successfully`);
      } catch (err) {
        console.error(`Failed to start stream ${name}:`, err);
      }
    });
    
    //skontroluj status
    setTimeout(() => {
      const status = getStreamStatus();
      console.log("Stream status - 2s:", JSON.stringify(status, null, 2));
    }, 2000);
    
  } catch (err) {
    console.error("Error initializing streams:", err);
  }
})();

app.put('/api/cameras/:id', async (req, res) => {
    try {
        const { title, source, link } = req.body;
        await updateCamera(req.params.id, title, source, link);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use("/", publicRoutes);
app.use("/admin", authMiddleware, adminRoutes);
app.use("/cameras", authMiddleware, cameraRoutes);

app.get('/', (req, res) => {
  res.send('Backend idze!');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM stopped strem');
  stopAllStreams();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGTERM stopped strem');
  stopAllStreams();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server idzee on http://localhost:${port}`);
});
