'use client';

import { Button } from '@/components/ui/button';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
          <div className='max-w-md w-full mx-auto p-6 text-center'>
            <div className='text-6xl mb-4'>⚠️</div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
              Something went wrong
            </h1>
            <p className='text-slate-600 dark:text-slate-400 mb-6'>
              We apologize for the inconvenience. An unexpected error has
              occurred.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mb-6 text-left'>
                <summary className='cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  Error Details (Development)
                </summary>
                <pre className='text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto'>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className='space-y-3'>
              <Button
                onClick={() => this.setState({ hasError: false })}
                className='w-full'
              >
                Try Again
              </Button>
              <Button
                variant='outline'
                onClick={() => window.location.reload()}
                className='w-full'
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
