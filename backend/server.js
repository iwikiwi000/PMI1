const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const app = express();
const port = 5000;

// ⭐ IMPORTS MUSIA BYŤ HORE - PRED POUŽITÍM!
const publicRoutes = require("./routes/public");
const cameraRoutes = require("./routes/cameras");
const dbHndler = require("./database/dbHandler");
const { startStream, stopAllStreams, getStreamStatus } = require("./streamManager");
const ipWhitelist = require("./routes/ipWhitelist"); // ⭐ IP filter

app.use(express.json());

// ⭐ TRUST PROXY - aby sme dostali správnu IP adresu
app.set('trust proxy', true);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ⭐ IP WHITELIST - MUSÍ BYŤ PRED OSTATNÝMI ROUTES!
app.use(ipWhitelist);

app.use("/hls", express.static(path.join(__dirname, "public/hls")));

app.use(session({
  secret: "extremnetajnykluc",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// ⭐ TERAZ MÔŽEME INICIALIZOVAŤ STREAMY
// Initialize streams from database
(async () => {
  try {
    const cameras = await dbHndler.getCameras();
    console.log("🔍 DEBUG: Cameras from DB:", cameras);
    console.log(`📊 Found ${cameras.length} cameras in database`);
    
    if (cameras.length === 0) {
      console.log("⚠️ No cameras found in database!");
      return;
    }
    
    cameras.forEach(cam => {
      const name = cam.title.toLowerCase().replace(/\s+/g, "_");
      console.log(`🎥 Starting stream for: ${cam.title}`);
      console.log(`   Stream name: ${name}`);
      console.log(`   RTSP source: ${cam.source}`);
      console.log(`   HLS output: ${cam.link}`);
      
      try {
        startStream(name, cam.source);
        console.log(`✅ Stream ${name} started successfully`);
      } catch (err) {
        console.error(`❌ Failed to start stream ${name}:`, err);
      }
    });
    
    // Počkaj 2 sekundy a skontroluj status
    setTimeout(() => {
      const status = getStreamStatus();
      console.log("📊 Stream status after 2s:", JSON.stringify(status, null, 2));
    }, 2000);
    
  } catch (err) {
    console.error("❌ Error initializing streams:", err);
  }
})();

// API endpoint pre status streamov
app.get('/api/streams/status', (req, res) => {
  try {
    const status = getStreamStatus();
    res.json(status);
  } catch (error) {
    console.error('Chyba pri získavaní statusu streamov:', error);
    res.status(500).json({ error: 'Nepodarilo sa získať status streamov' });
  }
});

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