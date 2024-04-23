import ListaRoles from '@/components/class/roles/ListaRoles';
import { obtenerRoles } from '@/services/Prisma/Rol';

export default async function page() {
  const roles = await obtenerRoles();
  return <ListaRoles roles={roles} />;
}
