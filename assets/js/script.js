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

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inquiryForm");
    const submitBtn = document.getElementById("submitBtn");

    if (!form || !submitBtn) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const message = form.querySelector("textarea").value.trim();

        if (!name || !email || !phone || !message) {
            alert("Please fill all fields");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            from_name: name,
            from_email: email,
            phone: phone,
            message: message
        })
        .then(() => {
            alert("Message sent successfully!");
            form.reset();
        })
        .catch((error) => {
            console.error(error);
            alert("Failed to send message");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Inquiry";
        });
    });
});