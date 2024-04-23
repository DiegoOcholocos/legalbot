import React from 'react';

export default function Title({ children, title }) {
  return (
    <div className='p-4 flex justify-between items-center'>
      <h1 className='text-3xl font-bold flex-1'>{title}</h1> {children}
    </div>
  );
}
