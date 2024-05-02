'use server';
import db from '@/libs/prisma';

export async function cambiarEstado(idtareaexpe, estado) {
  try {
    const cambiaestado = await db.TE_EXPEDIENTE_TAREA.update({
        where: {
            NUMEXPEDTAREAID: idtareaexpe,
          },
          data: {
            VCHESTADO: estado,
      },
    });
    return cambiaestado;
  } catch (error) {
    console.error('Error al crear registro de tarea:', error);
  }
}

// export async function Tareasporexpediente(idtareaexpe) {
//     try {
//       const cambiaestado = await db.TE_EXPEDIENTE_TAREA.update({
//           where: {
//               NUMEXPEDTAREAID: idtareaexpe,
//             },
//       });
//       return cambiaestado;
//     } catch (error) {
//       console.error('Error al crear registro de tarea:', error);
//     }
//   }