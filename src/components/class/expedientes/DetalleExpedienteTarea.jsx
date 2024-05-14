'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  useDisclosure,
  ScrollShadow,
  Breadcrumbs,
  BreadcrumbItem,
  Tabs,
  Tab,
  CardBody,
  CardHeader,
  Autocomplete,
  AutocompleteItem,
  Accordion,
  AccordionItem,
} from '@nextui-org/react';
import { obtenerExpedienteTarea } from '@/services/Prisma/ExpedienteTarea';
import { obtenerFlujo } from '@/services/Prisma/Flujo';
import { obtenerActividadesPorFlujo, obtenerTareasporActividad } from '@/services/Prisma/Actividad';
import { crearExpedienteTarea } from '@/services/Prisma/ExpedienteTarea';
import { obtenerTareasActividad } from '@/services/Prisma/Tarea';
import { obtenerFechasFeriados } from '@/services/Prisma/fechas';
export default function DetalleExpedienteTarea({
  expedientedata,
  flujos,
  TotalexpedienteTarea,
  tareas,
}) {
  const [tareasExpediente, setTareasExpediente] = useState([]);
  const [mostrarFlujoData, setMostrarFlujoData] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [flujoId, setFlujoId] = useState('');
  const [feriados, setFeriados] = useState([]);
  const [actividades, setActividades] = useState([]);
  useEffect(() => {
    (async () => {
      console.log(expedientedata);
      const data = await obtenerExpedienteTarea(expedientedata.ExpedienteId);
      setTareasExpediente(data);
      console.log(data);
      console.log(flujos);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const feriadosData = await obtenerFechasFeriados();
      const feriadosFormat = feriadosData.map((feriado) => new Date(feriado.FECHA).toDateString());
      setFeriados(feriadosFormat);
    })();
  }, []);

  const handleAsignWorflow = async () => {
    console.log('este es el flujo', flujoId);
    const flujoData = await obtenerFlujo(flujoId);
    console.log('f:', flujoData);
    const actividadesData = await obtenerActividadesPorFlujo(flujoData.NUMFLUJOID);
    console.log('ACTIVIDADES POR FLUJO', actividadesData);
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
    }

    // for (const Tarea of actividadesData['TAREAS']) {
    //   handleAsignTask(Tarea);
    // }
  };
  function agregarDiasLaborables(fechaInicio, numDias) {
    let fecha = new Date(fechaInicio);
    let diasAgregados = 0;
    while (diasAgregados < numDias) {
      fecha.setDate(fecha.getDate() + 1);
      const diaDeLaSemana = fecha.getDay();
      const esFeriado = feriados.includes(fecha.toDateString());

      if (!esFeriado && diaDeLaSemana !== 0 && diaDeLaSemana !== 6) {
        diasAgregados++;
      }
    }
    return fecha;
  }

  const handleAsignTask = async (tarea) => {
    try {
      const dataTarea = {
        VCHESTADO: 'pendiente',
        expedienteid: expedientedata.ExpedienteId,
        NUMTAREAID: tarea.NUMTAREAID,
        FECHAINICIO: new Date(),
        FECFECHACULMINACION: agregarDiasLaborables(new Date(), tarea.NUMDIASDURACION),
        FECHFECHACREACION: new Date(),
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
  return (
    <>
      {tareasExpediente.length > 0 && (
        <Card>
          <CardHeader>Recarge la pagina porfavor</CardHeader>
        </Card>
      )}
      {!tareasExpediente.length && (
        <Card>
          <CardHeader>Asignar un flujo</CardHeader>
          <CardBody>
            {!flujos.length && (
              <div className='flex flex-col items-center justify-center gap-4'>
                <h1>No hay Flujos disponibles</h1>
                <Button
                  className='py-2 px-4 rounded-md'
                  size='md'
                  onPress={() => router.push(`/dashboard/Flujos`)}
                >
                  Crear un Flujo
                </Button>
              </div>
            )}
            {flujos.length && (
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <select
                    className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
                    onChange={(e) => setFlujoId(e.target.value)}
                  >
                    <option value='' disabled selected>
                      Elegir un flujo
                    </option>
                    {flujos.map((flujo) => (
                      <option key={flujo.NUMFLUJOID} value={flujo.NUMFLUJOID}>
                        {flujo.VCHNOMBRE}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  className='py-2 px-4 rounded-md'
                  size='md'
                  onPress={() => handleAsignWorflow()}
                >
                  Asignar flujo
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )}
      <Card className='my-4'></Card>
    </>
  );
}
