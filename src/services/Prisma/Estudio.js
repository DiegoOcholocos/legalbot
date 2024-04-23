'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function crearRegistroEstudios(nombre) {
  try {
    const estudioExistente = await prisma.TE_ESTUDIO.findFirst({
      where: {
        VCHNOMBRE: nombre,
      },
    });
    if (estudioExistente) {
      return estudioExistente;
    }
    const nuevoEstudio = await prisma.TE_ESTUDIO.create({
      data: {
        VCHNOMBRE: nombre,
      },
    });
    return nuevoEstudio;
  } catch (error) {
    console.error('Error creating estudio:', error);
  }
}
export async function crearRegistroUsuarioEstudio(usuarioId, estudioId) {
  try {
    const nuevoRegistro = await prisma.TE_ESTUDIO_USUARIO.create({
      data: {
        NUMESTUDIOID_id: estudioId,
        NUMUSUARIOID_id: usuarioId,
      },
    });
    return nuevoRegistro;
  } catch (error) {
    console.error('Error creating UsuarioEstudio record:', error);
    return null;
  }
}
export async function obtenerEstudios() {
  const estudios = await db.TE_ESTUDIO.findMany();
  return estudios;
}

export async function editarEstudio(idEstudio, nuevoNombre) {
  try {
    const estudioActualizado = await db.TE_ESTUDIO.update({
      where: {
        NUMESTUDIOID: idEstudio,
      },
      data: {
        VCHNOMBRE: nuevoNombre,
      },
    });
    return estudioActualizado;
  } catch (error) {
    console.error('Error al editar el estudio:', error);
  }
}
