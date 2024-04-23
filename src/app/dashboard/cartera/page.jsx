import CarteraComponent from '@/components/pages/CarteraComponent';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { obtenerExpedienteHisto } from '@/services/Prisma/HistorialDocumentos';
import { obtenerCountExpedienteNum } from '@/services/Prisma/Expediente';

export default async function pageCartera() {
  const session = await getServerSession(options);
  const historialDocumentos = await obtenerExpedienteHisto();
  const countExpedienteNum = await obtenerCountExpedienteNum();
  return (
    <CarteraComponent
      historialDocumentos={historialDocumentos}
      countExpedienteNum={countExpedienteNum}
    />
  );
}
