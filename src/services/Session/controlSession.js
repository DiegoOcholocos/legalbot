'use client';
import { useRouter } from 'next/navigation';

export const ControlSession = ({ session }) => {
  const router = useRouter();
  console.log(session);
  if (session) {
    if (session.user.isExpired) {
      router.push('/auth/login');
    } else {
      router.push('/dashboard');
    }
  } else {
    router.push('/auth/login');
  }
};
