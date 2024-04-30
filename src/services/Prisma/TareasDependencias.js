'use server';
import db from '@/libs/prisma';

async function createDependenciaTarea(data) {
  try {
    const nuevaDependencia = await db.TE_DEPENDENCIATAREA.create({
      data: {
        NUMTAREAID: data.NUMTAREAID,
        NUMTAREAIDDEPENDENCIA: data.NUMTAREAIDDEPENDENCIA
      }
    });
    return nuevaDependencia;
  } catch (error) {
    throw new Error(`Error al crear la dependencia de tarea: ${error}`);
  }
}


async function getDependenciaTareaById(id) {
  try {
    const dependencia = await db.TE_DEPENDENCIATAREA.findUnique({
      where: {
        NUMDEPENDENCIASTAREAID: id
      }
    });
    return dependencia;
  } catch (error) {
    throw new Error(`Error al obtener la dependencia de tarea: ${error}`);
  }
}


async function updateDependenciaTarea(id, newData) {
  try {
    const dependenciaActualizada = await db.TE_DEPENDENCIATAREA.update({
      where: {
        NUMDEPENDENCIASTAREAID: id
      },
      data: {
        NUMTAREAID: newData.NUMTAREAID,
        NUMTAREAIDDEPENDENCIA: newData.NUMTAREAIDDEPENDENCIA
      }
    });
    return dependenciaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la dependencia de tarea: ${error}`);
  }
}

async function deleteDependenciaTarea(id) {
  try {
    await db.TE_DEPENDENCIATAREA.delete({
      where: {
        NUMDEPENDENCIASTAREAID: id
      }
    });
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar la dependencia de tarea: ${error}`);
  }
}

async function createDependenciaExpedienteTarea(data) {
  try {
    const nuevaDependencia = await db.PRUEBAS.TE_DEPENDENCIASEXPEDIENTETAREA.create({
      data: {
        NUMEXPEDTAREAID: data.NUMEXPEDTAREAID,
        NUMDEPENDENCIASTAREAID: data.NUMDEPENDENCIASTAREAID,
        STRINGESTADO: data.STRINGESTADO
      }
    });
    return nuevaDependencia;
  } catch (error) {
    throw new Error(`Error al crear la dependencia de expediente tarea: ${error}`);
  }
}


async function getDependenciaExpedienteTareaById(id) {
  try {
    const dependencia = await db.PRUEBAS.TE_DEPENDENCIASEXPEDIENTETAREA.findUnique({
      where: {
        NUMDEPENDENCIASEXPEDIENTETAREAID: id
      }
    });
    return dependencia;
  } catch (error) {
    throw new Error(`Error al obtener la dependencia de expediente tarea: ${error}`);
  }
}


async function updateDependenciaExpedienteTarea(id, newData) {
  try {
    const dependenciaActualizada = await db.PRUEBAS.TE_DEPENDENCIASEXPEDIENTETAREA.update({
      where: {
        NUMDEPENDENCIASEXPEDIENTETAREAID: id
      },
      data: {
        NUMEXPEDTAREAID: newData.NUMEXPEDTAREAID,
        NUMDEPENDENCIASTAREAID: newData.NUMDEPENDENCIASTAREAID,
        STRINGESTADO: newData.STRINGESTADO
      }
    });
    return dependenciaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la dependencia de expediente tarea: ${error}`);
  }
}


async function deleteDependenciaExpedienteTarea(id) {
  try {
    await db.PRUEBAS.TE_DEPENDENCIASEXPEDIENTETAREA.delete({
      where: {
        NUMDEPENDENCIASEXPEDIENTETAREAID: id
      }
    });
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar la dependencia de expediente tarea: ${error}`);
  }
}