// assets/js/navbar.js
// Injects the premium responsive navigation bar and handles interactivity

export function initNavbar() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // Add bootstrap and theme styling classes to header
  header.className = "bg-white sticky-top w-100 py-3 transition-all duration-300";

  // Determine current active page based on URL
  const path = window.location.pathname;
  const pageName = path.split("/").pop() || "index.html";
  const isInSubdir = path.includes('/policies/') || path.split('/').slice(-2)[0] === 'policies';
  const prefix = isInSubdir ? '../' : '';

  const isHome = pageName === "index.html" ? "active" : "";
  const isShop = pageName === "shop.html" || pageName === "product.html" ? "active" : "";
  const isAbout = pageName === "about.html" ? "active" : "";
  const isContact = pageName === "contact.html" ? "active" : "";

  // Inject navbar HTML
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light p-0">
      <div class="container d-flex justify-content-between align-items-center max-w-container-max-width px-3 px-md-4">
        
        <!-- Logo -->
        <a class="navbar-brand m-0" href="${prefix}index.html">Kuthampully Heritage</a>

        <!-- Desktop Navigation Center Links -->
        <div class="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="nav-desktop-menu">
          <div class="navbar-nav gap-4">
            <a class="nav-link nav-link-custom ${isHome}" href="${prefix}index.html">Home</a>
            <a class="nav-link nav-link-custom ${isShop}" href="${prefix}shop.html">Shop</a>
            <a class="nav-link nav-link-custom ${isAbout}" href="${prefix}about.html">About</a>
            <a class="nav-link nav-link-custom ${isContact}" href="${prefix}contact.html">Contact</a>
          </div>
        </div>

        <!-- Right Utilities (Search, Cart, Hamburguer) -->
        <div class="d-flex align-items-center gap-3">
          
          <!-- Search Bar (Desktop) -->
          <div class="position-relative d-none d-lg-block">
            <input id="desktopSearchInput" class="form-control-luxe rounded-pill ps-4 pe-5 py-2 font-body-sm" placeholder="Search heritage weaves..." type="text" style="width: 250px; border-radius: 9999px;">
            <i class="fa-solid fa-magnifying-glass position-absolute end-0 top-50 translate-middle-y me-3 text-muted" id="desktopSearchBtn" style="cursor: pointer;"></i>
          </div>

          <!-- Cart Icon -->
          <a href="${prefix}cart.html" class="position-relative p-2 text-decoration-none text-primary" style="font-size: 1.5rem; transition: transform 0.2s;">
            <i class="fa-solid fa-cart-shopping"></i>
            <span id="cartCount" class="position-absolute bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="top: -2px; right: -2px; width: 18px; height: 18px; font-size: 10px; font-weight: 700; font-family: var(--font-sans);">0</span>
          </a>

          <!-- Mobile Toggle Menu Icon -->
          <button class="btn p-2 border-0 text-primary d-lg-none" id="mobileMenuOpenBtn" style="font-size: 1.5rem;">
            <i class="fa-solid fa-bars"></i>
          </button>

        </div>
      </div>
    </nav>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-menu-overlay" id="mobileMenuDrawer">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <span class="font-display-lg text-primary" style="font-size: 1.8rem;">Kuthampully</span>
        <button class="btn border-0 text-dark p-2" id="mobileMenuCloseBtn" style="font-size: 1.5rem;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="d-flex flex-column gap-4 fs-2 mb-5">
        <a class="text-decoration-none text-dark font-display-lg py-1 ${isHome ? 'text-primary' : ''}" href="${prefix}index.html">Home</a>
        <a class="text-decoration-none text-dark font-display-lg py-1 ${isShop ? 'text-primary' : ''}" href="${prefix}shop.html">Shop</a>
        <a class="text-decoration-none text-dark font-display-lg py-1 ${isAbout ? 'text-primary' : ''}" href="${prefix}about.html">About</a>
        <a class="text-decoration-none text-dark font-display-lg py-1 ${isContact ? 'text-primary' : ''}" href="${prefix}contact.html">Contact</a>
      </div>

      <!-- Mobile Search -->
      <div class="position-relative w-100 mt-3">
        <input id="mobileSearchInput" class="form-control-luxe rounded-pill ps-4 pe-5 py-3 w-100" placeholder="Search products..." type="text">
        <i class="fa-solid fa-magnifying-glass position-absolute end-0 top-50 translate-middle-y me-3 text-muted" id="mobileSearchBtn" style="cursor: pointer;"></i>
      </div>
    </div>
  `;

  // Attach search logic
  const desktopSearchInput = document.getElementById('desktopSearchInput');
  const desktopSearchBtn = document.getElementById('desktopSearchBtn');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');

  function handleSearch(query) {
    if (query && query.trim() !== '') {
      window.location.href = `${prefix}shop.html?search=${encodeURIComponent(query.trim())}`;
    }
  }

  if (desktopSearchInput) {
    desktopSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch(desktopSearchInput.value);
    });
  }
  if (desktopSearchBtn) {
    desktopSearchBtn.addEventListener('click', () => {
      handleSearch(desktopSearchInput.value);
    });
  }
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch(mobileSearchInput.value);
    });
  }
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      handleSearch(mobileSearchInput.value);
    });
  }

  // Mobile drawer controls
  const openBtn = document.getElementById('mobileMenuOpenBtn');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const drawer = document.getElementById('mobileMenuDrawer');

  if (openBtn && drawer) {
    openBtn.addEventListener('click', () => {
      drawer.classList.add('active');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  // Sticky functionality via window scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.classList.remove('py-3');
      header.classList.add('py-2');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('py-3');
      header.classList.remove('py-2');
    }
  });

  // Sync Cart badge count
  updateCartBadge();
}

export function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Count total quantities
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    badge.innerText = totalQty;
    // Hide or style badge if empty
    if (totalQty === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState !== 'loading') {
  initNavbar();
} else {
  document.addEventListener('DOMContentLoaded', initNavbar);
}
