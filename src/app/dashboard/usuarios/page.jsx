import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ListaUsuarios from '@/components/class/usuarios/ListaUsuarios';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
import { obtenerEstudiosExpedientes } from '@/services/Prisma/Expediente';
import { obtenerRoles } from '@/services/Prisma/Rol';

const pageUsuarios = async () => {
  const session = await getServerSession(options);
  const dataUser = session.user.tipoUsuario;
  
  const listaDeUsuarios = await listarUsuarios();
  const roles = [];
  const estudios = [];
  
  try {
    const rolesData = await obtenerRoles();
    roles.push(...rolesData);
    
    const estudiosData = await obtenerEstudiosExpedientes();
    estudios.push(...estudiosData);

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
