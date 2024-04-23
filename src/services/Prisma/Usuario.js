'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';
const prisma = new PrismaClient();

export async function crearUsuario(correo, tusuario, rol) {
  try {
    const nuevoUsuario = await prisma.TE_USUARIO.create({
      data: {
        VCHCORREO: correo,
        VCHESTADO: '1',
        VCHTIPUSUARIO: tusuario,
        VCHROLID: rol,
      },
    });
    return nuevoUsuario.NUMUSUARIOID; // Devolver el ID del nuevo usuario
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function EditarEstadoCuentaCognito2(correo) {
  // Buscar el usuario por correo para obtener su NUMUSUARIOID
  const usuario = await db.TE_USUARIO.findFirst({
    where: { VCHCORREO: correo },
  });

  // Verificar si se encontró el usuario
  if (!usuario) {
    throw new Error(`Usuario con correo ${correo} no encontrado.`);
  }

  const registroActualizado = await db.TE_USUARIO.update({
    where: { NUMUSUARIOID: usuario.NUMUSUARIOID },
    data: { VCHESTADO: '2' },
  });

  return registroActualizado;
}

export async function EditarEstadoCuentaCognito1(correo) {
  // Buscar el usuario por correo para obtener su NUMUSUARIOID
  const usuario = await db.TE_USUARIO.findFirst({
    where: { VCHCORREO: correo },
  });
  if (!usuario) {
    throw new Error(`Usuario con correo ${correo} no encontrado.`);
  }
  const registroActualizado = await db.TE_USUARIO.update({
    where: { NUMUSUARIOID: usuario.NUMUSUARIOID },
    data: { VCHESTADO: '1' },
  });

  return registroActualizado;
}

export async function editarUsuario(usuarioId, tipoUsuario, rol) {
  try {
    const usuarioActualizado = await db.TE_USUARIO.update({
      where: {
        NUMUSUARIOID: usuarioId,
      },
      data: {
        VCHTIPUSUARIO: tipoUsuario,
        VCHROLID: rol,
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
  const deleteActividad = await db.TE_USUARIO.findMany();
  return deleteActividad;
}