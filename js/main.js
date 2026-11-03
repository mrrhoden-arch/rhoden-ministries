// Site settings: fill in the YouTube video IDs (the part after "v=" or "/shorts/")
// as each video goes live. Cards without an ID open the YouTube channel instead.
const SITE = {
  youtube: "https://www.youtube.com/@RhodenMinistries",
  instagram: "https://www.instagram.com/revrhoden2026/",
};

const EPISODES = [
  { n: 1, title: "Grieve Before You Rebuild", ref: "Nehemiah 1", yt: "yK5tnVh25gM" },
  { n: 2, title: "Pray Before You Plan", ref: "Nehemiah 1", yt: "KEiYn-4VS3s" },
  { n: 3, title: "Inspect Before You Inspire", ref: "Nehemiah 2", yt: "zQTYH7I6uLI" },
  { n: 4, title: "Let Us Rise Up and Build", ref: "Nehemiah 2:17–20", yt: "" },
  { n: 5, title: "Everyone Builds", ref: "Nehemiah 3", yt: "" },
];

const SERMONS = [
  { title: "Called to Serve", ref: "Matthew 23:1–12", img: "sermon-called-to-serve", yt: "" },
  { title: "The Trap, the Image, the Return", ref: "Matthew 22:15–22", img: "sermon-trap-image-return", yt: "" },
];

const SHORTS = [
  { title: "We Are All Called to Serve", ref: "Matthew 23", img: "short-called-to-serve", yt: "o8NbmVAsg5E" },
  { title: "Before He Built Anything, He Wept", ref: "Nehemiah 1", img: "short-cried", yt: "ckq4FGf7HZI" },
  { title: "That's Not Guilt. That's Leadership.", ref: "Nehemiah 1", img: "short-not-guilt", yt: "gn4vpimTeRc" },
  { title: "Pastor, How Are Things? Really?", ref: "Nehemiah 1", img: "short-how-are-things", yt: "vG3fDaKSFjs" },
  { title: "Access Is Not the Same as Readiness", ref: "Nehemiah 1", img: "short-access", yt: "vdSI-9oleTM" },
  { title: "You Are Not Stamped. You Are Made.", ref: "Matthew 22", img: "short-not-stamped", yt: "" },
];

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function videoAttrs(v, vertical) {
  return `data-yt="${v.yt}"${vertical ? " data-vertical" : ""} aria-label="Play ${v.title}"`;
}

document.getElementById("episodes").innerHTML = EPISODES.map((e, i) => `
  <button class="episode reveal" style="--d:${i * 0.08}s" ${videoAttrs(e)}>
    <span class="ep-num">Episode ${ROMAN[e.n]}</span>
    <h3>${e.title}</h3>
    <span class="ep-ref">${e.ref}</span>
    <span class="play"></span>
  </button>`).join("");

document.getElementById("full-sermons").innerHTML = SERMONS.map((s, i) => `
  <button class="media-card reveal" style="--d:${i * 0.12}s" ${videoAttrs(s)}>
    <img src="media/thumbs/${s.img}.jpg" alt="" loading="lazy">
    <span class="play"></span>
    <span class="media-caption"><span>Full sermon · ${s.ref}</span></span>
  </button>`).join("");

document.getElementById("shorts").innerHTML = SHORTS.map((s, i) => `
  <button class="media-card reveal" style="--d:${i * 0.07}s" ${videoAttrs(s, true)}>
    <img src="media/thumbs/${s.img}.jpg" alt="" loading="lazy">
    <span class="play"></span>
  </button>`).join("");

// Social links
document.querySelectorAll("#yt-link, [data-yt-link]").forEach(a => (a.href = SITE.youtube));
document.querySelectorAll("#ig-link, [data-ig-link]").forEach(a => (a.href = SITE.instagram));
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky nav + active section
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const toggle = nav.querySelector(".nav-toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
nav.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}));

const links = [...nav.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

// Fade-up on scroll
const revealObserver = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Count the numbers up when the stats row comes into view
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const countObserver = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  countObserver.unobserve(en.target);
  const el = en.target, end = +el.dataset.count;
  const start = end > 1000 ? end - 30 : 0, t0 = performance.now(), dur = 1600;
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (end - start) * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}), { threshold: 0.6 });
if (!reduceMotion) document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

// Pause the hero video when it's off screen or the visitor prefers less motion
const heroVideo = document.querySelector(".hero-video");
if (reduceMotion) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
} else {
  new IntersectionObserver(([en]) => (en.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause()))
    .observe(heroVideo);
}

// Video lightbox
const lightbox = document.getElementById("lightbox");
const frame = lightbox.querySelector(".lightbox-frame");
let lastFocus = null;

function openVideo(id, vertical) {
  lastFocus = document.activeElement;
  frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  lightbox.classList.toggle("vertical", vertical);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}
function closeVideo() {
  lightbox.hidden = true;
  frame.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("click", e => {
  const card = e.target.closest("[data-yt]");
  if (!card) return;
  if (card.dataset.yt) openVideo(card.dataset.yt, card.hasAttribute("data-vertical"));
  else window.open(SITE.youtube, "_blank", "noopener");
});
lightbox.addEventListener("click", e => { if (e.target === lightbox || e.target.closest(".lightbox-close")) closeVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeVideo(); });

// "Book Me to Speak" / "Start a Conversation" preselect the form topic
document.querySelectorAll("[data-topic]").forEach(btn => btn.addEventListener("click", () => {
  const radio = document.querySelector(`.topic input[value="${btn.dataset.topic}"]`);
  if (radio) radio.checked = true;
}));

// Inquiry form: send in the background and thank the visitor
const form = document.getElementById("inquiry");
const note = form.querySelector(".form-note");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  note.textContent = "Sending…";
  try {
    const res = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    note.textContent = "Thank you. Your message has been sent, and Rev. Rhoden will be in touch soon.";
  } catch {
    note.textContent = "Sorry, something went wrong. Please try again in a moment.";
  } finally {
    button.disabled = false;
  }
});
