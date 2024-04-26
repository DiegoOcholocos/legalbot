'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function obtenerExpedienteTarea(id) {
  try {
    const data = await db.TE_EXPEDIENTE_TAREA.findMany({
      where: {
        expedienteid: id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function obtenerTareasporActividad(idactividad) {
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

export async function obtenerTareaExpediente(IdExpediente) {
  try {
    const data = await db.TE_EXPEDIENTE_TAREA.findMany({
      where: {
        expedienteid: IdExpediente,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function cambiarEstadoTarea(id, estado) {
  try {
    const data = await db.TE_EXPEDIENTE_TAREA.update({
      where: {
        expedienteid: id,
      },
      data: {
        VCHESTADO: estado,
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
        NUMTAREAID: data.NUMTAREAID,
        FECFECHACULMINACION: data.FECFECHACULMINACION,
        FECHAINICIO: data.FECHAINICIO,
        expedienteid: data.expedienteid,
        VCHESTADO: data.VCHESTADO,
        FECHFECHACREACION: data.FECHFECHACREACION,
      },
    });
    return nuevoExpedienteTarea;
  } catch (error) {
    console.error('Error creating expediente tarea:', error);
    throw error;
  }
}
