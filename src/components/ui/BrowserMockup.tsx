import React from 'react';

interface BrowserMockupProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

export function BrowserMockup({ url, children, className = '' }: BrowserMockupProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Browser Header */}
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        {/* URL Bar */}
        <div className="ml-4 flex-1 max-w-md">
          <div className="bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-500">
            {url}
          </div>
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}
