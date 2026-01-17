import { gsap } from 'gsap';
import { getPerformanceTier, prefersReducedMotion } from './performance.js';

// Performance-aware animation configuration
const getAnimationConfig = () => {
  const reducedMotion = prefersReducedMotion();
  const performanceTier = getPerformanceTier();

  if (reducedMotion) {
    return { duration: 0.01, ease: 'none' };
  }

  switch (performanceTier) {
    case 'low':
      return { duration: 0.3, ease: 'power1.out' };
    case 'medium':
      return { duration: 0.5, ease: 'power2.out' };
    case 'high':
    default:
      return { duration: 0.6, ease: 'power2.out' };
  }
};

// Animation utilities for the e-commerce platform
export const animations = {
  // Page transition animations
  pageEnter: (element) => {
    const config = getAnimationConfig();
    return gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ...config },
    );
  },

  pageExit: (element) => {
    const config = getAnimationConfig();
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: config.duration * 0.7,
      ease: config.ease,
    });
  },

  // Enhanced page transitions
  slideInFromBottom: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out' },
    );
  },

  slideInFromTop: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out' },
    );
  },

  scaleIn: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay, ease: 'back.out(1.7)' },
    );
  },

  // Card hover animations
  cardHover: (element) => {
    return gsap.to(element, {
      y: -5,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  },

  cardHoverOut: (element) => {
    return gsap.to(element, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  },

  // Button animations
  buttonPress: (element) => {
    return gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  },

  // Loading animations
  fadeIn: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay, ease: 'power2.out' },
    );
  },

  fadeOut: (element, delay = 0) => {
    return gsap.to(element, {
      opacity: 0,
      duration: 0.3,
      delay,
      ease: 'power2.in',
    });
  },

  // Loading state transitions
  loadingEnter: (element) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
    );
  },

  loadingExit: (element) => {
    return gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
    });
  },

  // Skeleton shimmer effect
  shimmer: (element) => {
    return gsap.fromTo(
      element,
      { backgroundPosition: '-200px 0' },
      {
        backgroundPosition: 'calc(200px + 100%) 0',
        duration: 1.5,
        ease: 'none',
        repeat: -1,
      },
    );
  },

  // Spinner rotation
  spin: (element) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1,
    });
  },

  // Pulse animation for loading states
  pulse: (element) => {
    return gsap.to(element, {
      opacity: 0.5,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut',
    });
  },

  slideInFromLeft: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay, ease: 'power2.out' },
    );
  },

  slideInFromRight: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay, ease: 'power2.out' },
    );
  },

  // Stagger animations for lists
  staggerFadeIn: (elements, stagger = 0.1) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
      },
    );
  },

  // Theme transition animation
  themeTransition: (element) => {
    return gsap.to(element, {
      duration: 0.3,
      ease: 'power2.inOut',
    });
  },
};

// Animation context for React components
export const AnimationContext = {
  timeline: null,

  createTimeline: (options = {}) => {
    return gsap.timeline(options);
  },

  killAll: () => {
    gsap.killTweensOf('*');
  },
};
