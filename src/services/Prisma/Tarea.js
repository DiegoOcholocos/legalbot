'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function crearTarea(values, idActi, idFluj, folderName) {
  try {
    const fechaActualLima = new Date();

    const nuevaCarga = await prisma.TE_TAREA.create({
      data: {
        NUMACTIVIDADID: parseInt(idActi),
        NUMFLUJOID: parseInt(idFluj),
        VCHNOMBRE: values.VCHNOMBRE,
        NUMNUMORDEN: null,
        VCHDESCRIPCION: values.VCHDESCRIPCION,
        NUMDIASDURACION: parseInt(values.NUMDIASDURACION), // Changed to VCHDIASDURACION
        NUMDIASALERTA: parseInt(values.NUMDIASALERTA),
        VCHLISTAUSUARIOS: [...values.USUARIOS].join(), // Convert Set to Array
        FECFECHACREACION: fechaActualLima,
        VCHUSUARIOCREACION: null,
        FECFECHACTUALIZACION: fechaActualLima,
        VCHUSUARIOACTUALIZ: null,
        VCHROLES: [...values.ROLES].join(), // Convert Set to Array
        VCHARCHIVOS: folderName,
      },
    });
    console.log('Nueva carga insertada:', nuevaCarga);
    return nuevaCarga;
  } catch (error) {
    console.error('Error al crear registro de tarea:', error);
  }
}

export async function editarTarea(values, idtarea) {
  try {
    const fechaActualLima = new Date();

    const nuevaCarga = await prisma.TE_TAREA.update({
      where: {
        NUMTAREAID: idtarea,
      },
      data: {
        VCHNOMBRE: values.VCHNOMBRE,
        NUMNUMORDEN: null,
        VCHDESCRIPCION: values.VCHDESCRIPCION,
        NUMDIASDURACION: parseInt(values.NUMDIASDURACION), // Changed to VCHDIASDURACION
        NUMDIASALERTA: parseInt(values.NUMDIASALERTA),
        VCHLISTAUSUARIOS: [...values.USUARIOS].join(), // Convert Set to Array
        FECFECHACREACION: fechaActualLima,
        VCHUSUARIOCREACION: null,
        FECFECHACTUALIZACION: fechaActualLima,
        VCHUSUARIOACTUALIZ: null,
        VCHROLES: [...values.ROLES].join(), // Convert Set to Array
      },
    });
    console.log('Nueva carga insertada:', nuevaCarga);
  } catch (error) {
    console.error('Error al crear registro de carga:', error);
  }
}

export async function obtenerTareasActividad(actividadid) {
  const flujoIdAsNumber = parseInt(actividadid);
  const tareas = await db.TE_TAREA.findMany({
    where: { NUMACTIVIDADID: flujoIdAsNumber },
  });
  return tareas;
}

export async function eliminarTarea(idtarea) {
  const Tareaeliminada = await db.TE_TAREA.delete({
    where: {
      NUMTAREAID: idtarea,
    },
  });
  return Tareaeliminada;
}

export async function obtenerTarea(idtarea) {
  try {
    const tareaEditada = await prisma.TE_TAREA.findFirst({
      where: {
        NUMTAREAID: idtarea,
      },
    });
    return tareaEditada;
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    throw error;
  }
}
