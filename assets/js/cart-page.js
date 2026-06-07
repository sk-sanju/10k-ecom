// assets/js/cart-page.js
// Handles rendering and updating items in the cart.html page

import { syncCartBadge, buyCart } from './cart.js';

function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const cartContainer = document.getElementById('cart-container');
  const emptyState = document.getElementById('empty-state');
  
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    if (cartContainer) cartContainer.classList.add('d-none');
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (cartContainer) cartContainer.classList.remove('d-none');
  if (emptyState) emptyState.classList.add('d-none');

  if (container) {
    container.innerHTML = '';
    
    cart.forEach((item, index) => {
      const subtotalVal = item.price * item.qty;
      container.innerHTML += `
        <div class="luxury-card p-4 d-flex flex-column flex-sm-row gap-4 mb-3" data-cart-index="${index}" style="transition: all 0.3s ease-in-out;">
          
          <!-- Image -->
          <div class="overflow-hidden rounded-3 bg-light flex-shrink-0" style="width: 120px; height: 150px; border-radius: 8px;">
            <img class="w-100 h-100 object-fit-cover" src="${item.img}" alt="${item.name}">
          </div>

          <!-- Content details -->
          <div class="flex-grow-1 d-flex flex-column justify-content-between py-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="font-headline-lg fs-5 text-neutral-dark mb-1">${item.name}</h3>
                <p class="font-body-sm text-secondary mb-2">Authentic Kuthampully Handloom</p>
                <div class="d-flex gap-2 flex-wrap">
                  <span class="text-label-md bg-light text-secondary px-3 py-1 rounded-pill" style="font-size: 10px;">Size: ${item.size}</span>
                  <span class="text-label-md bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill" style="font-size: 10px;">Handmade</span>
                </div>
              </div>
              <button class="btn border-0 p-1 text-secondary hover-text-danger" onclick="window.removeCartItem(${index})" title="Remove item">
                <i class="fa-regular fa-trash-can fs-5"></i>
              </button>
            </div>

            <!-- Qty & Price Row -->
            <div class="d-flex justify-content-between align-items-end mt-4">
              <!-- Qty inputs -->
              <div class="d-flex align-items-center border rounded-lg bg-white overflow-hidden shadow-sm" style="border-radius: 8px;">
                <button class="btn border-0 py-1 px-3 text-secondary hover-bg-light" onclick="window.changeCartQty(${index}, -1)">
                  <i class="fa-solid fa-minus" style="font-size: 12px;"></i>
                </button>
                <span class="px-2 font-label-lg" style="min-width: 30px; text-align: center;">${item.qty}</span>
                <button class="btn border-0 py-1 px-3 text-secondary hover-bg-light" onclick="window.changeCartQty(${index}, 1)">
                  <i class="fa-solid fa-plus" style="font-size: 12px;"></i>
                </button>
              </div>
              
              <!-- Subtotal price -->
              <div class="text-end">
                <span class="font-headline-lg text-primary fs-4">₹${subtotalVal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      `;
    });
  }

  // Calculate & display grand totals
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (subtotalEl) subtotalEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

// Quantity updater on Cart Page
window.changeCartQty = (index, delta) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index]) {
    cart[index].qty = Math.max(1, parseInt(cart[index].qty) + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    syncCartBadge();
    renderCartPage();
  }
};

// Item Deletion with micro-transition
window.removeCartItem = (index) => {
  const card = document.querySelector(`[data-cart-index="${index}"]`);
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      syncCartBadge();
      renderCartPage();
    }, 300);
  }
};

// Initial run
if (document.readyState !== 'loading') {
  renderCartPage();
} else {
  document.addEventListener('DOMContentLoaded', renderCartPage);
}

// Bind checkout click
const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    buyCart();
  };
}
