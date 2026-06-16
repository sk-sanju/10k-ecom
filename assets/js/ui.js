// assets/js/ui.js
// UI Enhancement Module: Toast notifications, Scroll-to-Top, Quick View Modal, Loading
// Kavish – UI Utilities

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   Usage: window.showToast(message, type) 
   type: 'success' | 'error' | 'warning' | 'info'
   ============================================================ */

let toastContainer = null;

function createToastContainer() {
  if (toastContainer) return;
  toastContainer = document.createElement('div');
  toastContainer.id = 'kv-toast-container';
  toastContainer.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:24px',
    'z-index:9999',
    'display:flex',
    'flex-direction:column',
    'gap:10px',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(toastContainer);
}

export function showToast(message, type = 'success') {
  createToastContainer();

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };
  const colors = {
    success: '#166d13',
    error: '#dc3545',
    warning: '#f59e0b',
    info: '#735c00'
  };

  const toast = document.createElement('div');
  toast.style.cssText = [
    'background:#fff',
    'border-radius:12px',
    'padding:14px 18px',
    'display:flex',
    'align-items:center',
    'gap:12px',
    'box-shadow:0 8px 30px rgba(0,0,0,0.12)',
    `border-left:4px solid ${colors[type]}`,
    'font-family:var(--font-sans)',
    'font-size:14px',
    'color:#1c1b1b',
    'pointer-events:all',
    'min-width:280px',
    'max-width:360px',
    'transform:translateX(120%)',
    'transition:all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'opacity:0'
  ].join(';');

  toast.innerHTML = `
    <i class="fa-solid ${icons[type]}" style="color:${colors[type]};font-size:18px;"></i>
    <span style="flex-grow:1;line-height:1.4;">${message}</span>
    <button class="border-0 bg-transparent text-secondary" style="cursor:pointer;font-size:16px;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  // Close button
  toast.querySelector('button').onclick = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  };

  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  // Auto-remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// Attach to window for global access
window.showToast = showToast;
