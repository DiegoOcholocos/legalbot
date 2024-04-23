import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import HomeComponent from '@/components/pages/HomeComponent';
import { ControlSession } from '@/services/Session/controlSession';

export default async function Home() {
  const session = await getServerSession(options);
  return (
    <>
      <ControlSession session={session} />
      <HomeComponent />
    </>
  );
}
