// assets/js/footer.js
// Footer component: injects footer HTML into the placeholder element.
export function initFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <h5>About</h5>
          <p>Kerala Traditional Online Store offering quality fashion products with WhatsApp ordering system.</p>
        </div>
        <div class="col-md-3">
          <h5>Quick Links</h5>
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="cart.html">Cart</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="col-md-3">
          <h5>Policies</h5>
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="shipping-policy.html">Shipping Policy</a>
          <a href="terms-conditions.html">Terms &amp; Conditions</a>
        </div>
        <div class="col-md-3">
          <h5>Contact</h5>
          <a href="https://wa.me/919744935628" target="_blank">WhatsApp</a>
          <a href="mailto:info@keralastore.com">Email</a>
          <a href="https://www.instagram.com/keralastore" target="_blank">Instagram</a>
        </div>
      </div>
      <div class="footer-bottom mt-3 text-center">
        © ${currentYear} Kerala Store | All Rights Reserved
      </div>
    </div>`;
}

// Auto‑initialize when DOM is ready
if (document.readyState !== 'loading') {
  initFooter();
} else {
  document.addEventListener('DOMContentLoaded', initFooter);
}
