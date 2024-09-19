import ListadoFlujos from '@/components/class/flujos/ListadoFlujos';
import React from 'react';
import { getServerSession } from 'next-auth';
import { menu } from '@/services/data';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Unauthorized from '@/components/auth/Unauthorized';

import { obtenerFlujos } from '@/services/Prisma/Flujo';

export default async function pageFlujos() {
  const session = await getServerSession(options);
  const totalFlujos = await obtenerFlujos();
  return (
    <>
      <Unauthorized user={session.user} permisos={menu[7].permisos}>
        <ListadoFlujos flujos={totalFlujos} session={session} />
      </Unauthorized>
    </>
  );
}
