const cart = [];

const catalog = [
  { id: "aeromax", name: "AeroMax Runner", price: 99, image: "assets/images/product-aeromax.jpg" },
  { id: "modex", name: "Modex Flex Sneaker", price: 77, image: "assets/images/product-modex.jpg" },
  { id: "cloudstride", name: "CloudStride Pro", price: 129, image: "assets/images/product-cloudstride.jpg" },
  { id: "lunar", name: "Lunar Knit", price: 110, image: "assets/images/product-lunar.jpg" },
  { id: "velocity", name: "Velocity X", price: 145, image: "assets/images/product-velocity.jpg" },
  { id: "ivory", name: "Ivory Court", price: 98, image: "assets/images/product-ivory.jpg" },
  { id: "trail", name: "Trail Pulse", price: 132, image: "assets/images/product-trail.jpg" },
  { id: "night", name: "Night Runner", price: 118, image: "assets/images/product-night.jpg" },
  { id: "dune", name: "Sand Dune", price: 89, image: "assets/images/product-dune.jpg" },
  { id: "carbon", name: "Carbon Peak", price: 156, image: "assets/images/product-carbon.jpg" },
  { id: "softform", name: "Soft Form", price: 92, image: "assets/images/product-softform.jpg" },
  { id: "flex", name: "Flex Court", price: 104, image: "assets/images/product-flex.jpg" }
];

const overlay = document.getElementById("overlay");
const cartDrawer = document.getElementById("cartDrawer");
const searchPanel = document.getElementById("searchPanel");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const toast = document.getElementById("toast");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-on");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-on"), 1800);
}

function closePanels() {
  overlay.hidden = true;
  searchPanel.hidden = true;
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  nav.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function openOverlay() {
  overlay.hidden = false;
}

function renderCart() {
  const list = document.getElementById("cartItems");
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  if (!cart.length) {
    list.innerHTML = "<p class='muted'>Your bag is empty.</p>";
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <strong>${item.name}</strong>
          <div class="qty">
            <button data-act="dec" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" aria-label="Increase">+</button>
          </div>
        </div>
        <span>${money(item.price * item.qty)}</span>
      </div>`
    )
    .join("");
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  showToast(`${product.name} added to bag`);
}

document.body.addEventListener("click", (event) => {
  const addBtn = event.target.closest(".add-to-cart");
  if (addBtn) {
    addToCart({
      id: addBtn.dataset.id,
      name: addBtn.dataset.name,
      price: Number(addBtn.dataset.price),
      image: addBtn.dataset.image
    });
  }

  const qtyBtn = event.target.closest("[data-act]");
  if (qtyBtn) {
    const id = qtyBtn.closest(".cart-row").dataset.id;
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    if (qtyBtn.dataset.act === "inc") item.qty += 1;
    if (qtyBtn.dataset.act === "dec") item.qty -= 1;
    if (item.qty <= 0) {
      const index = cart.findIndex((entry) => entry.id === id);
      cart.splice(index, 1);
    }
    renderCart();
  }
});

document.getElementById("cartBtn").addEventListener("click", () => {
  searchPanel.hidden = true;
  nav.classList.remove("is-open");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  openOverlay();
});

document.getElementById("closeCart").addEventListener("click", closePanels);
overlay.addEventListener("click", closePanels);

document.getElementById("searchBtn").addEventListener("click", () => {
  cartDrawer.classList.remove("is-open");
  searchPanel.hidden = false;
  openOverlay();
  document.getElementById("searchInput").focus();
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const results = catalog.filter((item) => item.name.toLowerCase().includes(query));
  const box = document.getElementById("searchResults");
  if (!query) {
    box.innerHTML = "";
    return;
  }
  if (!results.length) {
    box.innerHTML = "<p class='muted'>No sneakers found.</p>";
    return;
  }
  box.innerHTML = results
    .map(
      (item) => `
      <a class="search-hit" href="#shop">
        <img src="${item.image}" alt="" />
        <div>
          <strong>${item.name}</strong>
          <div class="muted">${money(item.price)}</div>
        </div>
      </a>`
    )
    .join("");
});

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((node) => node.classList.remove("is-active"));
    link.classList.add("is-active");
    nav.classList.remove("is-open");
  });
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((node) => node.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    document.querySelectorAll("#shopGrid .product-card").forEach((card) => {
      const match = filter === "all" || card.dataset.category.includes(filter);
      card.classList.toggle("is-hidden", !match);
    });
  });
});

document.querySelectorAll("[data-jump]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    const filter = card.dataset.jump;
    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });
    document.querySelectorAll("#shopGrid .product-card").forEach((product) => {
      product.classList.toggle("is-hidden", !product.dataset.category.includes(filter));
    });
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("formNote");
  note.hidden = false;
  note.textContent = "You are on the list. Welcome to SOLEVA.";
  event.target.reset();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty");
    return;
  }
  cart.splice(0, cart.length);
  renderCart();
  closePanels();
  showToast("Thank you — your order is in.");
});

renderCart();
