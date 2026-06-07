// assets/js/navbar.js
// Handles sticky navbar, mobile hamburger toggle, cart badge update, and injects navbar HTML

export function initNavbar() {
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">Kerala Store</a>
          <button class="navbar-toggler" type="button" id="nav-toggle" aria-controls="nav-menu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="nav-menu">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="shop.html">Shop</a></li>
              <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
            </ul>
            <a href="cart.html" class="btn btn-outline-light position-relative me-2">
              <i class="bi bi-cart"></i> Cart
              <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
            </a>
          </div>
        </div>
      </nav>`;
  }

  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const headerEl = document.getElementById('site-header');

  // Sticky functionality handled via CSS; we toggle a class for visual effects.
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      headerEl && headerEl.classList.add('scrolled');
    } else {
      headerEl && headerEl.classList.remove('scrolled');
    }
  });

  // Mobile hamburger toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }
}

// Auto‑initialize when DOM is ready
if (document.readyState !== 'loading') {
  initNavbar();
} else {
  document.addEventListener('DOMContentLoaded', initNavbar);
}
