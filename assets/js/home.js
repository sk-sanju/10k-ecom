// assets/js/home.js
// Renders the New Arrivals (Featured Products) on the home page

import { fetchJSON } from './utils.js';
import { addToCart, buyNow } from './cart.js';

const NEW_ARRIVALS_COUNT = 4;

export function renderNewArrivals() {
  const container = document.getElementById('newArrivalsGrid');
  if (!container) return;

  fetchJSON('data/products.json')
    .then((products) => {
      // Pick the first 4 items as featured/new arrivals
      const newProducts = products.slice(0, NEW_ARRIVALS_COUNT);
      container.innerHTML = '';

      newProducts.forEach((p) => {
        container.innerHTML += `
          <div class="col-12 col-sm-6 col-lg-3 mb-4">
            <div class="product-grid-card d-flex flex-col flex-column justify-content-between">
              
              <!-- Image Container -->
              <div class="img-container">
                <a href="product.html?id=${p.id}">
                  <img src="${p.img}" alt="${p.name}">
                </a>
                <span class="product-badge bg-primary text-white">Masterpiece</span>
              </div>

              <!-- Content details -->
              <div class="p-3 d-flex flex-column justify-content-between flex-grow-1">
                <div>
                  <h3 class="font-headline-lg fs-5 mb-1">
                    <a href="product.html?id=${p.id}" class="text-decoration-none text-dark hover-text-primary">
                      ${p.name}
                    </a>
                  </h3>
                  <p class="font-label-lg text-primary mb-3">
                    ₹${Number(p.price).toLocaleString('en-IN')}
                  </p>
                </div>

                <!-- Action buttons -->
                <div class="d-flex gap-2 mt-auto">
                  <button class="btn btn-primary-luxe flex-grow-1 py-2 font-label-md" onclick="addToCart(${p.id}, 1, '${p.sizeOptions ? p.sizeOptions[0] : 'Standard'}')">
                    Add to Cart
                  </button>
                  <button class="btn btn-secondary-luxe px-3 py-2 text-whatsapp" onclick="buyNow(${p.id}, 1, '${p.sizeOptions ? p.sizeOptions[0] : 'Standard'}')" title="Inquire on WhatsApp">
                    <i class="fa-brands fa-whatsapp fs-5"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>`;
      });
    })
    .catch((err) => console.error('Failed to load new arrivals', err));
}

// Auto-run on page load
if (document.readyState !== 'loading') {
  renderNewArrivals();
} else {
  document.addEventListener('DOMContentLoaded', renderNewArrivals);
}
