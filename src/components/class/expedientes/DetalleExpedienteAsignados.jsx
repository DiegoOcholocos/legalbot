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
export default function DetalleExpedienteAsignados({
    expediente,
    totalFlujos,
    TotalexpedienteTarea,
    tareas,
}) {
    const [tareasExpediente, setTareasExpediente] = useState([]);
    const [mostrarFlujoData, setMostrarFlujoData] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [flujoId, setFlujoId] = useState('');

    useEffect(() => {
        (async () => {
            const data = await obtenerExpedienteTarea(expediente.ExpedienteId);
            setTareasExpediente(data);
            console.log(data);
        })();
    }, []);


    const handleAsignWorflow = async () => {
        if (!flujoId) {
            return;
        }
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
            console.log("TATATATATTAT", actividad['TAREAS'])
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
        try {
            const dataTarea = {
                vchestado: "pendiente",
                expedienteid: expediente.ExpedienteId,
                numtareaid: tarea.NUMTAREAID,
                fecfechainicio: new Date(),
                fecfechaculminacion: new Date(),

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
            <Card>
                <CardHeader>Tareas asignadas al expediente</CardHeader>
                <CardBody>
                    {!TotalexpedienteTarea.length && (
                        <div className='flex flex-col items-center justify-center gap-4'>
                            <h1>No hay Tareas asignadas</h1>
                        </div>
                    )}
                    {TotalexpedienteTarea.length && (
                        <div className='flex items-center gap-4'>
                            <div>
                                {TotalexpedienteTarea.map(tarea => (
                                    <Card key={tarea.NumeroExpediente}>
                                        <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p>Tarea {tarea.NumeroExpediente}</p>
                                                <p>Estado: {tarea.vchestado}</p>
                                            </div>
                                            <Button>Acción</Button>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
}