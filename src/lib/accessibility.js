/**
 * Accessibility utilities and helpers
 */

/**
 * Manages focus for modal dialogs and overlays
 */
export class FocusManager {
  constructor() {
    this.previousFocus = null;
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
  }

  /**
   * Trap focus within a container
   * @param {HTMLElement} container - Container element
   */
  trapFocus(container) {
    this.previousFocus = document.activeElement;

    const focusableElements = container.querySelectorAll(
      this.focusableElements,
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      this.restoreFocus();
    };
  }

  /**
   * Restore focus to previously focused element
   */
  restoreFocus() {
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }
}

/**
 * Announces messages to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level (polite, assertive)
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;

  document.body.appendChild(announcer);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Checks if an element is visible to screen readers
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible to screen readers
 */
export function isVisibleToScreenReader(element) {
  const style = window.getComputedStyle(element);
  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    element.hasAttribute('aria-hidden') ||
    element.hidden
  );
}

/**
 * Generates unique IDs for accessibility attributes
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateAccessibleId(prefix = 'accessible') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates color contrast ratio
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {Object} Contrast information
 */
export function checkColorContrast(foreground, background) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return { ratio: 0, level: 'fail' };

  const fgLum = getLuminance(fg);
  const bgLum = getLuminance(bg);

  const ratio =
    (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);

  let level = 'fail';
  if (ratio >= 7) level = 'AAA';
  else if (ratio >= 4.5) level = 'AA';
  else if (ratio >= 3) level = 'AA-large';

  return { ratio: Math.round(ratio * 100) / 100, level };
}

/**
 * Keyboard navigation helper
 */
export class KeyboardNavigation {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      selector: '[role="button"], button, a[href], input, select, textarea',
      wrap: true,
      ...options,
    };
    this.currentIndex = 0;
    this.elements = [];

    this.init();
  }

  init() {
    this.updateElements();
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  updateElements() {
    this.elements = Array.from(
      this.container.querySelectorAll(this.options.selector),
    ).filter((el) => !el.disabled && isVisibleToScreenReader(el));
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.moveNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.movePrevious();
        break;
      case 'Home':
        e.preventDefault();
        this.moveToFirst();
        break;
      case 'End':
        e.preventDefault();
        this.moveToLast();
        break;
    }
  }

  moveNext() {
    this.currentIndex = this.options.wrap
      ? (this.currentIndex + 1) % this.elements.length
      : Math.min(this.currentIndex + 1, this.elements.length - 1);
    this.focusCurrent();
  }

  movePrevious() {
    this.currentIndex = this.options.wrap
      ? (this.currentIndex - 1 + this.elements.length) % this.elements.length
      : Math.max(this.currentIndex - 1, 0);
    this.focusCurrent();
  }

  moveToFirst() {
    this.currentIndex = 0;
    this.focusCurrent();
  }

  moveToLast() {
    this.currentIndex = this.elements.length - 1;
    this.focusCurrent();
  }

  focusCurrent() {
    if (this.elements[this.currentIndex]) {
      this.elements[this.currentIndex].focus();
    }
  }
}

/**
 * Skip link component for keyboard navigation
 * @param {string} targetId - ID of target element
 * @param {string} text - Skip link text
 */
export function createSkipLink(targetId, text = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className =
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';

  document.body.insertBefore(skipLink, document.body.firstChild);

  return skipLink;
}
