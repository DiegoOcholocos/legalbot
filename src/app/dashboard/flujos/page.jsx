import ListadoFlujos from '@/components/class/flujos/ListadoFlujos';
import React from 'react';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { obtenerFlujos } from '@/services/Prisma/Flujo';

export default async function pageFlujos() {
  const session = await getServerSession(options);
  const totalFlujos = await obtenerFlujos();
  return <ListadoFlujos flujos={totalFlujos} session={session} />;
}
