'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function obtenerExpedienteTarea(expedienteId) {
  try {
    const data = await db.TE_EXPEDIENTE_TAREA.findMany({
      where: {
        EXPEDIENTEID: expedienteId,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export async function crearExpedienteTarea(data) {
  try {
    const nuevoExpedienteTarea = await db.TE_EXPEDIENTE_TAREA.create({
      data: {
        NUMEXPEDTAREAID: data.NUMEXPEDTAREAID,
        NUMFLUJOID: data.NUMFLUJOID,
        NUMACTIVIDADID: data.NUMACTIVIDADID,
        EXPEDIENTEID: data.EXPEDIENTEID,
        VCHNOMBRE: data.VCHNOMBRE,
        VCHDESCRIPCION: data.VCHDESCRIPCION,
        FECFECHAFIN: data.FECFECHAFIN,
        FECFECHAALERTA: data.FECFECHAALERTA,
        FECFECHAESTIMADA: data.FECFECHAESTIMADA,
        NUMDIASDURACION: data.NUMDIASDURACION,
        VCHRESPONSABLEFINALIZA: data.VCHRESPONSABLEFINALIZA,
        VCHESTADO: data.VCHESTADO,
        FECFECHACREACION: data.FECFECHACREACION,
        VCHUSUARIOCREACION: data.VCHUSUARIOCREACION,
        FECFECACTUALIZACION: data.FECFECACTUALIZACION,
        VCHUSUARIOACTUALIZ: data.VCHUSUARIOACTUALIZ,
        FECHORAFIN: data.FECHORAFIN,
      },
    });
    return nuevoExpedienteTarea;
  } catch (error) {
    console.error('Error creating expediente tarea:', error);
    throw error;
  }
}
