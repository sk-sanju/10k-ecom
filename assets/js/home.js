// assets/js/home.js
// Render "New Arrivals" section on home page
import { fetchJSON, formatPrice } from './utils.js';
import { addToCart, buyNow } from './cart.js';

const NEW_ARRIVALS_COUNT = 4;

export function renderNewArrivals() {
  const container = document.getElementById('newArrivalsGrid');
  if (!container) return;
  fetchJSON('data/products.json')
    .then((products) => {
      const newProducts = products.slice(-NEW_ARRIVALS_COUNT);
      container.innerHTML = '';
      newProducts.forEach((p) => {
        container.innerHTML += `
          <div class="col-md-3 mb-4">
            <div class="product-card">
              <img src="${p.img}" class="img-fluid" alt="${p.name}">
              <div class="info">
                <h5>${p.name}</h5>
                <p class="price">${formatPrice(p.price)}</p>
                <button class="btn btn-primary btn-buy" onclick="buyNow(${p.id})">Buy Now</button>
                <button class="btn btn-secondary btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
              </div>
            </div>
          </div>`;
      });
    })
    .catch((err) => console.error('Failed to load new arrivals', err));
}

// Auto‑run on page load
if (document.readyState !== 'loading') {
  renderNewArrivals();
} else {
  document.addEventListener('DOMContentLoaded', renderNewArrivals);
}
