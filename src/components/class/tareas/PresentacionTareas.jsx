'use client';
import { cambiarEstado } from '@/services/Prisma/TareasExpediente';
import { estadosTareaExpediente } from '@/services/data';
import { Button, Card, Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react';
import ModalArchivos from '@/components/utils/modals/ModalArchivos';
import ModalCambiarEstado from '@/components/utils/modals/ModalCambiarEstado';
import { formateoFecha } from '@/services/format';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';
import { Chip } from '@nextui-org/react';
export default function PresentacionTareas({ tareas, onUpdate }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [usuarios, setUsuarios] = useState([]);
  const [totaltareas, setTotalTareas] = useState(tareas);
  function getEstadoClassName(estado) {
    switch (estado) {
      case estadosTareaExpediente.PENDIENTE:
        return 'bg-yellow-300 text-black';
      case estadosTareaExpediente.TERMINADO:
        return 'bg-green-600 text-white';
    }
  }
  useEffect(() => {
    async function usuarios() {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    }
    usuarios();
    setTotalTareas(tareas);
  }, [tareas]);

  function calcularDiferenciaFechas(fechaInicio, fechaFin) {
    console.log(fechaInicio)
    console.log(fechaFin)
    if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
      throw new Error('Ambos argumentos deben ser instancias de Date.');
    }
    const diferencia = fechaFin.getTime() - fechaInicio.getTime();
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    const segundosDisplay = segundos % 60;
    const minutosDisplay = minutos % 60;
    const horasDisplay = horas % 24;

    return {
      dias: dias,
      horas: horasDisplay,
      minutos: minutosDisplay,
      segundos: segundosDisplay,
    };
  }

  function getChipColor(restante, tiempoReal) {
    let tiempoRestanteSegundos =
      restante.dias * 24 * 60 * 60 +
      restante.horas * 60 * 60 +
      restante.minutos * 60 +
      restante.segundos;
    let tiempoRealSegundos = tiempoReal * 24 * 60 * 60;
    let porcentaje = (tiempoRestanteSegundos / tiempoRealSegundos) * 100;
    if (porcentaje < 15) {
      return 'danger';
    } else if (porcentaje < 50) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  function obtenerCorreosPorIds(listaIds) {
    const ids = listaIds.split(',').map((id) => parseInt(id.trim()));
    return usuarios
      .filter((user) => ids.includes(user.NUMUSUARIOID))
      .map((user) => user.VCHCORREO.split('@')[0]);
  }

  const handleEstadoChange = (id, nuevoEstado) => {
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
                Usuarios Asignados:{' '}
                {obtenerCorreosPorIds(tarea.TE_TAREA.VCHLISTAUSUARIOS).join(', ') || 'Ninguno'}
              </span>
              <span className='text-sm font-light'>
                Fecha de inicio: {formateoFecha(tarea.FECHAINICIO)}
              </span>
              <span className='text-sm font-light'>
                Fecha de culminacion estimada: {formateoFecha(tarea.FECFECHACULMINACION)}
              </span>
              <span className='text-sm font-light'>
                Tiempo restante para la expiración:{' '}
                <Chip
                  variant='faded'
                  color={getChipColor(
                    calcularDiferenciaFechas(new Date(), tarea.FECFECHACULMINACION),
                    calcularDiferenciaFechas(tarea.FECHAINICIO, tarea.FECFECHACULMINACION).dias
                  )}
                >
                  {calcularDiferenciaFechas(new Date(), tarea.FECFECHACULMINACION).dias} D{' '}
                  {calcularDiferenciaFechas(new Date(), tarea.FECFECHACULMINACION).horas} H{' '}
                  {calcularDiferenciaFechas(new Date(), tarea.FECFECHACULMINACION).minutos} M{' '}
                  {calcularDiferenciaFechas(new Date(), tarea.FECFECHACULMINACION).segundos} S{' '}
                </Chip>
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
