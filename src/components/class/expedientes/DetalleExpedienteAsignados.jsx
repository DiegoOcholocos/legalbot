'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { editarTareaActividad } from '@/services/Prisma/ExpedienteTarea';
import PresentacionTareas from '../tareas/PresentacionTareas';
import Title from '@/components/utils/system/Title';

export default function DetalleExpedienteAsignados({ expediente, tareas }) {
  const [tareasExpediente, setTareasExpediente] = useState(tareas);
  const handleTareasUpdate = (nuevasTareas) => {
    setTareasExpediente(nuevasTareas);
  };
  
  return (
    <>
      <Title title={'Tareas asignadas al expediente'} size='2xl'></Title>
      <PresentacionTareas tareas={tareas} onUpdate={handleTareasUpdate} />
    </>
  );
}
