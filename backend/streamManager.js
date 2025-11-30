const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const streams = new Map();

function startStream(name, rtspUrl) {
  if (streams.has(name)) {
    console.log(`Stream ${name} already running`);
    return;
  }

  const hlsDir = path.join(__dirname, "public", "hls", name);
  if (!fs.existsSync(hlsDir)) {
    fs.mkdirSync(hlsDir, { recursive: true });
    console.log(`✅ Created directory: ${hlsDir}`);
  }

  const outputPath = path.join(hlsDir, "stream.m3u8");

  console.log(`🎥 Starting stream: ${name}`);
  console.log(`   RTSP: ${rtspUrl}`);
  console.log(`   Output: ${outputPath}`);

  const ffmpeg = spawn("ffmpeg", [
    // Input options
    "-rtsp_transport", "tcp",
    "-timeout", "5000000", // 5 second timeout
    "-i", rtspUrl,
    
    // Video codec
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",
    "-b:v", "2000k",
    
    // Audio codec
    "-c:a", "aac",
    "-b:a", "128k",
    
    // HLS options
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments+append_list",
    "-hls_segment_filename", path.join(hlsDir, "segment%03d.ts"),
    
    // Force overwrite
    "-y",
    
    outputPath
  ], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let connectionEstablished = false;
  let outputStarted = false;

  ffmpeg.stdout.on("data", (data) => {
    console.log(`📺 FFmpeg ${name} stdout: ${data.toString().trim()}`);
  });

  ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();
    
    // Check for connection
    if (output.includes("Input #0")) {
      connectionEstablished = true;
      console.log(`✅ ${name}: Connected to RTSP stream`);
    }
    
    // Check for output start
    if (output.includes("Opening") && output.includes("stream.m3u8")) {
      outputStarted = true;
      console.log(`✅ ${name}: Started writing HLS playlist`);
    }
    
    // Show important messages
    if (output.includes("error") || output.includes("Error") || 
        output.includes("warning") || output.includes("Warning")) {
      console.log(`⚠️  FFmpeg ${name}: ${output.trim()}`);
    }
    
    // Show periodic status updates
    if (output.includes("frame=") || output.includes("time=")) {
      // Only log every 50th frame update to avoid spam
      if (Math.random() < 0.02) {
        console.log(`📊 ${name}: ${output.match(/frame=\s*\d+|time=[\d:.]+/g)?.join(', ')}`);
      }
    }
  });

  ffmpeg.on("error", (err) => {
    console.error(`❌ FFmpeg ${name} spawn error:`, err.message);
    streams.delete(name);
    
    // Retry after 10 seconds
    setTimeout(() => {
      console.log(`🔄 Retrying stream: ${name}`);
      startStream(name, rtspUrl);
    }, 10000);
  });

  ffmpeg.on("close", (code) => {
    console.log(`⏹️  FFmpeg ${name} exited with code ${code}`);
    streams.delete(name);
    
    // Auto-restart if it wasn't a clean shutdown
    if (code !== 0 && code !== 255) {
      setTimeout(() => {
        console.log(`🔄 Restarting stream: ${name}`);
        startStream(name, rtspUrl);
      }, 5000);
    }
  });

  // Check if stream is working after 10 seconds
  setTimeout(() => {
    if (!connectionEstablished) {
      console.error(`❌ ${name}: Failed to connect to RTSP stream after 10s`);
      console.error(`   Check if the RTSP URL is correct and accessible`);
    } else if (!outputStarted) {
      console.error(`❌ ${name}: Connected but no HLS output after 10s`);
    } else {
      console.log(`✅ ${name}: Stream is working correctly`);
      
      // Check if files were created
      const m3u8Exists = fs.existsSync(outputPath);
      const segmentExists = fs.readdirSync(hlsDir).some(f => f.endsWith('.ts'));
      
      if (m3u8Exists && segmentExists) {
        console.log(`✅ ${name}: HLS files created successfully`);
        console.log(`   📁 Playlist: ${outputPath}`);
        console.log(`   📁 Segments: ${hlsDir}`);
      } else {
        console.error(`❌ ${name}: HLS files not found`);
        console.log(`   Playlist exists: ${m3u8Exists}`);
        console.log(`   Segments exist: ${segmentExists}`);
      }
    }
  }, 10000);

  streams.set(name, { process: ffmpeg, rtspUrl });
}

function stopStream(name) {
  const stream = streams.get(name);
  if (stream) {
    console.log(`🛑 Stopping stream: ${name}`);
    stream.process.kill("SIGTERM");
    streams.delete(name);

    // Clean up HLS files after a delay
    setTimeout(() => {
      const hlsDir = path.join(__dirname, "public", "hls", name);
      if (fs.existsSync(hlsDir)) {
        try {
          fs.rmSync(hlsDir, { recursive: true, force: true });
          console.log(`🗑️  Cleaned up HLS directory: ${name}`);
        } catch (err) {
          console.error(`❌ Failed to clean up ${name}:`, err.message);
        }
      }
    }, 1000);
  }
}

function stopAllStreams() {
  console.log("🛑 Stopping all streams...");
  streams.forEach((stream, name) => {
    stopStream(name);
  });
}

function getStreamStatus() {
  const status = {};
  streams.forEach((stream, name) => {
    const hlsDir = path.join(__dirname, "public", "hls", name);
    const m3u8Path = path.join(hlsDir, "stream.m3u8");
    
    status[name] = {
      running: true,
      rtspUrl: stream.rtspUrl,
      playlistExists: fs.existsSync(m3u8Path),
      segmentCount: fs.existsSync(hlsDir) 
        ? fs.readdirSync(hlsDir).filter(f => f.endsWith('.ts')).length 
        : 0
    };
  });
  return status;
}

module.exports = { startStream, stopStream, stopAllStreams, getStreamStatus };