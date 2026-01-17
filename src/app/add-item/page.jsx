'use client';

import { AddItemForm } from '@/components/items/AddItemForm';

export default function AddItemPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8'>
          Add New Item
        </h1>
        <AddItemForm />
      </div>
    </div>
  );
}
