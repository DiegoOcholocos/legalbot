import React from 'react';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { obtenerFlujo } from '@/services/Prisma/Flujo';
import { obtenerActividadesPorFlujo } from '@/services/Prisma/Actividad';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';
import { obtenerRoles } from '@/services/Prisma/Rol';
import DetalleFlujo from '@/components/class/flujos/DetalleFlujo';

export default async function pageFlujos({ params: { id } }) {
  const session = await getServerSession(options);
  const flujo = await obtenerFlujo(id);
  const totalActividades = await obtenerActividadesPorFlujo(flujo.NUMFLUJOID);
  const totalUsuarios = await obtenerUsuarios();
  const totalRol = await obtenerRoles();
  return (
    <DetalleFlujo
      flujo={flujo}
      actividades={totalActividades}
      usuarios={totalUsuarios}
      roles={totalRol}
    />
  );
}
