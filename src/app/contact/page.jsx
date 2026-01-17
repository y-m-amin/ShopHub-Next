'use client';

import { animations } from '@/lib/animations';
import { useEffect, useRef } from 'react';

const Contact = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      animations.slideInFromBottom(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className='opacity-0 container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8'>
          Contact Us
        </h1>
        <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700'>
          <p className='text-slate-600 dark:text-slate-400 mb-4'>
            Get in touch with us for any questions or support.
          </p>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50'>
                Email
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                support@shophub.com
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50'>
                Phone
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                +1 (555) 123-4567
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50'>
                Address
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                123 Commerce Street
                <br />
                Business District
                <br />
                City, State 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
