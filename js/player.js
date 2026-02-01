const params = new URLSearchParams(location.search);
const url = params.get("url");

const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const progress = document.querySelector(".progress");
const progressFill = document.querySelector(".progress-filled");
const timeText = document.getElementById("time");
const controls = document.getElementById("controls");
const settingsMenu = document.getElementById("settings-menu");

let hideTimer;

// PLAYER TYPE
if (isYouTube(url)) {
  loadYT(extractYTID(url));
} else {
  if (Hls.isSupported() && url.endsWith(".m3u8")) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}

// PLAY / PAUSE
playBtn.onclick = () => {
  if (isYT) {
    ytPlayer.getPlayerState() === 1 ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
  } else {
    video.paused ? video.play() : video.pause();
  }
};

// SEEK
progress.onclick = e => {
  if (isYT) return;
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
};

// UPDATE TIME
video.ontimeupdate = () => {
  progressFill.style.width = (video.currentTime / video.duration) * 100 + "%";
  timeText.textContent =
    format(video.currentTime) + " / " + format(video.duration);
};

// FULLSCREEN
document.getElementById("fullscreen").onclick = () =>
  document.getElementById("player-container").requestFullscreen();

// SETTINGS
document.getElementById("settings").onclick = () =>
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";

// SPEED
document.getElementById("speed").oninput = e => {
  if (isYT) ytPlayer.setPlaybackRate(+e.target.value);
  else video.playbackRate = e.target.value;
};

// SCREENSHOT
document.querySelector(".screenshot-btn").onclick = () => {
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  c.getContext("2d").drawImage(video, 0, 0);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = "screenshot.png";
  a.click();
};

// AUTO HIDE
document.onmousemove = () => {
  controls.style.opacity = 1;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    controls.style.opacity = 0;
    settingsMenu.style.display = "none";
  }, 5000);
};

function format(t) {
  if (!t) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
