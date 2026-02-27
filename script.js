// script.js

let cartCount = 0;

// Kør når siden er loaded
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".hero-search input");
  const searchBtn = document.querySelector(".hero-search button");
  const cartBtn = document.querySelector(".cart-btn");
  const outletLink = document.querySelector(".nav .pill");

  // Søg funktion
  function doSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Skriv noget i søgefeltet 🙂");
      return;
    }
    alert(`Du søgte på: ${query}`);
  }

  searchBtn.addEventListener("click", doSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
  });

  // Kurv funktion
  cartBtn.addEventListener("click", () => {
    cartCount++;
    cartBtn.innerHTML = `${cartCount} vare i kurven <span class="cart-icon">🛒</span>`;
  });

  // Outlet -> scroll
  if (outletLink) {
    outletLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    });
  }
});
