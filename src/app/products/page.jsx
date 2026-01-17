'use client';

import { ItemList } from '@/components/items/ItemList';
import { animations } from '@/lib/animations';
import { useEffect, useRef } from 'react';

export default function Products() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      animations.pageEnter(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className='opacity-0'>
      <ItemList />
    </div>
  );
}
