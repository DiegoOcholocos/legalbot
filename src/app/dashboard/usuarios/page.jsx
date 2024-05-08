import { getServerSession } from 'next-auth';
import { menu } from '@/services/data';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ListaUsuarios from '@/components/class/usuarios/ListaUsuarios';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
import { obtenerRoles } from '@/services/Prisma/Rol';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';
import Unauthorized from '@/components/auth/Unauthorized';

const pageUsuarios = async () => {
  const session = await getServerSession(options);
  const dataUser = session.user.tipoUsuario;
  const listaDeUsuarios = await obtenerUsuarios();
  console.log('listaDeUsuarios', listaDeUsuarios);
  const roles = [];
  const estudios = [];
  try {
    const rolesData = await obtenerRoles();
    roles.push(...rolesData);

    const estudiosList = await obtenerEstudios();
    const estudiosFormateados = estudiosList.map((e) => {
      return { Estudio: e.VCHNOMBRE, CodEstudio: e.NUMESTUDIOID };
    });
    estudios.push(...estudiosFormateados);
  } catch (error) {
    console.error('Error fetching:', error);
  }
  return (
    <>
      <Unauthorized user={session.user} permisos={menu[4].permisos}>
        <ListaUsuarios usuariosData={listaDeUsuarios} rolesData={roles} estudiosData={estudios} />
      </Unauthorized>
    </>
  );
};

export default pageUsuarios;
