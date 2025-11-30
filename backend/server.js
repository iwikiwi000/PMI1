const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();
const port = 5000;
const publicRoutes = require("./routes/public");
const cameraRoutes = require("./routes/cameras");

const { startStream, stopAllStreams } = require("./streamManager");
const dbHndler = require("./database/dbHandler");

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/hls", express.static(path.join(__dirname, "public/hls")));

// Initialize streams from database
(async () => {
  try {
    const cameras = await dbHndler.getCameras();
    console.log(`Found ${cameras.length} cameras in database`);
    
    cameras.forEach(cam => {
      const name = cam.title.toLowerCase().replace(/\s+/g, "_");
      console.log(`Starting stream for: ${cam.title}`);
      console.log(`  RTSP source: ${cam.source}`);
      console.log(`  HLS output: ${cam.link}`);
      startStream(name, cam.source);
    });
  } catch (err) {
    console.error("Error initializing streams:", err);
  }
})();

app.use(session({
  secret: "extremnetajnykluc",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use("/", publicRoutes);
app.use("/", cameraRoutes);

app.get('/', (req, res) => {
  res.send('Backend running!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, stopping all streams...');
  stopAllStreams();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, stopping all streams...');
  stopAllStreams();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});