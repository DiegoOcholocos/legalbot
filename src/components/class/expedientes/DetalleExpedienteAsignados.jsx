'use client';
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@nextui-org/react';
import { obtenerExpedienteTarea, editarTareaActividad, obtenerDatos } from '@/services/Prisma/ExpedienteTarea';
import { obtenerActividades } from '@/services/Prisma/Actividad';
export default function DetalleExpedienteAsignados({
    expediente,
}) {
    const [actividades, setActividades] = useState([]);
    const [tareas, setTareas] = useState([]); 
    const [tareasAgrupadas, setTareasAgrupadas] = useState([]);

      useEffect(() => {
        (async () => {
          try {
            const activ = await obtenerActividades();
            setActividades(activ);
            console.log("Datos expediente:", expediente.ExpedienteId);
            const data = await obtenerDatos(expediente.ExpedienteId);
            console.log("Datos obtenidos:", data);
      
            // Verifica que data contiene BOOLTERMINADO y establece el estado
            const updatedData = data?.map(tarea => ({
              ...tarea,
              BOOLTERMINADO: tarea.BOOLTERMINADO !== null ? tarea.BOOLTERMINADO.toString() : "false"
            }));
            console.log("Se subio a set tareas");
            setTareas(updatedData);
            
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        })();
      }, []); 

      useEffect(() => { 
        if (tareas.length > 0) {
          // Agrupar tareas por NUMACTIVIDADID
          const groupedTareas = tareas.reduce((acc, tarea) => {
            const key = tarea["TE_TAREA"].NUMACTIVIDADID;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(tarea);
            return acc;
          }, {});

          console.log("1    ",tareas);
          console.log("2    ",groupedTareas);
          console.log("Se subio a set setTareasAgrupadas");
          setTareasAgrupadas(Object.values(groupedTareas));
        }
      }, [tareas]);

    const cambiarboolean = async (NUMEXPEDTAREAID) => {
        try {
          const tarea = tareas.find((t) => t.NUMEXPEDTAREAID === NUMEXPEDTAREAID);
          console.log("buscar tarea ===>  ", tarea);
          if (!tarea) {
            console.error("Tarea no encontrada");
            return;
          }
          console.log("data tareas ===>  ", tareas);
      
          // Verificar si hay tareas anteriores de la misma actividad sin completar
          const tareasMismaActividadMenores = tareas.filter(
            (t) =>
              t["TE_TAREA"].NUMACTIVIDADID < tarea["TE_TAREA"].NUMACTIVIDADID && t.BOOLTERMINADO !== "true"
          );
      
          // Si hay tareas anteriores sin completar, no se puede marcar la tarea actual como completada
          if (tareasMismaActividadMenores.length > 0) {
            console.log(
              "No se puede marcar como completada, tareas anteriores sin completar."
            );
            return;
          }
      
          // Cambiar el estado de la tarea
          await editarTareaActividad(NUMEXPEDTAREAID);
      
          // Actualizar el estado del checkbox en la lista de tareas
          const updatedTareas = tareas.map((t) => {
            if (t.NUMEXPEDTAREAID === NUMEXPEDTAREAID) {
              return {
                ...t,
                BOOLTERMINADO: t.BOOLTERMINADO === "true" ? "false" : "true", // Cambiar el estado del checkbox
              };
            }
            return t;
          });
          setTareas(updatedTareas);
        } catch (error) {
          console.error("Error en cambiarboolean:", error);
        }
      };

    return (
        <>
            <Card>
                <CardHeader>Tareas asignadas al expediente</CardHeader>
                    <CardBody>
                        <div>
                            {tareasAgrupadas.map((grupo, index) => (
                                <Card key={index} className="my-4">
                                <CardBody>
                                    <Table aria-label={`Tareas del grupo ${index}`}>
                                    <TableHeader>
                                        <TableColumn>Actividad</TableColumn>
                                        <TableColumn>Tareas asignadas</TableColumn>
                                        <TableColumn>Fue Completado?</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {grupo.map((tarea) => (
                                        <TableRow key={tarea.NUMEXPEDTAREAID}>
                                            <TableCell>{tarea["TE_TAREA"]["TE_ACTIVIDAD"].VCHNOMBRE}</TableCell>
                                            <TableCell>{tarea["TE_TAREA"].VCHNOMBRE}</TableCell>
                                            <TableCell align="center">
                                            <Checkbox
                                                isSelected={tarea.BOOLTERMINADO === "true"}
                                                onValueChange={() => cambiarboolean(tarea.NUMEXPEDTAREAID)}
                                            />
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </CardBody>
                                </Card>
                            ))}
                        </div>
                </CardBody>
            </Card>
        </>
    );
}