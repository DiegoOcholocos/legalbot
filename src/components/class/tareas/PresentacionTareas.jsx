"use client";
import { cambiarEstado } from "@/services/Prisma/TareasExpediente";
import { estadosTareaExpediente } from "@/services/data";
import { Button, Card, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import ModalArchivos from "@/components/utils/modals/ModalArchivos";
import ModalCambiarEstado from "@/components/utils/modals/ModalCambiarEstado";
import { formateoFecha } from "@/services/format";
import { obtenerUsuariosporid } from "@/services/Prisma/Usuario";
export default function PresentacionTareas({ tareas, onUpdate }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [totaltareas, setTotalTareas] = useState(tareas);

  console.log("estas son las tareas del expediente", totaltareas);
  function getEstadoClassName(estado) {
    switch (estado) {
      case estadosTareaExpediente.PENDIENTE:
        return "bg-yellow-300 text-black";
      case estadosTareaExpediente.TERMINADO:
        return "bg-green-600 text-white";
    }
  }
  useEffect(() => {
    setTotalTareas(tareas);
  }, [tareas]);

  const handleEstadoChange = (id, nuevoEstado) => {
    console.log("tareas totales ", totaltareas);
    const nuevasTareas = totaltareas.map((tarea) =>
      tarea.NUMEXPEDTAREAID === id ? { ...tarea, VCHESTADO: nuevoEstado } : tarea
    );
    setTotalTareas(nuevasTareas);
    onUpdate(nuevasTareas);
  };

  return (
    <div className='p-4 flex flex-col gap-4'>
      {totaltareas.map((tarea) => (
        <Card key={tarea.NUMEXPEDTAREAID} className='rounded-lg'>
          <div className={`p-6 justify-between flex w-full items-center relative`}>
            <div className='flex flex-col gap-2'>
              <span className='text-lg font-semibold'>{tarea.TE_TAREA.VCHNOMBRE}</span>
              <span className='text-sm font-light'>{tarea.TE_TAREA.VCHDESCRIPCION}</span>
              <span className='text-sm font-light'>
                Fecha de inicio: {formateoFecha(tarea.FECHAINICIO)}
              </span>
              <span className='text-sm font-light'>
                Fecha de culminacion estimada: {formateoFecha(tarea.FECFECHACULMINACION)}
              </span>
              <ModalArchivos Tarea={tarea.TE_TAREA} />
            </div>
            <div className='flex flex-col gap-2'>
              <span
                className={`p-2 rounded-lg uppercase font-bold text-sm text-center ${getEstadoClassName(
                  tarea.VCHESTADO
                )}`}
              >
                {tarea.VCHESTADO}
              </span>
              <ModalCambiarEstado Tarea={tarea} onEstadoChange={handleEstadoChange} />
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
