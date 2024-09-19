import CarteraComponent from '@/components/pages/CarteraComponent';
import { getServerSession } from 'next-auth';
import { menu } from '@/services/data';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';
import { obtenerExpedienteHisto } from '@/services/Prisma/HistorialDocumentos';
import { obtenerCountExpedienteNum } from '@/services/Prisma/Expediente';

export default async function pageCartera() {
  const session = await getServerSession(options);
  const historialDocumentos = await obtenerExpedienteHisto();
  const countExpedienteNum = await obtenerCountExpedienteNum();
  return (
    <>
      <Unauthorized user={session.user} permisos={menu[3].permisos}>
        <CarteraComponent
          historialDocumentos={historialDocumentos}
          countExpedienteNum={countExpedienteNum}
        />
      </Unauthorized>
    </>
  );
}
