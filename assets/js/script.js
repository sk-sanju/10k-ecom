let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.innerText = cart.length;
}

function loadProducts(filter = "all") {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card product-card">
          <img src="${p.img}">
          <div class="card-body">
            <h6>${p.name}</h6>
            <p>₹${p.price}</p>
            <button class="btn btn-success btn-sm" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

function filterCategory(cat) {
  loadProducts(cat);
}

window.onload = () => {
  updateCartCount();
  loadProducts();
};