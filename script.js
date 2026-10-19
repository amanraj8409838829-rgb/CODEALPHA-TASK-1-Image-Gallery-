// Replace these URLs with your own images (e.g. "images/photo1.jpg") if you like.
const photos = [
  {id:10,   cat:"nature",  title:"Forest light"},
  {id:15,   cat:"nature",  title:"Waterfall"},
  {id:29,   cat:"nature",  title:"Mountain road"},
  {id:1018, cat:"nature",  title:"Alpine peaks"},
  {id:237,  cat:"animals", title:"Black puppy"},
  {id:1025, cat:"animals", title:"Pug in a blanket"},
  {id:169,  cat:"animals", title:"Quiet companion"},
  {id:1074, cat:"animals", title:"Lion at rest"},
  {id:1031, cat:"places",  title:"Coastal town"},
  {id:1040, cat:"places",  title:"Castle by the water"},
  {id:164,  cat:"places",  title:"Old building"},
  {id:1067, cat:"places",  title:"Harbour view"}
].map(p => ({...p,
  thumb:`https://picsum.photos/id/${p.id}/500/375`,
  full:`https://picsum.photos/id/${p.id}/1200/900`}));

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
let visible = photos, current = 0, filter = "all";

function render() {
  visible = photos.filter(p => filter === "all" || p.cat === filter);
  gallery.innerHTML = "";
  visible.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "item";
    el.tabIndex = 0;
    el.innerHTML = `<img src="${p.thumb}" alt="${p.title}" loading="lazy"><div class="cap"><b>${p.title}</b><small>${p.cat}</small></div>`;
    el.addEventListener("click", () => open(i));
    el.addEventListener("keydown", e => { if (e.key === "Enter") open(i); });
    gallery.appendChild(el);
  });
}

function show() {
  const p = visible[current];
  lbImg.src = p.full;
  lbImg.alt = p.title;
  lbCap.textContent = `${p.title} (${current + 1}/${visible.length})`;
}
function open(i) { current = i; show(); lightbox.hidden = false; document.body.style.overflow = "hidden"; }
function close() { lightbox.hidden = true; document.body.style.overflow = ""; }
function step(d) { current = (current + d + visible.length) % visible.length; show(); }

document.querySelector(".filters").addEventListener("click", e => {
  if (e.target.tagName !== "BUTTON") return;
  document.querySelector(".filters .active").classList.remove("active");
  e.target.classList.add("active");
  filter = e.target.dataset.filter;
  render();
});
lightbox.querySelector(".close").onclick = close;
lightbox.querySelector(".prev").onclick = () => step(-1);
lightbox.querySelector(".next").onclick = () => step(1);
lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
// Touch swipe
let x0 = null;
lightbox.addEventListener("touchstart", e => x0 = e.touches[0].clientX);
lightbox.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  x0 = null;
});
render();
