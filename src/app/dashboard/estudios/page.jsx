import ListadoEstudios from '@/components/class/estudios/ListadoEstudios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
const pageEstudios = async () => {
  const session = await getServerSession(options);
  const dataUser = session.user.tipoUsuario;
  const listaEstudios = await obtenerEstudios();
  return <ListadoEstudios dataUser={dataUser} listaEstudios={listaEstudios} />;
};

export default pageEstudios;
