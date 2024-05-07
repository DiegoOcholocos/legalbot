import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { validarEstudio } from '@/services/Session/validacionEstudio';
import DashboardComponent from '@/components/pages/DashboardComponent';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';

export default async function page() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });
  const usuarios = await obtenerUsuarios();
  return <DashboardComponent estudio={estudio} usuariosTotales={usuarios} />;
}
