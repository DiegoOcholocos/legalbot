'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function editarFlujo(idflujo, nuevoNombre) {
  try {
    const estudioActualizado = await db.TE_FLUJO.update({
      where: { NUMFLUJOID: idflujo }, // Condición para identificar el flujo que se va a actualizar
      data: { VCHNOMBRE: nuevoNombre }, // Datos actualizados
    });
    return estudioActualizado;
  } catch (error) {
    console.error('Error al editar el flujo:', error);
  }
}

export async function obtenerFlujo(usuarioId) {
  const flujoIdAsNumber = parseInt(usuarioId, 10);
  const flujo = await db.TE_FLUJO.findFirst({
    where: { NUMFLUJOID: flujoIdAsNumber },
  });
  return flujo;
}

export async function obtenerFlujos() {
  const flujo = await db.TE_FLUJO.findMany();
  return flujo;
}

export async function crearFlujo(flujonuevo, usuariomail) {
  try {
    const fechaActual = new Date();
    const nuevoRegistro = await prisma.TE_FLUJO.create({
      data: {
        VCHNOMBRE: flujonuevo,
        VCHUSUARIOCREACION: usuariomail.email,
        FECFECHACREACION: fechaActual,
        //NUMCANTIDADDEEXPEDIENTES: null,
        FECFECHACTUALIZACION: fechaActual,
        VCHUSUARIOACTUALIZ: usuariomail.email,
      },
    });
    return nuevoRegistro;
  } catch (error) {
    console.error('Error creating UsuarioEstudio record:', error);
    return null;
  }
}

export async function eliminarFlujo(idflujo) {
  const deleteflujo = await db.TE_FLUJO.delete({
    where: { NUMFLUJOID: idflujo },
  });
  return deleteflujo;
}
