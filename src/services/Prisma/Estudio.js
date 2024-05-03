'use server';
import db from '@/libs/prisma';

export async function crearRegistroEstudios(nombre) {
  try {
    const estudioExistente = await db.TE_ESTUDIO.findFirst({
      where: {
        VCHNOMBRE: nombre,
      },
    });
    if (estudioExistente) {
      return estudioExistente;
    }
    const nuevoEstudio = await db.TE_ESTUDIO.create({
      data: {
        VCHNOMBRE: nombre,
      },
    });
    return nuevoEstudio;
  } catch (error) {
    console.error('Error creating estudio:', error);
  }
}
export async function crearRegistroMasivo(estudiosArchivo) {
  try {
    const estudiosExistentes = await db.TE_ESTUDIO.groupBy({
      by: ['NUMESTUDIOID', 'VCHNOMBRE'],
      select: {
        NUMESTUDIOID: true,
        VCHNOMBRE: true,
      },
    });
    const estudiosExistentesArray = estudiosExistentes.map((estudio) => {
      return `${estudio.NUMESTUDIOID}/-/${estudio.VCHNOMBRE}`;
    });
    const estudiosNuevos = estudiosArchivo.filter(
      (estudio) =>
        !estudiosExistentesArray.includes(`${estudio.NUMESTUDIOID}/-/${estudio.VCHNOMBRE}`)
    );
    const estudiosCreate = estudiosNuevos.map((estudio) => {
      return {
        NUMESTUDIOID: parseInt(estudio.NUMESTUDIOID),
        VCHNOMBRE: estudio.VCHNOMBRE,
      };
    });
    console.log('Estudios a crear:', estudiosCreate);
    const nuevoEstudio = await db.TE_ESTUDIO.createMany({
      data: estudiosCreate,
    });
    return nuevoEstudio;
  } catch (error) {
    console.error('Error creating estudio:', error);
  }
}
export async function crearRegistroUsuarioEstudio(usuarioId, estudioId) {
  try {
    const nuevoRegistro = await db.TE_ESTUDIO_USUARIO.create({
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

export async function eliminarEstudio(idEstudio) {
  try {
    const response = await db.TE_ESTUDIO.delete({
      where: {
        NUMESTUDIOID: idEstudio,
      },
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar el estudio :', error);
    return null;
  }
}

export async function obtenerEstudioNoAsignado() {
  try {
    const estudios = await db.TE_ESTUDIO.findFirst({
      where: {
        VCHNOMBRE: 'Estudio no asignado',
      },
    });
    return estudios;
  } catch {
    console.error('Error al obtener el estudio no asignado');
  }
}
