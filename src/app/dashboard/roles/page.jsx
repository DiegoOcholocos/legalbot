import ListaRoles from '@/components/class/roles/ListaRoles';
import { obtenerRoles } from '@/services/Prisma/Rol';
import { getServerSession } from 'next-auth';
import { menu } from "@/services/data";
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';
export default async function page() {
  const session = await getServerSession(options);
  const roles = await obtenerRoles();
  return <Unauthorized user={session.user} permisos={menu[6].permisos} children={<ListaRoles roles={roles}/>}/>;
}
