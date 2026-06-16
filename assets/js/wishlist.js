// assets/js/wishlist.js
// Handles adding/removing items to wishlist using localStorage

export function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('kv_wishlist')) || [];
  const index = wishlist.indexOf(productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    if (window.showToast) window.showToast('Removed from wishlist', 'info');
  } else {
    wishlist.push(productId);
    if (window.showToast) window.showToast('Added to wishlist', 'success');
  }
  
  localStorage.setItem('kv_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

export function isInWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem('kv_wishlist')) || [];
  return wishlist.includes(productId);
}

function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem('kv_wishlist')) || [];
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.getAttribute('data-id'));
    const icon = btn.querySelector('i');
    if (icon) {
      if (wishlist.includes(id)) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-danger');
      } else {
        icon.classList.remove('fa-solid', 'text-danger');
        icon.classList.add('fa-regular');
      }
    }
  });
}

// Global expose
window.toggleWishlist = toggleWishlist;

// Initialize UI on load
document.addEventListener('DOMContentLoaded', updateWishlistUI);
