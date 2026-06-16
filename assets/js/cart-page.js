// assets/js/cart-page.js
// Handles cart page rendering and checkout form for Kavish

import { syncCartBadge, buyCart } from './cart.js';

function renderCartPage() {
  const container     = document.getElementById('cart-items-container');
  const cartContainer = document.getElementById('cart-container');
  const emptyState    = document.getElementById('empty-state');
  const subtotalEl    = document.getElementById('cart-subtotal');
  const totalEl       = document.getElementById('cart-total');
  const itemCountEl   = document.getElementById('cart-item-count');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    if (cartContainer) cartContainer.classList.add('d-none');
    if (emptyState)    emptyState.classList.remove('d-none');
    return;
  }

  if (cartContainer) cartContainer.classList.remove('d-none');
  if (emptyState)    emptyState.classList.add('d-none');

  const totalQty = cart.reduce((s, i) => s + parseInt(i.qty || 1), 0);
  if (itemCountEl) itemCountEl.innerText = `(${totalQty} item${totalQty !== 1 ? 's' : ''})`;

  if (container) {
    container.innerHTML = '';
    cart.forEach((item, index) => {
      const subtotalVal = item.price * item.qty;
      container.innerHTML += `
        <div class="luxury-card p-4 d-flex flex-column flex-sm-row gap-4 mb-3"
             data-cart-index="${index}"
             style="transition:all 0.3s ease;">

          <!-- Product Image -->
          <a href="product.html?id=${item.id}"
             class="overflow-hidden rounded-3 bg-light flex-shrink-0 d-block"
             style="width:110px;height:140px;border-radius:10px;">
            <img class="w-100 h-100 object-fit-cover"
                 src="${item.img}" alt="${item.name}">
          </a>

          <!-- Item Details -->
          <div class="flex-grow-1 d-flex flex-column justify-content-between py-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="font-headline-lg fs-6 text-neutral-dark mb-1">${item.name}</h3>
                <p class="font-body-sm text-secondary mb-2">Kerala Traditional Handloom</p>
                <div class="d-flex gap-2 flex-wrap">
                  <span class="font-label-md bg-light text-secondary px-3 py-1 rounded-pill" style="font-size:10px;">Size: ${item.size}</span>
                  <span class="font-label-md bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill" style="font-size:10px;">Handmade</span>
                </div>
              </div>
              <button class="btn border-0 p-1 text-secondary"
                      onclick="window.removeCartItem(${index})"
                      title="Remove item"
                      aria-label="Remove ${item.name} from cart">
                <i class="fa-regular fa-trash-can fs-5"></i>
              </button>
            </div>

            <!-- Qty & Price -->
            <div class="d-flex justify-content-between align-items-end mt-3">
              <div class="d-flex align-items-center border rounded bg-white overflow-hidden shadow-sm" style="border-radius:8px;">
                <button class="btn border-0 py-1 px-3 text-secondary"
                        onclick="window.changeCartQty(${index}, -1)"
                        aria-label="Decrease quantity">
                  <i class="fa-solid fa-minus" style="font-size:12px;"></i>
                </button>
                <span class="px-2 font-label-lg" style="min-width:32px;text-align:center;">${item.qty}</span>
                <button class="btn border-0 py-1 px-3 text-secondary"
                        onclick="window.changeCartQty(${index}, 1)"
                        aria-label="Increase quantity">
                  <i class="fa-solid fa-plus" style="font-size:12px;"></i>
                </button>
              </div>
              <span class="font-headline-lg text-primary fs-5">
                &#8377;${subtotalVal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      `;
    });
  }

  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (subtotalEl) subtotalEl.innerText = `\u20B9${grandTotal.toLocaleString('en-IN')}`;
  if (totalEl)    totalEl.innerText    = `\u20B9${grandTotal.toLocaleString('en-IN')}`;
}

// Change quantity of item at index
window.changeCartQty = (index, delta) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index]) {
    cart[index].qty = Math.max(1, parseInt(cart[index].qty) + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    syncCartBadge();
    renderCartPage();
  }
};

// Remove item with animation
window.removeCartItem = (index) => {
  const card = document.querySelector(`[data-cart-index="${index}"]`);
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateX(30px)';
    card.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const removed = cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      syncCartBadge();
      if (window.showToast && removed[0]) {
        window.showToast(`"${removed[0].name}" removed from bag.`, 'info');
      }
      renderCartPage();
    }, 300);
  }
};

// ── Checkout Form Logic ──────────────────────────────────────
function initCheckoutForm() {
  const toggleBtn     = document.getElementById('checkout-toggle-btn');
  const formSection   = document.getElementById('checkout-form-section');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const quickOrderBtn = document.getElementById('checkout-whatsapp-btn');

  // Toggle form visibility
  if (toggleBtn && formSection) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = formSection.style.display !== 'none';
      formSection.style.display = isOpen ? 'none' : 'block';
      const icon = toggleBtn.querySelector('.toggle-icon');
      if (icon) icon.style.transform = isOpen ? 'rotate(0)' : 'rotate(180deg)';
    });
  }

  // Place Order with customer details
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name     = document.getElementById('co-name')?.value.trim();
      const phone    = document.getElementById('co-phone')?.value.trim();
      const whatsapp = document.getElementById('co-whatsapp')?.value.trim();
      const address  = document.getElementById('co-address')?.value.trim();
      const city     = document.getElementById('co-city')?.value.trim();
      const district = document.getElementById('co-district')?.value.trim();
      const pincode  = document.getElementById('co-pincode')?.value.trim();
      const notes    = document.getElementById('co-notes')?.value.trim();

      if (!name || !phone || !address || !city || !district || !pincode) {
        if (window.showToast) window.showToast('Please fill in all required fields.', 'warning');
        else alert('Please fill in all required fields.');
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        if (window.showToast) window.showToast('Please enter a valid 10-digit mobile number.', 'warning');
        else alert('Invalid mobile number.');
        return;
      }

      buyCart({ name, phone, whatsapp: whatsapp || phone, address, city, district, pincode, notes });
    });
  }

  // Quick order without form
  if (quickOrderBtn) {
    quickOrderBtn.addEventListener('click', () => buyCart());
  }
}

// ── Init ─────────────────────────────────────────────────────
function init() {
  renderCartPage();
  initCheckoutForm();
}

if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
