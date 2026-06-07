let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ADD TO CART */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  const size = document.getElementById("size")?.value || "Standard";
  const qty = parseInt(document.getElementById("qty")?.value || 1);

  const item = {
    id: product.id,
    name: product.name,
    price: product.price,
    size,
    qty
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
}

/* BUY NOW (SINGLE PRODUCT WHATSAPP) */
function buyNow(productId) {
  const product = products.find(p => p.id === productId);

  const size = document.getElementById("size")?.value || "Standard";
  const qty = document.getElementById("qty")?.value || 1;

  const msg = `
🛍 NEW ORDER

Product: ${product.name}
Size: ${size}
Quantity: ${qty}
Price: ₹${product.price * qty}

Total: ₹${product.price * qty}
  `;

  window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`);
}

/* BUY CART (FULL ORDER) */
function buyCart() {
  if (cart.length === 0) return alert("Cart is empty");

  let total = 0;
  let msg = "🛍 ORDER DETAILS\n\n";

  cart.forEach((item, i) => {
    const sub = item.price * item.qty;
    total += sub;

    msg += `${i + 1}. ${item.name}
Size: ${item.size}
Qty: ${item.qty}
Subtotal: ₹${sub}\n\n`;
  });

  msg += `TOTAL: ₹${total}`;

  window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`);
}