import React from 'react';

interface EyebrowHeadingProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

export function EyebrowHeading({ icon, text, className = '' }: EyebrowHeadingProps) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <div className="text-primary-500 w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}
