// Simple toast utility that works with SSR
let toastContainer = null;

function createToastContainer() {
  if (typeof window === 'undefined') return null;

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast({ title, description, variant = 'default' }) {
  if (typeof window === 'undefined') return;

  const container = createToastContainer();
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `
    max-w-sm p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-2 duration-300
    ${
      variant === 'success'
        ? 'bg-green-500 text-white border-green-600'
        : variant === 'destructive'
          ? 'bg-red-500 text-white border-red-600'
          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border-slate-200 dark:border-slate-700'
    }
  `
    .replace(/\s+/g, ' ')
    .trim();

  toast.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex-1">
        ${title ? `<div class="font-semibold text-sm mb-1">${title}</div>` : ''}
        ${description ? `<div class="text-sm opacity-90">${description}</div>` : ''}
      </div>
      <button class="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  // Add close functionality
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 5000);
}
