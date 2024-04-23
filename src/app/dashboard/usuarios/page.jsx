import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ListaUsuarios from '@/components/class/usuarios/ListaUsuarios';

const pageUsuarios = async () => {
  const session = await getServerSession(options);
  const dataUser = session.user.tipoUsuario;

  const listaDeUsuarios = await listarUsuarios();

  if (session.user.tipoUsuario !== 'Administrador') {
    return <p>No tienes permisos para ver esta página Principal.</p>;
  }

  return <ListaUsuarios usuarios={listaDeUsuarios} />;
};

export default pageUsuarios;
