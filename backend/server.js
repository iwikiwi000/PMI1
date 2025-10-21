const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const port = 5000;
const publicRoutes = require("./routes/public");

app.use(express.json());

// Enable CORS for everything
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Serve the HLS folder **after enabling CORS**
app.use("/hls/cam1", cors(), express.static(path.join(__dirname, "hls", "cam1")));
app.use("/hls/cam2", cors(), express.static(path.join(__dirname, "hls", "cam2")));

const hlsFolder = path.join(__dirname, "hls");

const camStreams = [
  {
    name: "cam1",
    url: "rtsp://user:Km1kt_user@158.193.227.60:554/Streaming/Channels/101"
  },
  {
    name: "cam2",
    url: "rtsp://user:Km1kt_user@158.193.227.60:554/Streaming/Channels/201"
  }
];

camStreams.forEach(cam => {
  const camFolder = path.join(__dirname, "hls", cam.name);

  // Make folder if it doesn't exist
  const fs = require("fs");
  if (!fs.existsSync(camFolder)) fs.mkdirSync(camFolder, { recursive: true });

  const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport", "tcp",
    "-i", cam.url,
    "-c:v", "copy",
    "-c:a", "aac",
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments+omit_endlist",
    "-hls_segment_filename", path.join(camFolder, "segment_%03d.ts"),
    path.join(camFolder, "stream.m3u8")
  ]);

  ffmpeg.stderr.on("data", (data) => console.log(`[${cam.name}] FFmpeg: ${data}`));
  ffmpeg.on("close", (code) => console.log(`[${cam.name}] FFmpeg exited with code ${code}`));
});

// Session middleware
app.use(session({
  secret: "extremnetajnykluc",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use("/", publicRoutes);

app.get('/', (req, res) => {
  res.send('Backend running!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
