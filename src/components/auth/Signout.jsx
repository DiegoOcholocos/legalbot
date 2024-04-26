'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Loading from '../utils/system/Loading';

export default function Signout() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(async () => {
      await signOut();
    }, 1000);
    router.push('/');
  }, []);
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-2'>
      <Loading />
      <h2 className='text-sm mt-36'>Sesión Caducada</h2>
      <h2 className='text-sm'>Porfavor Vuelva a inciar sesión</h2>
    </div>
  );
}
