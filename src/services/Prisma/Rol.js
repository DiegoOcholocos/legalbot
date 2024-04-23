'use server';
import { PrismaClient, SortOrder } from '@prisma/client';
import db from '@/libs/prisma';

export async function obtenerRoles() {
  const roles = await db.TE_ROL.findMany();
  return roles;
}

export async function crearRol(credentials) {
  try {
    const hoy = new Date();
    const formattedDateTime = hoy.toISOString();
    const nuevoRegistro = await db.TE_ROL.create({
      data: {
        VCHNOMBRE: credentials.VCHNOMBRE,
        FECFECHACREACION: formattedDateTime,
        FECFECHACTUALIZACION: formattedDateTime,
      },
    });
    return nuevoRegistro;
  } catch (error) {
    console.error('Error creating UsuarioEstudio record:', error);
    return null;
  }
}

export async function editarRol(credentials) {
  try {
    const hoy = new Date();
    const formattedDateTime = hoy.toISOString();
    const actualizarRol = await db.TE_ROL.update({
      where: {
        NUMROLID: credentials.NUMROLID,
      },
      data: {
        VCHNOMBRE: credentials.VCHNOMBRE,
        FECFECHACTUALIZACION: formattedDateTime,
      },
    });
    return actualizarRol;
  } catch (error) {
    console.error('Error al editar la actividad :', error);
    return null;
  }
}

export async function eliminarRol(id) {
  try {
    const response = await db.TE_ROL.delete({
      where: {
        NUMROLID: id,
      },
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar el rol :', error);
    return null;
  }
}
