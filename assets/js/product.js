// assets/js/product.js
// Product rendering, filtering, sorting, and pagination for Kerala Traditional Clothing Store

const perPage = 12;
let currentPage = 1;
let currentFilter = "all";
let currentSort = "default";
let productsData = [];

// Fetch products from JSON
async function loadProducts() {
  try {
    const res = await fetch("../data/products.json");
    productsData = await res.json();
    render();
  } catch (e) {
    console.error("Failed to load products", e);
  }
}

function applyFilter(filter) {
  currentFilter = filter;
  currentPage = 1;
  render();
}

function applySort(sort) {
  currentSort = sort;
  currentPage = 1;
  render();
}

function getFiltered() {
  if (currentFilter === "all") return productsData;
  return productsData.filter(p => p.category === currentFilter);
}

function getSorted(arr) {
  const sorted = [...arr];
  switch (currentSort) {
    case "priceAsc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "priceDesc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "ratingDesc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // keep original order
      break;
  }
  return sorted;
}

function renderProductsPage(page) {
  const container = document.getElementById("productGrid");
  if (!container) return;
  const filtered = getSorted(getFiltered());
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = filtered.slice(start, end);
  container.innerHTML = "";
  pageItems.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3">
        <div class="product-card">
          <img src="${p.img}" alt="${p.name}" class="img-fluid" />
          <div class="info mt-2">
            <h5 class="mb-1">${p.name}</h5>
            <p class="price mb-1">₹${p.price}</p>
            <div class="mb-2">
              ${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))}
            </div>
            <button class="btn btn-success w-100 mb-1" onclick="buyNow(${p.id})">Buy Now</button>
            <button class="btn btn-warning w-100" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / perPage);
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
               <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
             </li>`;
  }
  pagination.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  render();
}

function render() {
  const filtered = getSorted(getFiltered());
  renderProductsPage(currentPage);
  renderPagination(filtered.length);
}

// Expose filter functions to HTML
window.renderProducts = applyFilter;
window.applySort = applySort;
window.goToPage = goToPage;

// Initialize on load
loadProducts();