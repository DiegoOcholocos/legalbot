import React from 'react';

import { getExpedienteJson } from '@/services/Aws/S3/actions';
import DetalleExpediente from '@/components/class/expedientes/DetalleExpediente';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { obtenerFlujos } from '@/services/Prisma/Flujo';
import { validarEstudio } from '@/services/Session/validacionEstudio';
import { obtenerDatos } from '@/services/Prisma/ExpedienteTarea';

export default async function pageExpediente({ params: { id } }) {
  const session = await getServerSession(options);
  const estudio = await validarEstudio({ session });
  const expediente = await getExpedienteJson(id, estudio);
  if (expediente === null) {
    return <h1>Porfavor Recarge la pagina para volverlo intentar</h1>;
  }
  if (expediente?.Estudio !== estudio && session.user.tipoUsuario !== 'Administrador') {
    return <h1>Expediente no encontrado</h1>;
  }
  const data = await obtenerDatos(expediente.ExpedienteId);
  const totalFlujos = await obtenerFlujos();
  return (
    <DetalleExpediente
      expediente={expediente}
      totalFlujos={totalFlujos}
      userEmail={session.email}
      tareas={data}
    />
  );
}
