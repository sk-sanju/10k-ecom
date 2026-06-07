// assets/js/footer.js
// Injects the premium footer and dynamic links

export function initFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  // Add bootstrap classes to footer
  footer.className = "bg-white border-top py-stack-xl mt-stack-xl";

  // Check if current page is inside the policies subdirectory
  const path = window.location.pathname;
  const isInSubdir = path.includes('/policies/') || path.split('/').slice(-2)[0] === 'policies';
  
  const prefix = isInSubdir ? '../' : '';
  const policyPrefix = isInSubdir ? '' : 'policies/';
  const currentYear = new Date().getFullYear();

  // Inject footer HTML
  footer.innerHTML = `
    <div class="container max-w-container-max-width px-3 px-md-4">
      <div class="row g-4 mb-stack-lg">
        
        <!-- Column 1: Brand & Socials -->
        <div class="col-12 col-md-4 col-lg-3">
          <span class="font-display-lg text-primary d-block mb-3" style="font-size: 1.8rem;">Kuthampully Heritage</span>
          <p class="font-body-sm text-secondary mb-4 leading-relaxed">
            Preserving the legacy of Kerala's handloom weavers since 1924. Every piece is a masterpiece of tradition, crafted with sovereign perfection.
          </p>
          <div class="d-flex gap-3">
            <a href="https://instagram.com" target="_blank" class="text-primary text-decoration-none" style="font-size: 1.25rem; transition: transform 0.2s;"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://facebook.com" target="_blank" class="text-primary text-decoration-none" style="font-size: 1.25rem; transition: transform 0.2s;"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://pinterest.com" target="_blank" class="text-primary text-decoration-none" style="font-size: 1.25rem; transition: transform 0.2s;"><i class="fa-brands fa-pinterest-p"></i></a>
          </div>
        </div>

        <!-- Column 2: Collections -->
        <div class="col-6 col-md-4 col-lg-3">
          <h5 class="font-label-lg text-neutral-dark mb-4">Collections</h5>
          <ul class="list-unstyled d-flex flex-column gap-2 m-0">
            <li><a class="footer-link font-body-sm" href="${prefix}shop.html?category=mens">Mens Heritage</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}shop.html?category=womens">Womens Classics</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}shop.html?category=boys">Boys Traditional</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}shop.html?category=girls">Girls Traditional</a></li>
          </ul>
        </div>

        <!-- Column 3: Information & Policies -->
        <div class="col-6 col-md-4 col-lg-3">
          <h5 class="font-label-lg text-neutral-dark mb-4">Information</h5>
          <ul class="list-unstyled d-flex flex-column gap-2 m-0">
            <li><a class="footer-link font-body-sm" href="${prefix}about.html">About Our Weavers</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}${policyPrefix}shipping-policy.html">Shipping Policy</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}${policyPrefix}return-policy.html">Returns & Exchanges</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}${policyPrefix}privacy-policy.html">Privacy Policy</a></li>
            <li><a class="footer-link font-body-sm" href="${prefix}${policyPrefix}terms-and-conditions.html">Terms & Conditions</a></li>
          </ul>
        </div>

        <!-- Column 4: Visit Store / Contact -->
        <div class="col-12 col-lg-3">
          <h5 class="font-label-lg text-neutral-dark mb-4">Visit Us</h5>
          <p class="font-body-sm text-secondary mb-3 leading-relaxed">
            Main Bazaar, Kuthampully Village,<br>
            Thrissur District, Kerala - 680594
          </p>
          <p class="font-body-sm text-secondary m-0 leading-relaxed">
            <strong>Phone:</strong> +91 9744935628<br>
            <strong>Email:</strong> care@kuthampullyheritage.com
          </p>
        </div>

      </div>

      <!-- Copyright Bar -->
      <div class="border-top pt-4 mt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <p class="font-body-sm text-secondary m-0 text-center text-md-start">
          © ${currentYear} Kuthampully Heritage. Handcrafted in Kerala. All Rights Reserved.
        </p>
      </div>
    </div>
  `;
}

// Auto-initialize when DOM is ready
if (document.readyState !== 'loading') {
  initFooter();
} else {
  document.addEventListener('DOMContentLoaded', initFooter);
}
