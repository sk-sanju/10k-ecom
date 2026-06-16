// assets/js/product-details.js
// Handles detail rendering, image swap, size option selections, and related items on the Details page

import { fetchJSON } from './utils.js';
import { addToCart, buyNow } from './cart.js';

let currentProduct = null;
let selectedSize = "";
let currentQty = 1;

async function initProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  try {
    const products = await fetchJSON('data/products.json');
    currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
      // Fallback if ID doesn't exist
      currentProduct = products[0];
    }

    renderDetails();
    renderRelated(products);
  } catch (err) {
    console.error("Failed to load product details", err);
  }
}

function renderDetails() {
  if (!currentProduct) return;

  // Breadcrumbs title
  const breadcrumbProduct = document.getElementById('breadcrumbProduct');
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  if (breadcrumbProduct) breadcrumbProduct.innerText = currentProduct.name;
  if (breadcrumbCategory) {
    breadcrumbCategory.innerText = currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1);
    breadcrumbCategory.href = `shop.html?category=${currentProduct.category}`;
  }

  // Gallery main image & thumbs
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) {
    mainImage.src = currentProduct.img;
    mainImage.alt = currentProduct.name;
  }

  // Thumbnails (generate 3 matching crops/views using source and detail crops)
  const thumbsContainer = document.getElementById('thumbnails-container');
  if (thumbsContainer) {
    // We reuse the main image as thumb 1, and make some detailed dummy crops or placeholders for details
    const thumb2Url = currentProduct.img; // swap image
    const thumb3Url = currentProduct.img;
    
    thumbsContainer.innerHTML = `
      <img src="${currentProduct.img}" alt="Angle 1" class="product-gallery-thumb active rounded-lg cursor-pointer border" style="width: 80px; height: 80px; object-fit: cover;">
      <img src="${thumb2Url}" alt="Angle 2" class="product-gallery-thumb rounded-lg cursor-pointer border" style="width: 80px; height: 80px; object-fit: cover; filter: brightness(0.95) contrast(1.05);">
      <img src="${thumb3Url}" alt="Angle 3" class="product-gallery-thumb rounded-lg cursor-pointer border" style="width: 80px; height: 80px; object-fit: cover; filter: hue-rotate(5deg) saturate(1.1);">
    `;

    // Add click event for image swaps
    document.querySelectorAll('.product-gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.product-gallery-thumb').forEach(t => t.classList.remove('active', 'border-primary'));
        thumb.classList.add('active', 'border-primary');
        if (mainImage) {
          mainImage.src = thumb.src;
          // Trigger subtle fade-in transition
          mainImage.style.opacity = 0;
          setTimeout(() => {
            mainImage.style.transition = 'opacity 0.3s ease-in-out';
            mainImage.style.opacity = 1;
          }, 50);
        }
      });
    });
  }

  // Content Details
  const title = document.getElementById('product-title');
  const price = document.getElementById('product-price');
  const originalPrice = document.getElementById('product-original-price');
  const ratingText = document.getElementById('rating-display');
  const descText = document.getElementById('product-description');
  const skuText = document.getElementById('product-sku');

  if (title) title.innerText = currentProduct.name;
  if (price) price.innerText = `₹${currentProduct.price.toLocaleString('en-IN')}`;
  
  if (originalPrice) {
    const originalVal = Math.round(currentProduct.price * 1.25);
    originalPrice.innerText = `₹${originalVal.toLocaleString('en-IN')}`;
  }

  if (skuText) skuText.innerText = `SKU: KSH-2026-0${currentProduct.id}`;

  if (ratingText) {
    ratingText.innerHTML = `
      ${'<i class="fa-solid fa-star text-warning"></i>'.repeat(Math.floor(currentProduct.rating))}
      ${currentProduct.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke text-warning"></i>' : ''}
      <span class="text-secondary ms-2">(${currentProduct.rating} Rating)</span>
    `;
  }

  if (descText) descText.innerText = currentProduct.description;

  // Size Options Generator
  const sizeContainer = document.getElementById('sizes-container');
  if (sizeContainer) {
    sizeContainer.innerHTML = '';
    const sizes = currentProduct.sizeOptions || ["Standard"];
    selectedSize = sizes[0]; // Set default selection

    sizes.forEach(sz => {
      const activeClass = sz === selectedSize ? 'border-primary text-primary' : 'border-outline-variant text-secondary';
      sizeContainer.innerHTML += `
        <button class="px-3 py-2 rounded-lg border-2 font-label-lg transition-all size-option-btn ${activeClass}" data-size-val="${sz}">
          ${sz}
        </button>
      `;
    });

    // Add click listeners to size buttons
    document.querySelectorAll('.size-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-option-btn').forEach(b => {
          b.classList.remove('border-primary', 'text-primary');
          b.classList.add('border-outline-variant', 'text-secondary');
        });
        btn.classList.add('border-primary', 'text-primary');
        selectedSize = btn.getAttribute('data-size-val');
      });
    });
  }

  // Setup click listeners for main CTAs
  const cartBtn = document.getElementById('add-to-cart-btn');
  const whatsappBtn = document.getElementById('buy-whatsapp-btn');
  
  if (cartBtn) {
    cartBtn.onclick = () => {
      addToCart(currentProduct.id, currentQty, selectedSize);
    };
  }

  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      buyNow(currentProduct.id, currentQty, selectedSize);
    };
  }

  // Heart toggle
  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    favBtn.onclick = () => {
      const icon = favBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('text-danger');
      }
    };
  }
}

// Quantity Counter
window.updateProductQty = (val) => {
  const qtyDisplay = document.getElementById('qty-display');
  if (qtyDisplay) {
    currentQty = Math.max(1, currentQty + val);
    qtyDisplay.innerText = currentQty;
  }
};

// Render related products (under "You May Also Like")
function renderRelated(allProducts) {
  const container = document.getElementById('relatedProductsGrid');
  if (!container || !currentProduct) return;

  // Filter by same category, excluding active item
  let related = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
  
  // If not enough items, fallback to others
  if (related.length < 4) {
    const fallbacks = allProducts.filter(p => p.id !== currentProduct.id && !related.some(r => r.id === p.id));
    related = [...related, ...fallbacks];
  }

  // Pick top 4
  related = related.slice(0, 4);
  container.innerHTML = '';

  related.forEach(p => {
    container.innerHTML += `
      <div class="col-6 col-md-3 mb-4">
        <div class="product-grid-card d-flex flex-column justify-content-between h-100" style="cursor: pointer;" onclick="window.location.href='product.html?id=${p.id}'">
          <div class="img-container">
            <img src="${p.img}" alt="${p.name}">
          </div>
          <div class="p-3">
            <h3 class="font-label-lg text-neutral-dark mb-1 text-truncate" style="font-size: 12px;">${p.name}</h3>
            <p class="text-primary font-label-md m-0">₹${p.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    `;
  });
}

// Run detail loader
if (document.readyState !== 'loading') {
  initProductDetails();
} else {
  document.addEventListener('DOMContentLoaded', initProductDetails);
}
