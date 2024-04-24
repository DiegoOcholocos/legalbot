import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import HomeComponent from '@/components/pages/HomeComponent';
export default async function Home() {
  const session = await getServerSession(options);
  return (
    <>
      <HomeComponent session={session} />
    </>
  );
}
