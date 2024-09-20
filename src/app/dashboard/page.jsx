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
  return <TopCards />;
}
