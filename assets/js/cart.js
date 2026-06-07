// assets/js/cart.js
// Handles shopping cart operations, storage sync, and WhatsApp checkout generation

const prefix = window.location.pathname.includes('/policies/') ? '../' : '';

// Direct lookup from products.json
async function getProductById(id) {
  try {
    const response = await fetch(`${prefix}data/products.json`);
    const products = await response.json();
    return products.find(p => p.id === parseInt(id));
  } catch (err) {
    console.error("Failed to load products list for cart operations", err);
    return null;
  }
}

// Update navbar badge count
export function syncCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + parseInt(item.qty || 1), 0);
    badge.innerText = totalQty;
    badge.style.display = totalQty === 0 ? 'none' : 'flex';
  }
}
// Duplicate syncCartBadge block removed

// Add item to cart
export async function addToCart(productId, qty = 1, size = "Standard") {
  console.log('addToCart invoked', { productId, qty, size });
  const product = await getProductById(productId);
  if (!product) {
    console.error('Product not found for ID', productId);
    return alert('Product not found');
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === size);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty = parseInt(cart[existingItemIndex].qty) + parseInt(qty);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      category: product.category,
      size: size,
      qty: parseInt(qty)
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  syncCartBadge();
  alert(`Added ${qty} x ${product.name} (${size}) to your Shopping Bag!`);
}


// Directly buy a single item via WhatsApp
export async function buyNow(productId, qty = 1, size = "Standard") {
  const product = await getProductById(productId);
  if (!product) return alert("Product not found");

  const subtotal = product.price * qty;
  const whatsappNumber = "919744935628";
  
  const msg = `🛍️ *NEW INQUIRY - KUTHAMPULLY LUXE*\n\n` +
              `*Product:* ${product.name}\n` +
              `*Size:* ${size}\n` +
              `*Quantity:* ${qty}\n` +
              `*Price:* ₹${Number(product.price).toLocaleString('en-IN')}\n\n` +
              `*Total:* ₹${Number(subtotal).toLocaleString('en-IN')}\n\n` +
              `Please confirm availability of this handloom piece. Thank you!`;

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Checkout the entire cart via WhatsApp
export function buyCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) return alert("Your Shopping Bag is empty!");

  let total = 0;
  let msg = `🛍️ *NEW ORDER - KUTHAMPULLY LUXE*\n\n` +
            `*Customer Order Details:*\n` +
            `-----------------------------------------\n`;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    msg += `${index + 1}. *${item.name}*\n` +
           `   - Size: ${item.size}\n` +
           `   - Qty: ${item.qty}\n` +
           `   - Subtotal: ₹${Number(subtotal).toLocaleString('en-IN')}\n\n`;
  });

  msg += `-----------------------------------------\n` +
         `*Total Order Value:* ₹${Number(total).toLocaleString('en-IN')}\n\n` +
         `Please confirm and generate the WhatsApp invoice for my selection. Thank you!`;

  const whatsappNumber = "919847012345";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Expose functions to window for onclick HTML handlers
window.addToCart = addToCart;
window.buyNow = buyNow;
window.buyCart = buyCart;
window.syncCartBadge = syncCartBadge;