import ListadoExpedientes from '@/components/class/expedientes/ListadoExpedientes';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { validarEstudio } from '@/services/Session/validacionEstudio';

export default async function pageExpedientes() {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });

  return <ListadoExpedientes estudio={estudio} />;
}
