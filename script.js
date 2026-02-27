// ===== Demo data =====
const PRODUCTS = [
  {
    id: "p1",
    cat: "Racer",
    title: "Carbon racer — let og hurtig",
    location: "København",
    price: 12999,
    hot: true,
    img: "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1200&q=70",
    likes: 30
  },
  {
    id: "p2",
    cat: "Racer",
    title: "Gravel bike — klar til eventyr",
    location: "Aarhus",
    price: 8999,
    hot: true,
    img: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=1200&q=70",
    likes: 12
  },
  {
    id: "p3",
    cat: "MTB",
    title: "MTB hardtail — super stand",
    location: "Odense",
    price: 5400,
    hot: true,
    img: "https://images.unsplash.com/photo-1501706362039-c6e80948d29b?auto=format&fit=crop&w=1200&q=70",
    likes: 11
  },
  {
    id: "p4",
    cat: "MTB",
    title: "Full suspension — trail ready",
    location: "Aalborg",
    price: 15500,
    hot: true,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=70",
    likes: 3
  },
  {
    id: "p5",
    cat: "Dele",
    title: "Hjulset — letvægts alu",
    location: "Roskilde",
    price: 2200,
    hot: false,
    img: "https://images.unsplash.com/photo-1520975693411-6f14c8a4f2e4?auto=format&fit=crop&w=1200&q=70",
    likes: 8
  },
  {
    id: "p6",
    cat: "Tilbehør",
    title: "Hjelm — som ny (M)",
    location: "Kolding",
    price: 550,
    hot: false,
    img: "https://images.unsplash.com/photo-1520975869018-1c3b3b7a0f5a?auto=format&fit=crop&w=1200&q=70",
    likes: 6
  },
  {
    id: "p7",
    cat: "Tøj",
    title: "Vinterjakke — vind & regn",
    location: "Hillerød",
    price: 650,
    hot: false,
    img: "https://images.unsplash.com/photo-1520976002688-0b2ea9f9b2d1?auto=format&fit=crop&w=1200&q=70",
    likes: 4
  },
  {
    id: "p8",
    cat: "Racer",
    title: "Racer — perfekt til træning",
    location: "Esbjerg",
    price: 7200,
    hot: false,
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=70",
    likes: 10
  }
];

// ===== State =====
let visibleCount = 4;
let currentCat = "Alle";
let currentQuery = "";

// Like state saved in localStorage
const liked = new Set(JSON.parse(localStorage.getItem("liked_ids") || "[]"));
const likesDelta = JSON.parse(localStorage.getItem("likes_delta") || "{}"); // {id: +1/-1}

// ===== Helpers =====
function formatDKK(n){
  return n.toLocaleString("da-DK") + " kr.";
}

function applyLikes(p){
  const delta = likesDelta[p.id] || 0;
  return p.likes + delta;
}

function filteredProducts(){
  return PRODUCTS
    .filter(p => currentCat === "Alle" ? true : p.cat === currentCat)
    .filter(p => {
      if(!currentQuery) return true;
      const q = currentQuery.toLowerCase();
      return (p.title + " " + p.location + " " + p.cat).toLowerCase().includes(q);
    });
}

function cardHTML(p){
  const isLiked = liked.has(p.id);
  const likes = applyLikes(p);

  return `
    <article class="card" data-id="${p.id}">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}">
        ${p.hot ? `<div class="badge">Meget efterspurgt</div>` : ``}

        <div class="like">
          <button class="like-btn" aria-label="Like">${isLiked ? "♥" : "♡"}</button>
          <span class="like-count">${likes}</span>
        </div>
      </div>

      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="meta">
          <span>${p.location}</span>
          <span class="price">${formatDKK(p.price)}</span>
        </div>
      </div>
    </article>
  `;
}

function render(){
  const grid = document.getElementById("productGrid");
  const list = filteredProducts().slice(0, visibleCount);
  grid.innerHTML = list.map(cardHTML).join("");

  // wire like buttons
  grid.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const id = card.dataset.id;
      toggleLike(id);
      render();
    });
  });

  // show/hide load more
  const total = filteredProducts().length;
  document.getElementById("loadMoreBtn").style.display = (visibleCount < total) ? "inline-flex" : "none";
}

function toggleLike(id){
  const wasLiked = liked.has(id);
  if(wasLiked){
    liked.delete(id);
    likesDelta[id] = (likesDelta[id] || 0) - 1;
  } else {
    liked.add(id);
    likesDelta[id] = (likesDelta[id] || 0) + 1;
  }
  localStorage.setItem("liked_ids", JSON.stringify([...liked]));
  localStorage.setItem("likes_delta", JSON.stringify(likesDelta));
}

// ===== Modal =====
function openModal(){
  const modal = document.getElementById("modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  const modal = document.getElementById("modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// ===== Events =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Render first
  render();

  // Category filter
  document.querySelectorAll(".cat[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat[data-cat]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCat = btn.dataset.cat === "Mærker" ? "Alle" : btn.dataset.cat; // demo
      visibleCount = 4;
      render();
    });
  });

  // Search
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    visibleCount = 4;
    render();
  });

  // Live search (valgfrit, nice)
  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.trim();
    visibleCount = 4;
    render();
  });

  // Load more
  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    render();
  });

  // View more button
  document.getElementById("viewMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    render();
    window.scrollBy({ top: 300, behavior: "smooth" });
  });

  // Reset
  document.getElementById("resetBtn").addEventListener("click", () => {
    currentCat = "Alle";
    currentQuery = "";
    visibleCount = 4;
    searchInput.value = "";
    document.querySelectorAll(".cat[data-cat]").forEach(b => b.classList.remove("active"));
    document.querySelector('.cat[data-cat="Alle"]').classList.add("active");
    render();
  });

  // Login modal
  document.getElementById("loginBtn").addEventListener("click", openModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", (e) => {
    if(e.target.id === "modal") closeModal();
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Log ind demo ✅ (ingen rigtig login endnu)");
    closeModal();
  });

  // Sell buttons demo
  function sellDemo(){
    alert("Sælg demo ✅ (her kunne du åbne en 'opret annonce' side)");
  }
  document.getElementById("sellBtn").addEventListener("click", sellDemo);
  document.getElementById("heroSellBtn").addEventListener("click", sellDemo);

  // More button demo
  document.getElementById("moreBtn").addEventListener("click", () => {
    alert("Andre kategorier (demo) ✅");
  });
});
