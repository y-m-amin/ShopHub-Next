'use client';

import { useState } from 'react';

export default function SetupPage() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSetup = async (force = false) => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Setup failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error occurred');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-center mb-6'>Database Setup</h1>

        <div className='space-y-4'>
          <p className='text-gray-600 text-center'>
            Initialize your PostgreSQL database with tables and sample data.
          </p>

          <div className='space-y-3'>
            <button
              onClick={() => handleSetup(false)}
              disabled={status === 'loading'}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                status === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {status === 'loading' ? 'Setting up...' : 'Initialize Database'}
            </button>

            <button
              onClick={() => handleSetup(true)}
              disabled={status === 'loading'}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                status === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white transition-colors`}
            >
              {status === 'loading' ? 'Re-seeding...' : 'Force Re-seed Data'}
            </button>
          </div>

          <div className='text-xs text-gray-500 text-center'>
            <p><strong>Initialize:</strong> Sets up tables and adds data if none exists</p>
            <p><strong>Force Re-seed:</strong> Clears existing products and adds fresh data</p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md ${
                status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : status === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }`}
            >
              {message}
            </div>
          )}

          {status === 'success' && (
            <div className='text-center'>
              <a
                href='/'
                className='text-blue-600 hover:text-blue-800 underline'
              >
                Go to Homepage
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
