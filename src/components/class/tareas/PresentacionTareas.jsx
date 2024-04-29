'use client';
import { estadosTareaExpediente } from '@/services/data';
import { Button, Card, Tooltip } from '@nextui-org/react';

export default function PresentacionTareas({ tareas }) {
  console.log(tareas);

  return (
    <div className='p-4 flex flex-col gap-4'>
      {tareas.map((tarea) => (
        <Card key={tarea.NUMEXPEDTAREAID} className='rounded-lg'>
          <div className={`p-6 justify-between flex w-full items-center relative`}>
            <div className='flex flex-col gap-2'>
              <span className='text-lg font-semibold'>{tarea.TE_TAREA.VCHNOMBRE}</span>
              <span className='text-sm font-light'>{tarea.TE_TAREA.VCHDESCRIPCION}</span>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='bg-success-300 p-2 rounded-lg uppercase font-bold text-sm text-center'>
                {tarea.VCHESTADO}
              </span>
              <Button>Completar</Button>
            </div>
            {tarea.VCHESTADO == estadosTareaExpediente.INACTIVO && (
              <div className='absolute w-full h-full inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm gap-2'>
                <span className='text-white font-bold'>Tarea Inactiva</span>
                <Tooltip
                  content={
                    <div className='px-1 py-2'>
                      <div className='text-md font-bold'>Listado de Dependencias</div>
                      <div className='text-sm'>Enviar Expediente</div>
                      <div className='text-sm'>Enviar Expediente</div>
                    </div>
                  }
                >
                  <Button variant='bordered'>Dependencias</Button>
                </Tooltip>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
