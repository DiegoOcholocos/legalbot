'use client';
import {
  Button,
  Card,
  useDisclosure,
  Breadcrumbs,
  BreadcrumbItem,
  Tabs,
  Tab,
} from '@nextui-org/react';
import ModalNotificaciones from '@/components/utils/modals/ModalNotificaciones';
import { useRouter } from 'next/navigation';

import { crearExpedienteTarea, obtenerExpedienteTarea } from '@/services/Prisma/ExpedienteTarea';
import { obtenerActividadesPorFlujo } from '@/services/Prisma/Actividad';
import { obtenerFlujo } from '@/services/Prisma/Flujo';
import { obtenerTareasActividad } from '@/services/Prisma/Tarea';
import { estadosTareaExpediente } from "@/services/data";
import { useEffect, useState } from 'react';
import Title from '@/components/utils/system/Title';
import DetalleExpedienteTarea from './DetalleExpedienteTarea';
import DetalleExpedienteAsignados from './DetalleExpedienteAsignados';
import { descargarArchivo } from '@/services/Aws/S3/actions';

export default function DetalleExpediente({
  expediente,
  totalFlujos,
  userEmail,
  TotalexpedienteTarea,
  tareas,
}) {
  const [mostrarFlujoData, setMostrarFlujoData] = useState(false);
  const [flujoId, setFlujoId] = useState('');
  const [actividades, setActividades] = useState([]);
  const router = useRouter();
  const [tareasExpediente, setTareasExpediente] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { expedientedatos, setexpediente } = useState(expediente);
  useEffect(() => {
    (async () => {
      const data = await obtenerExpedienteTarea(expediente.ExpedienteId);
      setTareasExpediente(data);
      console.log(data);
    })();
  }, []);

  const handleAsignWorflow = async () => {
    if (!flujoId) {
      onOpen(); // Modal advertencia
      return;
    }
    console.log('este es el flujo', flujoId);
    const flujoData = await obtenerFlujo(flujoId);
    console.log('f:', flujoData);

    const actividadesData = await obtenerActividadesPorFlujo(flujoData.NUMFLUJOID);

    console.log('ACTIVIDADES  POR FLUJO', actividadesData);
    for (const actividad of actividadesData) {
      const tareasData = await obtenerTareasActividad(actividad.NUMACTIVIDADID);
      actividad['TAREAS'] = tareasData;
    }
    setActividades([...actividadesData]);

    setMostrarFlujoData(true);

    console.log('Este es el flujo', flujoData);
    console.log('Estas son las actividades', actividadesData);
    for (const actividad of actividadesData) {
      for (const tarea of actividad['TAREAS']) {
        handleAsignTask(tarea);
        console.log('TAREA DENTRO DEL ARREGLO ', tarea);
      }
      console.log('terminado');
    }
  };

  const handleAsignTask = async (tarea) => {
    try {
      const dataTarea = {
        vchestado: estadosTareaExpediente.PENDIENTE,
        expedienteid: expediente.ExpedienteId,
        numtareaid: tarea.NUMTAREAID,
        fecfechainicio: new Date(),
        fecfechaculminacion: new Date(),
      };

      const nuevaTareaId = await crearExpedienteTarea(dataTarea);
      if (nuevaTareaId) {
        setTareasExpediente([...tareasExpediente, nuevaTareaId]);
      } else {
        console.error(`Error al crear la tarea para actividad ${tarea.NUMACTIVIDADID}`);
      }
    } catch (error) {
      console.error('Error en handleAsignTask:', error);
    }
  };
  console.log(tareasExpediente);
  return (
    <>
      <div className='px-4 '>
        <Breadcrumbs>
          <BreadcrumbItem onClick={() => router.push(`/dashboard/expedientes`)}>
            <p className='text-md'>Expedientes</p>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <p className='text-md'>{expediente.NumeroExpediente}</p>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <Title title={`Expediente - ${expediente.NumeroExpediente}`} />
      <div className='flex w-full flex-col px-4'>
        <Tabs aria-label='Options'>
          <Tab key='detalle' title='Detalle'>
            <div className='md:grid md:grid-cols-5 gap-4 mb-4 h-full md:grid-rows-1 flex flex-col'>
              <Card className='flex flex-col w-full p-4 rounded-lg h-full col-span-2 gap-4'>
                <h3 className='font-bold text-xl'>Actualizacion de datos</h3>
                <div className='grid '>
                  {DatoExpediente({
                    nombre: 'Expediente',
                    valor: expediente.NumeroExpediente,
                  })}
                  {DatoExpediente({
                    nombre: 'Demanda',
                    valor: expediente.Demanda,
                  })}
                  {DatoExpediente({
                    nombre: 'Razon Social',
                    valor: expediente.RazonSocial,
                  })}
                  {DatoExpediente({
                    nombre: 'Estudio',
                    valor: expediente.Estudio,
                  })}
                  {DatoExpediente({ nombre: 'RUC', valor: expediente.Ruc })}
                  {DatoExpediente({
                    nombre: 'Cuantía',
                    valor: expediente.Cuantia,
                  })}
                  {DatoExpediente({
                    nombre: 'Organo Jurisdiccional',
                    valor: expediente.OrganoJurisdiccional,
                  })}
                  {DatoExpediente({
                    nombre: 'Distrito Judicial',
                    valor: expediente.DistritoJudicial,
                  })}
                  {DatoExpediente({
                    nombre: 'Juez',
                    valor: expediente.Juez,
                  })}
                  {DatoExpediente({
                    nombre: 'Especialista Legal',
                    valor: expediente.EspecialistaLegal,
                  })}
                  {DatoExpediente({
                    nombre: 'Fecha Inicio',
                    valor: expediente.FechaInicio,
                  })}
                  {DatoExpediente({
                    nombre: 'Proceso',
                    valor: expediente.Proceso,
                  })}
                  {DatoExpediente({
                    nombre: 'Observacion',
                    valor: expediente.Observacion,
                  })}
                  {DatoExpediente({
                    nombre: 'Especialidad',
                    valor: expediente.Especialidad,
                  })}
                  {DatoExpediente({
                    nombre: 'Estado',
                    valor: expediente.Estado,
                  })}
                  {DatoExpediente({
                    nombre: 'Etapa Procesal',
                    valor: expediente.EtapaProcesal,
                  })}
                  {DatoExpediente({
                    nombre: 'Fecha Conclucion',
                    valor: expediente.FechaConclucion,
                  })}
                  {DatoExpediente({
                    nombre: 'Ubicacion',
                    valor: expediente.Ubicacion,
                  })}
                  {DatoExpediente({
                    nombre: 'MotivoConclucion',
                    valor: expediente.MotivoConclucion,
                  })}
                  {DatoExpediente({
                    nombre: 'Sumilla',
                    valor: expediente.Sumilla,
                  })}
                  {DatoExpediente({
                    nombre: 'Demandado',
                    valor: expediente.Demandado,
                  })}
                  {DatoExpediente({
                    nombre: 'Ultima Clasificacion',
                    valor: expediente.UltimaClasificacion,
                  })}
                  {DatoExpediente({
                    nombre: 'Fecha Ultima Clasificacion',
                    valor: expediente.FechaUltimaClasificacion,
                  })}
                  {DatoExpediente({
                    nombre: 'Movimiento Ultima Clasificacion',
                    valor: expediente.MovimientoUltimaClasificacion,
                  })}
                  {DatoExpediente({
                    nombre: 'Clasificacion Priorizada',
                    valor: expediente.ClasificacionPriorizada,
                  })}
                  {DatoExpediente({
                    nombre: 'Fecha Clasificacion Priorizada',
                    valor: expediente.FechaClasificacionPriorizada,
                  })}
                  {DatoExpediente({
                    nombre: 'Movimiento Clasificacion Priorizada',
                    valor: expediente.MovimientoClasificacionPriorizada,
                  })}
                  {DatoExpediente({
                    nombre: 'Nombre de Cliente',
                    valor: expediente.NombreCliente,
                  })}
                  {DatoExpediente({
                    nombre: 'Codigo de Cliente',
                    valor: expediente.CodigoCliente,
                  })}
                </div>
              </Card>
              <Card className='col-span-3 flex flex-col w-full p-4 rounded-lg h-full gap-4'>
                <h3 className='font-bold text-xl'>Seguimiento</h3>
                <div className='flex flex-col gap-3'>
                  {expediente.expedientes_seguimiento?.map((notificacion) => (
                    <Notification key={notificacion.NumeroEsquina} notificacion={notificacion} />
                  ))}
                  {!expediente.expedientes_seguimiento && (
                    <p className='text-center py-8 '>No existen notificaciones</p>
                  )}
                </div>
              </Card>
            </div>
          </Tab>
          <Tab title='Tareas'>
            {tareas.length > 0 ? (
              <DetalleExpedienteAsignados
                expediente={expediente}
                tareas={tareas}
                TotalexpedienteTarea={tareasExpediente}
              />
            ) : (
              <DetalleExpedienteTarea expedientedata={expediente} flujos={totalFlujos} />
            )}
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

const Notification = ({ notificacion }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const empresa = process.env.CLIENTE;
  const handleDownloadFile = async (archivo) => {
    const ruta = `expedientes/${empresa}${archivo}`;
    await descargarArchivo(ruta);
  };
  return (
    <Card className='flex flex-col gap-2 rounded-lg shadow-md p-4'>
      <div className='flex flex-col gap-2'>
        <p className='text-sm uppercase'>
          {notificacion.Acto} / {notificacion.Resolucion} - {notificacion.FechaResolucion} / Tipo :{' '}
          {notificacion.TipoNotificacion} / Sumilla : {notificacion.Sumilla}
        </p>
        <div className='flex items-center justify-between'>
          <p className='text-xs text-gray-500'>
            Fecha del movimiento {notificacion.FechaProveido} ( Creado el{' '}
            {notificacion.FechaResolucion})
          </p>
          <Button
            className='text-xs p-0 justify-start bg-transparent w-max text-gray-500'
            onPress={onOpen}
          >
            Cantidad de Notificaciones {notificacion.Notificaciones.length}
          </Button>
        </div>
        {notificacion.EnlaceDescarga && (
          <div className='flex items-center justify-end'>
            <Button
              color='primary'
              className='text-xs px-4  text-white'
              onPress={() => handleDownloadFile(notificacion.EnlaceDescarga)}
            >
              Descargar Resolución
            </Button>
          </div>
        )}
        <ModalNotificaciones
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          notificaciones={notificacion.Notificaciones}
        />
      </div>
    </Card>
  );
};
const DatoExpediente = ({ nombre, valor }) => {
  return (
    <>
      <div className='grid grid-cols-2 border-b-[0.5px] border-gray-700 py-2'>
        <div className='flex items-center'>
          <p className='text-sm md:text-md font-semibold'>{nombre}</p>
        </div>
        <div className='flex flex-col justify-center'>
          <p className='text-sm md:text-md'>{valor}</p>
        </div>
      </div>
    </>
  );
};
