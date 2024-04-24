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
import { obtenerFlujo } from '@/services/Prisma/Flujo'
import { obtenerActividadesPorFlujo, ObtenerTareasporActividad } from '@/services/Prisma/Actividad';
import { crearExpedienteTarea } from '@/services/Prisma/ExpedienteTarea'
import { obtenerTareasActividad } from '@/services/Prisma/Tarea';
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
    const [actividades, setActividades] = useState([]);
    useEffect(() => {

        (async () => {
            console.log(expedientedata)
            const data = await obtenerExpedienteTarea(expedientedata.ExpedienteId);
            setTareasExpediente(data);
            console.log(data);
            console.log(flujos);
        })();
    }, []);


    const handleAsignWorflow = async () => {
        console.log("este es el flujo", flujoId)
        const flujoData = await obtenerFlujo(flujoId);
        console.log('f:', flujoData);
        const actividadesData = await obtenerActividadesPorFlujo(
            flujoData.NUMFLUJOID
        );
        console.log("ACTIVIDADES POR FLUJO", actividadesData)
        for (const actividad of actividadesData) {
            const tareasData = await obtenerTareasActividad(actividad.NUMACTIVIDADID);
            actividad['TAREAS'] = tareasData;
        }
        setActividades([...actividadesData]);

        setMostrarFlujoData(true);

        console.log("Este es el flujo", flujoData)
        console.log("Estas son las actividades", actividadesData)
        for (const actividad of actividadesData) {
            for (const tarea of actividad['TAREAS']) {
                handleAsignTask(tarea)
                console.log("TAREA DENTRO DEL ARREGLO ", tarea)
            }
        }

        // for (const Tarea of actividadesData['TAREAS']) {
        //   handleAsignTask(Tarea);
        // }

    };

    const handleAsignTask = async (tarea) => {
        const fechaculminacion = new Date().getDate()+tarea.NUMDIASDURACIONN;
        console.log("Esta es la fecha para culminar ",fechaculminacion);
        try {
            const dataTarea = {
                VCHESTADO: "pendiente",
                expedienteid: expedientedata.ExpedienteId,
                NUMTAREAID: tarea.NUMTAREAID,
                FECHAINICIO: new Date(),
                FECFECHACULMINACION: new Date(),
                FECHFECHACREACION: new Date(),
            };

            const nuevaTareaId = await crearExpedienteTarea(dataTarea);
            if (nuevaTareaId) {
                setTareasExpediente([...tareasExpediente, nuevaTareaId]);
            } else {
                console.error(
                    `Error al crear la tarea para actividad ${tarea.NUMACTIVIDADID}`
                );
            }
        } catch (error) {
            console.error('Error en handleAsignTask:', error);
        }
    };
    return (
        <>
            {tareasExpediente.length && (
                <Card>
                    <CardHeader>Ya ha sido asignado un flujo</CardHeader>
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
                                <Autocomplete
                                    label='Elegir un flujo'
                                    className='max-w-xs'
                                    onSelectionChange={setFlujoId}
                                >
                                    {flujos.map((flujo) => (
                                        <AutocompleteItem
                                            key={flujo.NUMFLUJOID}
                                            value={flujo.VCHNOMBRE}
                                        >
                                            {flujo.VCHNOMBRE}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Button
                                    className='py-2 px-4 rounded-md '
                                    size='md'
                                    onPress={() => handleAsignWorflow()}
                                >
                                    Asginar flujo
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}
            <Card className='my-4'>
                {/* {mostrarFlujoData && (
                <div className='p-4'>
                  <h3>Flujo {flujoId}</h3>
                  <Accordion>
                    {actividades?.map((actividad, index) => (
                      <AccordionItem
                        key={actividad.NUMACTIVIDADID}
                        aria-label={`Actividad ${index}`}
                        title={actividad.VCHNOMBRE}
                      >
                        {actividad.TAREAS?.map((tarea) => (
                          <div key={tarea.NUMTAREAID} className='mt-4'>
                            <div className='flex justify-between'>
                              <div>
                                <h3>{tarea.VCHNOMBRE}</h3>
                              </div>
                              <div className='flex gap-4'>
                                <Button
                                  className='py-2 px-4 rounded-md'
                                  color='primary'
                                  size='md'
                                // onPress={() => handleAsignTask(tarea)}
                                >
                                  Accion
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )} */}
            </Card>
        </>
    );
}