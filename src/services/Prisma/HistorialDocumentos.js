'use server';
import { SortOrder } from '@prisma/client';
import db from '@/libs/prisma';

export async function obtenerExpedienteHisto() {
  const expedientes = await db.TE_HISTORIALDOCS.findMany({
    take: 5, // Obtener los últimos 5 registros
    orderBy: {
      NUMHISTORIALDOCSID: SortOrder.desc, // Ordenar por id en orden descendente
    },
  });
  return expedientes;
}

export async function crearRegistroHistorial(
  nomdoc,
  cantexp,
  estado,
  fechacarga
) {
  try {
    const nuevoRegistro = await db.TE_HISTORIALDOCS.create({
      data: {
        VCHNOMDOC: nomdoc,
        VCHCANTEXP: cantexp,
        VCHESTADO: estado,
        VCHFECHACARDA: fechacarga,
      },
    });
    return nuevoRegistro.NUMHISTORIALDOCSID; // Devolver el ID del nuevo registro
  } catch (error) {
    console.error('Error creating record:', error);
    return null;
  }
}

export async function actualizarRegistro(id) {
  const registroActualizado = await db.TE_HISTORIALDOCS.update({
    where: { NUMHISTORIALDOCSID: id },
    data: { VCHESTADO: 'Cargado' }, // Cambiar el estado a 'Cargado'
  });
  return registroActualizado;
}
