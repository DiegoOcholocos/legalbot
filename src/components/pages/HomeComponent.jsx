'use client';
import React from 'react';
import Loading from '../utils/system/Loading';
import { controlSessionExpired } from '@/services/Session/controlSession';
import { useRouter } from 'next/navigation';

export default function HomeComponent({ session }) {
  const router = useRouter();
  const isExpired = controlSessionExpired({ session });
  if (isExpired) {
    router.push('/auth/login');
  } else {
    router.push('/dashboard');
  }
  return <Loading />;
}
