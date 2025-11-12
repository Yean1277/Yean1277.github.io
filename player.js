// Professional Audio Player Script
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Update play/pause button icon
function updatePlayIcon() {
  playBtn.innerHTML = `<span>${audio.paused ? "&#9654;" : "&#10073;&#10073;"}</span>`;
}

// Play or pause
playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play();
  else audio.pause();
});
audio.addEventListener("play", updatePlayIcon);
audio.addEventListener("pause", updatePlayIcon);
audio.addEventListener("ended", () => { playBtn.innerHTML = `<span>&#9654;</span>`; });

// Mute/unmute
function setMuteState(muted) {
  audio.muted = muted;
  muteBtn.innerHTML = `<span>${muted ? "&#128263;" : "&#128266;"}</span>`;
  localStorage.setItem('audioPlayerMuted', muted ? "1" : "0");
}
// Restore state
setMuteState(localStorage.getItem('audioPlayerMuted') === "1");
muteBtn.addEventListener("click", () => {
  setMuteState(!audio.muted);
});

// Format time as mm:ss
function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s<10?"0":""}${s}`;
}

// Update progress/time
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("durationchange", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("ended", () => {
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
});

// Seek on click
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
});

// For accessibility, enable keyboard seeking
progressContainer.tabIndex = 0;
progressContainer.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
});

// Optional: preload cover, artist, track info from JS for future playlist/expansion
// Example for one track:
document.getElementById('trackTitle').textContent = "Star Journey";
document.getElementById('trackArtist').textContent = "Yean";
// document.getElementById('trackCover').src = "cover.jpg";
