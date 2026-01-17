export function ItemCardSkeleton() {
  return (
    <div className='bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse'>
      {/* Image skeleton */}
      <div className='aspect-square bg-slate-200 dark:bg-slate-700'></div>

      {/* Content skeleton */}
      <div className='p-4'>
        {/* Title skeleton */}
        <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2'></div>

        {/* Description skeleton */}
        <div className='space-y-2 mb-3'>
          <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded'></div>
          <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4'></div>
        </div>

        {/* Price and category skeleton */}
        <div className='flex items-center justify-between'>
          <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-20'></div>
          <div className='h-5 bg-slate-200 dark:bg-slate-700 rounded w-16'></div>
        </div>
      </div>
    </div>
  );
}
