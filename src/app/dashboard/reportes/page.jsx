import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { validarEstudio } from '@/services/Session/validacionEstudio';
import DashboardComponent from '@/components/pages/DashboardComponent';

export default async function page() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });

  return <DashboardComponent estudio={estudio} />;
}
