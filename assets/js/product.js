// assets/js/product.js
// Handles dynamic loading, filtering, sorting, and pagination on the Shop page

import { fetchJSON } from './utils.js';
import { addToCart, buyNow } from './cart.js';

const perPage = 8;
let currentPage = 1;
let productsData = [];

// Filtering states
let selectedCategory = "all";
let searchPattern = "";
let maxPrice = 25000;
let selectedOccasions = [];
let selectedMaterials = [];
let activeSort = "newest";

// Initial load
async function initShop() {
  try {
    productsData = await fetchJSON('data/products.json');
    
    // Parse URL params for preset filters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    
    if (searchParam) {
      searchPattern = searchParam.toLowerCase();
      // Update UI search inputs
      const deskSearch = document.getElementById('desktopSearchInput');
      if (deskSearch) deskSearch.value = searchParam;
    }
    
    if (categoryParam) {
      selectedCategory = categoryParam.toLowerCase();
      // Activate correct pill in sidebar/header if matching
      updateCategoryUI(selectedCategory);
    }

    // Set up price range slider listener
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    if (priceRange && priceDisplay) {
      priceRange.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        priceDisplay.innerText = `₹${maxPrice.toLocaleString('en-IN')}`;
        currentPage = 1;
        renderShop();
      });
    }

    // Set up checkboxes and occasion badges listeners
    setupFiltersListeners();
    
    // Set up sort listener
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        currentPage = 1;
        renderShop();
      });
    }

    renderShop();
  } catch (err) {
    console.error("Failed to initialize shop catalog", err);
  }
}

function updateCategoryUI(category) {
  // Clear all active categories in sidebar list
  document.querySelectorAll('[data-filter-category]').forEach(el => {
    el.classList.remove('text-primary', 'fw-bold');
  });
  // Highlight active
  const activeEl = document.querySelector(`[data-filter-category="${category}"]`);
  if (activeEl) activeEl.classList.add('text-primary', 'fw-bold');
}

function setupFiltersListeners() {
  // Category list selection
  document.querySelectorAll('[data-filter-category]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      selectedCategory = el.getAttribute('data-filter-category');
      updateCategoryUI(selectedCategory);
      currentPage = 1;
      renderShop();
    });
  });

  // Occasion pill selectors
  document.querySelectorAll('[data-filter-occasion]').forEach(el => {
    el.addEventListener('click', (e) => {
      const occasion = el.getAttribute('data-filter-occasion');
      if (occasion === 'all') {
        selectedOccasions = [];
        document.querySelectorAll('[data-filter-occasion]').forEach(pill => pill.classList.remove('bg-primary-container', 'text-on-primary-container'));
        el.classList.add('bg-primary-container', 'text-on-primary-container');
      } else {
        // Toggle occasion
        const idx = selectedOccasions.indexOf(occasion);
        if (idx > -1) {
          selectedOccasions.splice(idx, 1);
          el.classList.remove('bg-primary-container', 'text-on-primary-container');
        } else {
          selectedOccasions.push(occasion);
          el.classList.add('bg-primary-container', 'text-on-primary-container');
        }
        // Remove active from 'all' pill
        const allPill = document.querySelector('[data-filter-occasion="all"]');
        if (allPill) {
          if (selectedOccasions.length > 0) {
            allPill.classList.remove('bg-primary-container', 'text-on-primary-container');
          } else {
            allPill.classList.add('bg-primary-container', 'text-on-primary-container');
          }
        }
      }
      currentPage = 1;
      renderShop();
    });
  });

  // Material checkbox selectors
  document.querySelectorAll('[data-filter-material]').forEach(el => {
    el.addEventListener('change', () => {
      const material = el.getAttribute('data-filter-material');
      if (el.checked) {
        selectedMaterials.push(material);
      } else {
        const idx = selectedMaterials.indexOf(material);
        if (idx > -1) selectedMaterials.splice(idx, 1);
      }
      currentPage = 1;
      renderShop();
    });
  });
}

// Filter core logic
function getFilteredProducts() {
  return productsData.filter(p => {
    // 1. Category check
    if (selectedCategory !== "all") {
      if (p.category !== selectedCategory) return false;
    }
    
    // 2. Search check
    if (searchPattern) {
      const nameMatch = p.name.toLowerCase().includes(searchPattern);
      const descMatch = p.description.toLowerCase().includes(searchPattern);
      if (!nameMatch && !descMatch) return false;
    }
    
    // 3. Price check
    if (p.price > maxPrice) return false;

    // 4. Occasion check
    if (selectedOccasions.length > 0) {
      // If none of the selected occasions match the description (Stitch mockup has occasions embedded in description/tags)
      const matchesOccasion = selectedOccasions.some(occ => 
        p.description.toLowerCase().includes(occ.toLowerCase()) || 
        p.name.toLowerCase().includes(occ.toLowerCase())
      );
      if (!matchesOccasion) return false;
    }

    // 5. Material check
    if (selectedMaterials.length > 0) {
      const matchesMaterial = selectedMaterials.some(mat => 
        p.description.toLowerCase().includes(mat.toLowerCase()) || 
        p.name.toLowerCase().includes(mat.toLowerCase())
      );
      if (!matchesMaterial) return false;
    }

    return true;
  });
}

// Sort core logic
function getSortedProducts(arr) {
  const sorted = [...arr];
  if (activeSort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (activeSort === "best-seller") {
    sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
}

// Render Products Grid & Pagination
function renderShop() {
  const grid = document.getElementById('productGrid');
  const countText = document.getElementById('productCountText');
  if (!grid) return;

  const filtered = getFilteredProducts();
  const sorted = getSortedProducts(filtered);

  // Update item count text
  if (countText) {
    const startNum = sorted.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endNum = Math.min(currentPage * perPage, sorted.length);
    countText.innerText = `Showing ${startNum}-${endNum} of ${sorted.length} products`;
  }

  // Slice for page items
  const startIdx = (currentPage - 1) * perPage;
  const pageItems = sorted.slice(startIdx, startIdx + perPage);

  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-store-slash text-muted mb-3" style="font-size: 3rem;"></i>
        <h3 class="font-headline-lg fs-4 text-secondary">No items match your criteria</h3>
        <p class="font-body-sm text-secondary">Try adjusting filters, clearing your search, or resetting the price range.</p>
        <button class="btn btn-primary-luxe mt-3 px-4" id="resetFiltersBtn">Reset Filters</button>
      </div>`;
    
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetAllFilters();
      });
    }
    renderPagination(0);
    return;
  }

  grid.innerHTML = '';
  pageItems.forEach(p => {
    const size = p.sizeOptions ? p.sizeOptions[0] : "Standard";
    grid.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3 mb-4">
        <div class="product-grid-card d-flex flex-column justify-content-between h-100">
          
          <div class="img-container">
            <a href="product.html?id=${p.id}">
              <img src="${p.img}" alt="${p.name}">
            </a>
            <span class="product-badge bg-primary text-white">${p.category === 'womens' ? 'Saree' : p.category === 'mens' ? 'Mundu' : 'Kids'}</span>
          </div>

          <div class="p-3 d-flex flex-column justify-content-between flex-grow-1">
            <div>
              <h3 class="font-headline-lg fs-6 mb-1">
                <a href="product.html?id=${p.id}" class="text-decoration-none text-dark hover-text-primary">
                  ${p.name}
                </a>
              </h3>
              <div class="d-flex align-items-center mb-2" style="font-size: 11px; color: #f59e0b;">
                ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(p.rating))}
                ${p.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                <span class="text-secondary ms-1">(${p.rating})</span>
              </div>
              <p class="font-label-lg text-primary mb-3">
                ₹${Number(p.price).toLocaleString('en-IN')}
              </p>
            </div>

            <!-- Action buttons -->
            <div class="d-flex gap-2 mt-auto">
              <button class="btn btn-primary-luxe flex-grow-1 py-2 font-label-md" onclick="addToCart(${p.id}, 1, '${size}')" style="font-size: 11px;">
                Add to Bag
              </button>
              <button class="btn btn-secondary-luxe px-2 py-2 text-whatsapp" onclick="buyNow(${p.id}, 1, '${size}')" title="Order via WhatsApp">
                <i class="fa-brands fa-whatsapp fs-5"></i>
              </button>
            </div>
          </div>

        </div>
      </div>`;
  });

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';
  // Left arrow
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link rounded-circle d-flex align-items-center justify-content-center border-0 p-0 mx-1 bg-transparent text-secondary" style="width: 38px; height: 38px;" href="#" onclick="event.preventDefault(); window.shopGoToPage(${currentPage - 1})">
        <i class="fa-solid fa-chevron-left"></i>
      </a>
    </li>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link rounded-circle d-flex align-items-center justify-content-center border-0 p-0 mx-1 font-label-lg ${currentPage === i ? 'bg-primary text-white' : 'bg-transparent text-secondary'}" style="width: 38px; height: 38px;" href="#" onclick="event.preventDefault(); window.shopGoToPage(${i})">
          ${i}
        </a>
      </li>`;
  }

  // Right arrow
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link rounded-circle d-flex align-items-center justify-content-center border-0 p-0 mx-1 bg-transparent text-secondary" style="width: 38px; height: 38px;" href="#" onclick="event.preventDefault(); window.shopGoToPage(${currentPage + 1})">
        <i class="fa-solid fa-chevron-right"></i>
      </a>
    </li>`;

  pagination.innerHTML = html;
}

function resetAllFilters() {
  selectedCategory = "all";
  searchPattern = "";
  maxPrice = 25000;
  selectedOccasions = [];
  selectedMaterials = [];
  
  // Reset UI components
  const searchInput = document.getElementById('desktopSearchInput');
  if (searchInput) searchInput.value = '';
  
  const priceRange = document.getElementById('priceRange');
  if (priceRange) priceRange.value = 25000;

  const priceDisplay = document.getElementById('priceDisplay');
  if (priceDisplay) priceDisplay.innerText = '₹25,000+';

  document.querySelectorAll('[data-filter-occasion]').forEach(pill => {
    pill.classList.remove('bg-primary-container', 'text-on-primary-container');
  });
  const allPill = document.querySelector('[data-filter-occasion="all"]');
  if (allPill) allPill.classList.add('bg-primary-container', 'text-on-primary-container');

  document.querySelectorAll('[data-filter-material]').forEach(chk => chk.checked = false);

  updateCategoryUI("all");
  currentPage = 1;
  renderShop();
}

window.shopGoToPage = (page) => {
  currentPage = page;
  renderShop();
};

// Initialize Shop All Page
if (document.readyState !== 'loading') {
  initShop();
} else {
  document.addEventListener('DOMContentLoaded', initShop);
}