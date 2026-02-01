let ytPlayer;
let isYT = false;

function isYouTube(url) {
  return /youtube\.com|youtu\.be/.test(url);
}

function extractYTID(url) {
  const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : null;
}

function loadYT(videoId) {
  isYT = true;
  document.getElementById("video").style.display = "none";
  document.getElementById("yt-player").style.display = "block";
  document.querySelector(".screenshot-btn").style.display = "none";

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player("yt-player", {
      videoId,
      playerVars: { controls:0, modestbranding:1, rel:0 }
    });
  };
}
