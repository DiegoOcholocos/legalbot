'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function obtenerExpedienteTarea(id) {
  try {
    const data = await db.te_expediente_tarea.findMany({
      where: {
        expedienteid: id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function ObtenerTareasporActividad(idactividad) {
  try {
    const data = await db.TE_TAREA.findMany({
      where: {
        NUMACTIVIDADID: idactividad,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function ObtenerTareaExpediente(IdExpediente) {
  try {
    const data = await db.te_expediente_tarea.findMany({
      where: {
        expedienteid: IdExpediente,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function cambiarEstadoTarea(id,estado) {
  try {
    const data = await db.te_expediente_tarea.update({
      where: {
        expedienteid: id,
      },
      data: {
        vchestado: estado,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}




export async function crearExpedienteTarea(data) {
  try {
    const nuevoExpedienteTarea = await db.te_expediente_tarea.create({
      data: {
        numtareaid: data.numtareaid,
        fecfechaculminacion: data.NUMFLfecfechaculminacionUJOID,
        fecfechainicio: data.fecfechainicio,
        expedienteid: data.expedienteid,
        vchestado: data.vchestado,
      },
    });
    return nuevoExpedienteTarea;
  } catch (error) {
    console.error('Error creating expediente tarea:', error);
    throw error;
  }
}
