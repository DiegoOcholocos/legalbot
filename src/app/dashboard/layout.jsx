import LayoutDashboard from '@/components/pages/Layouts/LayoutDashboard';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { validarEstudio } from '@/services/Session/validacionEstudio';

export default async function layout({ children }) {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });
  return (
    <LayoutDashboard session={session} estudio={estudio}>
      {children}
    </LayoutDashboard>
  );
}
