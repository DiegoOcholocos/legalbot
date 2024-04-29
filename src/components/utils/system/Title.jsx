import React from 'react';

export default function Title({ children, title, size = '3xl' }) {
  return (
    <div className='p-4 flex justify-between items-center'>
      <h1 className={`text-${size} font-bold flex-1`}>{title}</h1> {children}
    </div>
  );
}
