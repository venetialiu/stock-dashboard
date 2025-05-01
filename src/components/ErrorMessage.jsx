import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-danger-50 dark:bg-slate-800 border-l-4 border-danger-500 p-4 my-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-danger-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-danger-700 dark:text-danger-500">
            {message || 'An error occurred. Please try again later.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;