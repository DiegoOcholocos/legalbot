import ListadoExpedientes from '@/components/class/expedientes/ListadoExpedientes';
import { getServerSession } from 'next-auth';
import { menu } from '@/services/data';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';
import { validarEstudio } from '@/services/Session/validacionEstudio';

export default async function pageExpedientes() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });
  return (
    <>
      <Unauthorized user={session.user} permisos={menu[1].permisos}>
        <ListadoExpedientes estudio={estudio} />
      </Unauthorized>
    </>
  );
}
