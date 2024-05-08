import ListadoEstudios from '@/components/class/estudios/ListadoEstudios';
import { getServerSession } from 'next-auth';
import { menu } from '@/services/data';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
const pageEstudios = async () => {
  const session = await getServerSession(options);
  const dataUser = session.user.tipoUsuario;
  const listaEstudios = await obtenerEstudios();
  return (
    <>
      <Unauthorized user={session.user} permisos={menu[5].permisos}>
        <ListadoEstudios dataUser={dataUser} listaEstudios={listaEstudios} />
      </Unauthorized>
    </>
  );
};

export default pageEstudios;
