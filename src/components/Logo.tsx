import React from 'react';
import { cn } from '../lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("w-full h-full", className)}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer abstract shape */}
      <path d="M0 0 H100 V30 L70 0 Z" className="fill-brand-yellow font-black"/>
      <path d="M100 100 H0 V70 L30 100 Z" className="fill-brand-yellow/50"/>
      
      {/* Center abstract core */}
      <rect x="35" y="35" width="30" height="30" className="fill-black"/>
      <path d="M35 35 L65 65 M65 35 L35 65" stroke="currentColor" strokeWidth="2" className="text-brand-yellow/30" />
      
      {/* Decorative dots */}
      <circle cx="50" cy="50" r="2" className="fill-brand-yellow"/>
      <rect x="45" y="45" width="10" height="10" stroke="currentColor" strokeWidth="0.5" className="text-brand-yellow" />
    </svg>
  );
}
