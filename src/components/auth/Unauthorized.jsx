'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loading from '../utils/system/Loading';

export default function Unauthorized({ user, permisos, children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
    const hasAccess = permisos.includes(user.tipoUsuario);

    if (!hasAccess) {
      router.push('/not-found');
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className='relative w-full h-full'>
          <Loading />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
