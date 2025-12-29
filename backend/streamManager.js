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
  
  // ⭐ Nastavený target bitrate (video + audio)
  const targetVideoBitrate = 2000; // kbps
  const targetAudioBitrate = 128;  // kbps
  const targetTotalBitrate = targetVideoBitrate + targetAudioBitrate;

  console.log(`🎥 Starting stream: ${name}`);
  console.log(`   RTSP: ${rtspUrl}`);
  console.log(`   Output: ${outputPath}`);

  const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport", "tcp",
    "-timeout", "5000000",
    "-i", rtspUrl,

    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",
    "-b:v", "2000k",

    "-c:a", "aac",
    "-b:a", "128k",

    // LOW LATENCY HLS
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments+append_list",
    "-hls_segment_filename", path.join(hlsDir, "segment%03d.ts"),

    "-y",
    outputPath
  ], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let connectionEstablished = false;
  let outputStarted = false;

  // ⭐ PRAVIDELNÉ MERANIE BITRATE - každú sekundu
  const bitrateInterval = setInterval(() => {
    const streamData = streams.get(name);
    if (!streamData) {
      clearInterval(bitrateInterval);
      return;
    }

    const hlsDir = path.join(__dirname, "public", "hls", name);
    
    if (fs.existsSync(hlsDir)) {
      const segments = fs.readdirSync(hlsDir).filter(f => f.endsWith('.ts'));
      
      if (segments.length > 0) {
        // Vezmeme posledný segment (najnovší)
        const latestSegment = segments[segments.length - 1];
        const segPath = path.join(hlsDir, latestSegment);
        
        try {
          const stats = fs.statSync(segPath);
          // Segment je 1 sekunda, takže: (bytes * 8) / 1000 = kbps
          const currentBitrate = Math.round((stats.size * 8) / 1000);
          
          if (currentBitrate > 0) {
            streamData.bitrate = currentBitrate;
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }, 1000); // Každú sekundu

  // SAVE BITRATE - použijeme target bitrate ako začiatočnú hodnotu
  streams.set(name, {
    process: ffmpeg,
    rtspUrl,
    bitrate: targetTotalBitrate,  // Začiatočná hodnota
    lastUpdate: Date.now(),
    bitrateInterval: bitrateInterval  // ⭐ Uložíme interval aby sme ho mohli zastaviť
  });

  console.log(`✅ ${name}: Target bitrate nastavený na ${targetTotalBitrate} kbps`);

  ffmpeg.stdout.on("data", (data) => {
    console.log(`📺 FFmpeg ${name} stdout: ${data.toString().trim()}`);
  });

  ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();

    // ⭐ Skúsime parsovaÅ¥ skutočný bitrate, ak existuje
    // Formát 1: "bitrate=2000.5kbits/s" alebo "bitrate=2.5Mbits/s"
    const bitrateMatch = output.match(/bitrate=\s*([\d.]+)\s*([km])bits\/s/i);
    
    if (bitrateMatch) {
      let kbps = parseFloat(bitrateMatch[1]);
      const unit = bitrateMatch[2].toLowerCase();
      
      if (unit === 'm') {
        kbps = kbps * 1000;
      }
      
      const streamData = streams.get(name);
      if (streamData && kbps > 0) {
        streamData.bitrate = kbps;
        streamData.lastUpdate = Date.now();
        console.log(`📊 ${name}: Skutočný bitrate = ${kbps.toFixed(0)} kbps`);
      }
    }

    if (output.includes("Input #0")) {
      connectionEstablished = true;
      console.log(`✅ ${name}: Connected to RTSP stream`);
    }

    if (output.includes("Opening") && output.includes("stream.m3u8")) {
      outputStarted = true;
      console.log(`✅ ${name}: Started writing HLS playlist`);
    }

    if (output.includes("error") || output.includes("Error") ||
        output.includes("warning") || output.includes("Warning")) {
      console.log(`⚠️ FFmpeg ${name}: ${output.trim()}`);
    }

    if (output.includes("frame=") || output.includes("time=")) {
      if (Math.random() < 0.02) {
        console.log(`📊 ${name}: ${output.match(/frame=\s*\d+|time=[\d:.]+/g)?.join(', ')}`);
      }
    }
  });

  ffmpeg.on("error", (err) => {
    console.error(`❌ FFmpeg ${name} spawn error:`, err.message);
    streams.delete(name);

    setTimeout(() => {
      console.log(`🔄 Retrying stream: ${name}`);
      startStream(name, rtspUrl);
    }, 10000);
  });

  ffmpeg.on("close", (code) => {
    console.log(`ℹ️ FFmpeg ${name} exited with code ${code}`);
    streams.delete(name);

    if (code !== 0 && code !== 255) {
      setTimeout(() => {
        console.log(`🔄 Restarting stream: ${name}`);
        startStream(name, rtspUrl);
      }, 5000);
    }
  });

  setTimeout(() => {
    if (!connectionEstablished) {
      console.error(`❌ ${name}: Failed to connect to RTSP stream after 10s`);
      return;
    }

    if (!outputStarted) {
      console.error(`❌ ${name}: Connected but no HLS output after 10s`);
      return;
    }

    console.log(`✅ ${name}: Stream is working correctly`);

    const m3u8Exists = fs.existsSync(outputPath);
    const segmentExists = fs.readdirSync(hlsDir).some(f => f.endsWith('.ts'));

    if (m3u8Exists && segmentExists) {
      console.log(`✅ ${name}: HLS files created successfully`);
    } else {
      console.error(`❌ ${name}: HLS files not found`);
    }
  }, 10000);
}

function stopStream(name) {
  const stream = streams.get(name);
  if (stream) {
    console.log(`🛑 Stopping stream: ${name}`);
    
    // ⭐ Zastav bitrate meranie
    if (stream.bitrateInterval) {
      clearInterval(stream.bitrateInterval);
    }
    
    stream.process.kill("SIGTERM");
    streams.delete(name);

    setTimeout(() => {
      const hlsDir = path.join(__dirname, "public", "hls", name);
      if (fs.existsSync(hlsDir)) {
        try {
          fs.rmSync(hlsDir, { recursive: true, force: true });
          console.log(`🗑️ Cleaned up HLS directory: ${name}`);
        } catch (err) {
          console.error(`❌ Failed to clean up ${name}:`, err.message);
        }
      }
    }, 1000);
  }
}

function stopAllStreams() {
  console.log("🛑 Stopping all streams...");
  streams.forEach((stream, name) => stopStream(name));
}

function getStreamStatus() {
  const status = {};
  streams.forEach((stream, name) => {
    const hlsDir = path.join(__dirname, "public", "hls", name);
    const m3u8Path = path.join(hlsDir, "stream.m3u8");

    status[name] = {
      running: true,
      rtspUrl: stream.rtspUrl,
      bitrate: stream.bitrate,  // ⭐ Tento sa už aktualizuje každú sekundu!
      playlistExists: fs.existsSync(m3u8Path),
      segmentCount: fs.existsSync(hlsDir)
        ? fs.readdirSync(hlsDir).filter(f => f.endsWith('.ts')).length
        : 0
    };
  });
  return status;
}

module.exports = { startStream, stopStream, stopAllStreams, getStreamStatus };