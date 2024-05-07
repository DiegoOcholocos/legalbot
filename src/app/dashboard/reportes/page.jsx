import { getServerSession } from 'next-auth';
import { menu } from "@/services/data";
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';
import { validarEstudio } from '@/services/Session/validacionEstudio';
import DashboardComponent from '@/components/pages/DashboardComponent';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';

export default async function page() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });
  const usuarios = await obtenerUsuarios();
  return <Unauthorized user={session.user} permisos={menu[2].permisos} children={<DashboardComponent estudio={estudio} usuariosTotales={usuarios} />}/>;
}
