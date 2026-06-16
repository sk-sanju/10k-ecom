let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* UPDATE CART COUNT */
function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.innerText = cart.length;
}

/* ADD TO CART */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push({ ...product, qty: 1, size: "M" });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart");
}

/* RENDER PRODUCTS (MOST IMPORTANT) */
function renderProducts(filter = "all") {
  const container = document.getElementById("productGrid");

  if (!container) return; // safety check

  container.innerHTML = "";

  const filtered =
    filter === "all"
      ? products
      : products.filter(p => p.category === filter);

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3">
        <div class="product-card">

          <img src="${p.img}" class="img-fluid">

          <h6 class="mt-2">${p.name}</h6>
          <p class="text-success fw-bold">₹${p.price}</p>

          <button class="btn btn-success w-100 mb-2"
            onclick="buyNow(${p.id})">
            Buy Now
          </button>

          <button class="btn btn-warning w-100"
            onclick="addToCart(${p.id})">
            Add to Cart
          </button>

        </div>
      </div>
    `;
  });
}

/* BUY NOW */
function buyNow(id) {
  const p = products.find(x => x.id === id);

  const msg = `Order:\n${p.name}\nPrice: ₹${p.price}`;

  window.open(`https://wa.me/919539251789?text=${encodeURIComponent(msg)}`);
}

/* SEARCH */
function searchProducts(value) {
  const container = document.getElementById("productGrid");
  if (!container) return;

  container.innerHTML = "";

  products
    .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
    .forEach(p => {
      container.innerHTML += `
        <div class="col-md-3">
          <div class="product-card">
            <img src="${p.img}" class="img-fluid">
            <h6>${p.name}</h6>
            <p>₹${p.price}</p>

            <button class="btn btn-success w-100"
              onclick="buyNow(${p.id})">
              Buy Now
            </button>
          </div>
        </div>
      `;
    });
}

/* INIT */
window.onload = () => {
  updateCartCount();
  renderProducts("all");
};