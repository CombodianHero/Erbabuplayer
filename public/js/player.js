const params = new URLSearchParams(location.search);
const url = params.get("url");

const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const progress = document.querySelector(".progress");
const progressFill = document.querySelector(".progress-filled");
const timeText = document.getElementById("time");
const controls = document.getElementById("controls");
const settingsMenu = document.getElementById("settings-menu");

const speedInput = document.getElementById("speed");
const qualitySelect = document.getElementById("quality");

let hideTimer;

// Player type detection
if (isYouTube(url)) {
  loadYT(extractYTID(url));
} else {
  if (Hls.isSupported() && url.endsWith(".m3u8")) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setupQualityOptions(hls);
    });
  } else {
    video.src = url;
  }
}

// Play / Pause
playBtn.onclick = () => {
  if (isYT) {
    ytPlayer.getPlayerState() === 1 ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
  } else video.paused ? video.play() : video.pause();
};

// Seek
progress.onclick = e => {
  if (isYT) return;
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
};

// Update time
video.ontimeupdate = () => {
  progressFill.style.width = (video.currentTime / video.duration)*100 + "%";
  timeText.textContent = format(video.currentTime) + " / " + format(video.duration);
};

// Fullscreen with auto rotation
document.getElementById("fullscreen").onclick = () => {
  const container = document.getElementById("player-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// Detect fullscreen change to auto rotate / reset
document.addEventListener("fullscreenchange", () => {
  const container = document.getElementById("player-container");
  if (document.fullscreenElement) {
    container.style.transform = "rotate(90deg)";
  } else {
    container.style.transform = "rotate(0deg)";
  }
  container.style.transition = "transform 0.3s";
});

// Settings toggle
document.getElementById("settings").onclick = () =>
  settingsMenu.style.display = settingsMenu.style.display==="block"?"none":"block";

// Speed
speedInput.oninput = e => {
  if (isYT) ytPlayer.setPlaybackRate(+e.target.value);
  else video.playbackRate = e.target.value;
};

// Screenshot
document.querySelector(".screenshot-btn").onclick = () => {
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  c.getContext("2d").drawImage(video,0,0);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = "screenshot.png";
  a.click();
};

// Auto-hide controls
document.onmousemove = () => {
  controls.style.opacity = 1;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(()=>{
    controls.style.opacity = 0;
    settingsMenu.style.display = "none";
  },5000);
};

// Format time
function format(t){ if(!t) return "00:00"; const m=Math.floor(t/60); const s=Math.floor(t%60); return `${m}:${s.toString().padStart(2,"0")}`; }

// -----------------------------
// QUALITY HANDLER (HLS)
function setupQualityOptions(hls) {
  if(!hls.levels) return;
  qualitySelect.innerHTML = "<option value='auto'>Auto</option>";
  hls.levels.forEach((lvl, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = lvl.height + "p";
    qualitySelect.appendChild(option);
  });

  qualitySelect.onchange = () => {
    if(qualitySelect.value === "auto") {
      hls.currentLevel = -1; // Auto
    } else {
      hls.currentLevel = parseInt(qualitySelect.value);
    }
  };
}
