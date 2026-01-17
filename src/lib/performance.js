/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source
 */
export function lazyLoadImage(img, src) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = src;
          entry.target.classList.remove('opacity-0');
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src;
  }
}

/**
 * Preload critical resources
 * @param {Array<string>} urls - URLs to preload
 * @param {string} type - Resource type (image, script, style)
 */
export function preloadResources(urls, type = 'image') {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  });
}

/**
 * Measure and log performance metrics
 * @param {string} name - Performance mark name
 * @param {Function} fn - Function to measure
 * @returns {Promise<any>} Function result
 */
export async function measurePerformance(name, fn) {
  if (typeof performance !== 'undefined') {
    performance.mark(`${name}-start`);
    const result = await fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
    }

    return result;
  }
  return await fn();
}

/**
 * Cache function results with TTL
 * @param {Function} fn - Function to cache
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Function} Cached function
 */
export function memoizeWithTTL(fn, ttl = 5 * 60 * 1000) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: Date.now() });

    return result;
  };
}

/**
 * Optimize animations for better performance
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 */
export function optimizeAnimation(element, options = {}) {
  // Use transform and opacity for better performance
  element.style.willChange = 'transform, opacity';

  // Clean up after animation
  const cleanup = () => {
    element.style.willChange = 'auto';
  };

  if (options.duration) {
    setTimeout(cleanup, options.duration);
  }

  return cleanup;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get device performance tier
 * @returns {string} Performance tier (high, medium, low)
 */
export function getPerformanceTier() {
  if (typeof navigator === 'undefined') return 'medium';

  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (memory >= 8 && cores >= 8) return 'high';
  if (memory >= 4 && cores >= 4) return 'medium';
  return 'low';
}
