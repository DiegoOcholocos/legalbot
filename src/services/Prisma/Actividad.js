'use server';
import db from '@/libs/prisma';

export async function crearActividad(idflujo, nuevoNombre) {
  try {
    const NuevaActividad = await db.TE_ACTIVIDAD.create({
      data: {
        VCHNOMBRE: nuevoNombre,
        NUMFLUJOID: idflujo,
      },
    });
    return NuevaActividad;
  } catch (error) {
    console.error('Error al editar el flujo:', error);
    throw error;
  }
}
export async function eliminarActividad(idactividad) {
  const Actividaddelete = await db.TE_ACTIVIDAD.delete({
    where: {
      NUMACTIVIDADID: idactividad,
    },
  });
  return Actividaddelete;
}
export async function obtenerActividades() {
  const Actividades = await db.TE_ACTIVIDAD.findMany();
  return Actividades;
}
export async function obtenerActividadesPorFlujo(idflujo) {
  const Actividades = await db.TE_ACTIVIDAD.findMany({
    where: { NUMFLUJOID: idflujo },
  });
  return Actividades;
}
export async function obtenerActividad(idflujo) {
  console.log('idflujo', idflujo);
  const Actividad = await db.TE_ACTIVIDAD.findFirst({
    where: { NUMACTIVIDADID: idflujo },
  });
  return Actividad;
}
export async function editarActividad(idactividad, nuevoNombre) {
  const flujoIdAsNumber = parseInt(idactividad, 10);

  try {
    const ActividadAct = await db.TE_ACTIVIDAD.update({
      where: {
        NUMACTIVIDADID: flujoIdAsNumber, //
      },
      data: {
        VCHNOMBRE: nuevoNombre, //
      },
    });

    return ActividadAct;
  } catch (error) {
    console.error('Error al editar la actividad :', error);
    throw error; //
  }
}
