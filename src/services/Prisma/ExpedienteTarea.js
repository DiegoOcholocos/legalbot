'use server';
import db from '@/libs/prisma';

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

export async function obtenerDatos(data2) {
  const data = await db.TE_EXPEDIENTE_TAREA.findMany({
    where: {
      expedienteid: data2,
    },
    include: {
      TE_TAREA: { include: { TE_ACTIVIDAD: true } },
    },
    orderBy: {
      NUMEXPEDTAREAID: 'asc',
    },
  });
  return data;
}
export async function editarTareaActividad(idtarea) {
  try {
    // Obtener la tarea actual
    const tarea = await db.TE_EXPEDIENTE_TAREA.findUnique({
      where: {
        NUMEXPEDTAREAID: idtarea,
      },
    });

    if (!tarea) {
      throw new Error('La tarea no existe');
    }

    // Cambiar el valor booleano
    const nuevoValor = !tarea.BOOLTERMINADO;

    // Actualizar la tarea con el nuevo valor
    const ActividadAct = await db.TE_EXPEDIENTE_TAREA.update({
      where: {
        NUMEXPEDTAREAID: idtarea,
      },
      data: {
        BOOLTERMINADO: nuevoValor,
      },
    });

    return ActividadAct;
  } catch (error) {
    console.error('Error al editar la actividad :', error);
    throw error;
  }
}
