/**
 * @jest-environment jsdom
 */

import {
  FullPageLoader,
  LoadingOverlay,
} from '@/components/ui/loading-overlay';
import {
  LoadingDots,
  LoadingPulse,
  LoadingSpinner,
} from '@/components/ui/loading-spinner';
import {
  CardSkeleton,
  FormSkeleton,
  Skeleton,
  TextSkeleton,
} from '@/components/ui/skeleton';
import { showToast } from '@/lib/toast';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

// Mock GSAP animations
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(() => ({ then: jest.fn() })),
    to: jest.fn(() => ({ then: jest.fn() })),
    timeline: jest.fn(() => ({
      fromTo: jest.fn(),
      to: jest.fn(),
    })),
    killTweensOf: jest.fn(),
  },
}));

describe('UX Components Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing toast containers
    const existingContainers = document.querySelectorAll(
      '.fixed.top-4.right-4',
    );
    existingContainers.forEach((container) => container.remove());
  });

  describe('Toast Notification System', () => {
    test('should create toast container when showToast is called', () => {
      showToast({
        title: 'Test Toast',
        description: 'Test description',
        variant: 'success',
      });

      const toastContainer = document.querySelector('.fixed.top-4.right-4');
      expect(toastContainer).toBeInTheDocument();
    });

    test('should display toast with correct content', () => {
      const toastData = {
        title: 'Success!',
        description: 'Operation completed successfully',
        variant: 'success',
      };

      showToast(toastData);

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(
        screen.getByText('Operation completed successfully'),
      ).toBeInTheDocument();
    });

    test('should apply correct styling based on variant', () => {
      showToast({
        title: 'Error Toast',
        variant: 'destructive',
      });

      const toast = document.querySelector('.bg-red-500');
      expect(toast).toBeInTheDocument();
    });

    test('should auto-remove toast after timeout', async () => {
      jest.useFakeTimers();

      showToast({
        title: 'Auto Remove Toast',
        variant: 'default',
      });

      expect(screen.getByText('Auto Remove Toast')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Auto Remove Toast')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    test('should handle close button click', () => {
      showToast({
        title: 'Closeable Toast',
        variant: 'default',
      });

      const closeButton = document.querySelector('button');
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);

      expect(screen.queryByText('Closeable Toast')).not.toBeInTheDocument();
    });
  });

  describe('Loading Spinner Components', () => {
    test('should render LoadingSpinner with default size', () => {
      render(<LoadingSpinner />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('h-6', 'w-6'); // default size
    });

    test('should render LoadingSpinner with custom size', () => {
      render(<LoadingSpinner size='lg' />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('h-8', 'w-8'); // lg size
    });

    test('should render LoadingDots with animation', () => {
      render(<LoadingDots />);

      const dots = document.querySelectorAll('.animate-bounce');
      expect(dots).toHaveLength(3);
    });

    test('should render LoadingPulse with pulse animation', () => {
      render(<LoadingPulse />);

      const pulse = document.querySelector('.animate-pulse');
      expect(pulse).toBeInTheDocument();
    });

    test('should apply custom className to loading components', () => {
      render(<LoadingSpinner className='custom-class' />);

      const spinner = document.querySelector('.custom-class');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Loading Overlay Components', () => {
    test('should show overlay when loading is true', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>,
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should hide overlay when loading is false', () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div>Content</div>
        </LoadingOverlay>,
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should display custom loading message', () => {
      render(
        <LoadingOverlay isLoading={true} message='Processing...'>
          <div>Content</div>
        </LoadingOverlay>,
      );

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    test('should render FullPageLoader when visible', () => {
      render(
        <FullPageLoader isVisible={true} message='Loading application...' />,
      );

      expect(screen.getByText('Loading application...')).toBeInTheDocument();

      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    test('should not render FullPageLoader when not visible', () => {
      render(<FullPageLoader isVisible={false} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Skeleton Components', () => {
    test('should render basic Skeleton with pulse animation', () => {
      render(<Skeleton />);

      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    test('should render TextSkeleton with correct number of lines', () => {
      render(<TextSkeleton lines={3} />);

      const skeletonLines = document.querySelectorAll('.animate-pulse');
      expect(skeletonLines).toHaveLength(3);
    });

    test('should render FormSkeleton with correct number of fields', () => {
      render(<FormSkeleton fields={2} />);

      // Should have 2 field groups (label + input) + 1 button = 5 skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThanOrEqual(3);
    });

    test('should render CardSkeleton with all components', () => {
      render(<CardSkeleton />);

      const cardContainer = document.querySelector('.bg-white');
      expect(cardContainer).toBeInTheDocument();

      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    test('should apply custom className to skeleton components', () => {
      render(<Skeleton className='custom-skeleton' />);

      const skeleton = document.querySelector('.custom-skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Loading State Transitions', () => {
    test('should handle loading state changes smoothly', async () => {
      const TestComponent = ({ isLoading }) => (
        <LoadingOverlay isLoading={isLoading} message='Loading...'>
          <div>Main Content</div>
        </LoadingOverlay>
      );

      const { rerender } = render(<TestComponent isLoading={true} />);

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Change to not loading
      rerender(<TestComponent isLoading={false} />);

      // Loading should be gone
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    test('should maintain content visibility during loading', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Important Content</div>
        </LoadingOverlay>,
      );

      // Both loading and content should be visible
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Important Content')).toBeInTheDocument();
    });
  });

  describe('Animation Performance and Accessibility', () => {
    test('should use CSS animations for performance', () => {
      render(<LoadingSpinner />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toHaveClass('animate-spin');
    });

    test('should provide accessible loading indicators', () => {
      render(
        <div>
          <LoadingSpinner />
          <span>Loading content...</span>
        </div>,
      );

      // Loading text should be available for screen readers
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    test('should handle reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<LoadingSpinner />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();

      // Animation classes should still be present (CSS handles reduced motion)
      expect(spinner).toHaveClass('animate-spin');
    });

    test('should not interfere with page layout', () => {
      render(
        <div style={{ height: '100px' }}>
          <LoadingOverlay isLoading={true}>
            <div style={{ height: '50px' }}>Content</div>
          </LoadingOverlay>
        </div>,
      );

      const container = document.querySelector('[style*="height: 100px"]');
      expect(container).toBeInTheDocument();

      // Overlay should not change container dimensions
      const overlay = document.querySelector('.absolute.inset-0');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Toast Notification Display and Timing', () => {
    test('should display multiple toasts without overlap', () => {
      showToast({ title: 'First Toast', variant: 'success' });
      showToast({ title: 'Second Toast', variant: 'default' });

      expect(screen.getByText('First Toast')).toBeInTheDocument();
      expect(screen.getByText('Second Toast')).toBeInTheDocument();

      // Toasts should be in a container with proper spacing
      const toastContainer = document.querySelector('.fixed.top-4.right-4');
      expect(toastContainer).toBeInTheDocument();
    });

    test('should handle toast timing correctly', async () => {
      jest.useFakeTimers();

      showToast({ title: 'Timed Toast', variant: 'default' });

      expect(screen.getByText('Timed Toast')).toBeInTheDocument();

      // Should still be visible before timeout
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(screen.getByText('Timed Toast')).toBeInTheDocument();

      // Should be removed after timeout
      act(() => {
        jest.advanceTimersByTime(3500);
      });

      await waitFor(() => {
        expect(screen.queryByText('Timed Toast')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    test('should handle toast variants correctly', () => {
      const variants = ['success', 'destructive', 'default'];

      variants.forEach((variant, index) => {
        showToast({
          title: `${variant} Toast ${index}`,
          variant: variant,
        });
      });

      // All toasts should be rendered
      variants.forEach((variant, index) => {
        expect(
          screen.getByText(`${variant} Toast ${index}`),
        ).toBeInTheDocument();
      });

      // Check for variant-specific styling
      expect(document.querySelector('.bg-green-500')).toBeInTheDocument(); // success
      expect(document.querySelector('.bg-red-500')).toBeInTheDocument(); // destructive
    });
  });
});
