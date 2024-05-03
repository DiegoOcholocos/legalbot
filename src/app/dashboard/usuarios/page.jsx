import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ListaUsuarios from '@/components/class/usuarios/ListaUsuarios';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
import { obtenerRoles } from '@/services/Prisma/Rol';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';
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

  if (session.user.tipoUsuario !== 'Administrador') {
    return <p>No tienes permisos para ver esta página Principal.</p>;
  }

  return <ListaUsuarios usuariosData={listaDeUsuarios} rolesData={roles} estudiosData={estudios} />;
};

export default pageUsuarios;
