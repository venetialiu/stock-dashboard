import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary-500"></div>
      <span className="mt-4 text-slate-600 dark:text-slate-400">Loading stock data...</span>
    </div>
  );
};

export default LoadingSpinner;