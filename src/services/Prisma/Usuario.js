'use server';
import db from '@/libs/prisma';

export async function crearUsuario(correo, tusuario, rol, estudioId) {
  try {
    const nuevoUsuario = await db.TE_USUARIO.create({
      data: {
        VCHCORREO: correo,
        VCHESTADO: '1',
        VCHTIPUSUARIO: tusuario,
        VCHROLID: rol,
        NUMESTUDIOID: estudioId > 0 ? estudioId : null,
      },
    });
    return nuevoUsuario.NUMUSUARIOID; // Devolver el ID del nuevo usuario
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function editarUsuario(usuarioId, tipoUsuario, rol, estudioId) {
  try {
    const usuarioActualizado = await db.TE_USUARIO.update({
      where: {
        NUMUSUARIOID: usuarioId,
      },
      data: {
        VCHTIPUSUARIO: tipoUsuario,
        VCHROLID: rol,
        NUMESTUDIOID: estudioId > 0 ? estudioId : null,
      },
    });
    console.log(`usuario con ID ${usuarioId} actualizado".`);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al editar el estudio:', error);
    throw error;
  }
}

export async function obtenerUsuario(correo) {
  // Buscar el usuario por correo para obtener su NUMUSUARIOID
  const usuario = await db.TE_USUARIO.findFirst({
    where: { VCHCORREO: correo },
  });

  // Verificar si se encontró el usuario
  if (!usuario) {
    throw new Error(`Usuario con correo ${correo} no encontrado.`);
  }

  return usuario;
}

export async function obtenerUsuarios() {
  const usuarios = await db.TE_USUARIO.findMany({
    include: {
      TE_ESTUDIO: true,
    },
  });
  return usuarios;
}

export async function cambiarEstado(correo, estado) {
  try {
    const usuario = await db.TE_USUARIO.findFirst({
      where: { VCHCORREO: correo },
    });
    const usuarioActualizado = await db.TE_USUARIO.update({
      where: {
        NUMUSUARIOID: usuario.NUMUSUARIOID,
      },
      data: {
        VCHESTADO: estado,
      },
    });
    console.log(`usuario con ID ${usuarioActualizado} actualizado".`);
    return usuarioActualizado;
  } catch (error) {
    console.error('Error al editar el estudio:', error);
    throw error;
  }
}
