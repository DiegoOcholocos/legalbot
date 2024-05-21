'use server';
import db from '@/libs/prisma';

export async function obtenerFechasFeriados() {
    try {
      const data = await db.tE_FERIADOS_PERU.findMany();
      return data;
    } catch (error) {
      throw new Error(`Error al obtener los feriados: ${error.message}`);
    }
  }
