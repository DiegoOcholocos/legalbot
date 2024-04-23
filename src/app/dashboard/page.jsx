import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { validarEstudio } from '@/services/Session/validacionEstudio';
import {
  obtenerExpedientesFechasCount,
  obtenerExpedientesTotales,
} from '@/services/Prisma/Expediente';
import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';
import TopCards from '@/components/utils/TopCards';

export default async function pageDashboard() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });

  let data = [
    {
      id: 1,
      nombre: 'Procesos Activos',
      valor: 0,
      href: '/dashboard/expedientes',
    },
    {
      id: 2,
      nombre: 'Procesos Inactivos',
      valor: 0,
      href: '/dashboard/expedientes',
    },
    {
      id: 3,
      nombre: 'Usuarios Activos',
      valor: 0,
      href: '/dashboard/usuarios',
    },
  ];

  const expsActivos = await obtenerExpedientesFechasCount(estudio);
  const expsTotales = await obtenerExpedientesTotales(estudio);

  const userData = await listarUsuarios();
  const filteredUsersLength = userData.filter(
    (user) => user.Enabled === true
  ).length;

  data = data.map((objeto) => {
    switch (objeto.nombre) {
      case 'Procesos Activos':
        return { ...objeto, valor: expsActivos.length };
      case 'Procesos Inactivos':
        return { ...objeto, valor: expsTotales.length - expsActivos.length };
      case 'Usuarios Activos':
        return { ...objeto, valor: filteredUsersLength };
      default:
        return objeto;
    }
  });

  return <TopCards data={data} />;
}
