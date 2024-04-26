'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Breadcrumbs,
  BreadcrumbItem,
  Tab,
  Tabs,
  CardFooter,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import ModalEditFlujo from '@/components/utils/modals/ModalEditFlujo';
import ModalNuevaTarea from '@/components/utils/modals/ModalNuevaTarea';
import ModalActividadAgregar from '@/components/utils/modals/ModalAgregarActividad';
import ModalActividadEditar from '@/components/utils/modals/ModalEditarActividad';

import ModalEliminarActividad from '@/components/utils/modals/ModalEliminarActividad';
import { obtenerTareasActividad } from '@/services/Prisma/Tarea';
import { useRouter } from 'next/navigation';

import { useDisclosure } from '@nextui-org/react';
import { IoMdSettings } from 'react-icons/io';
import Title from '@/components/utils/system/Title';
import TablaTareas from '../tareas/TablaTareas';

const DetalleFlujo = ({ flujo, actividades, usuarios, roles }) => {
  const [idact, setIdAct] = useState(null);
  const [totActividades, setTotActividades] = useState(actividades);
  const [tareas, setTareas] = useState([]);
  const [flujoEd, setFlujoEd] = useState(flujo);
  const router = useRouter();
  const editarActividad = useDisclosure();
  const eliminarActividad = useDisclosure();
  useEffect(() => {
    if (idact) {
      const fetchTotTareas = async () => {
        try {
          const totalActividades = await obtenerTareasActividad(idact);
          setTareas(totalActividades);
        } catch (error) {
          console.error('Error al obtener el total de actividades:', error);
        }
      };
      fetchTotTareas();
    }
  }, [idact]);

  const busacarActividad = (id) => {
    const idNum = parseInt(id);
    const actividad = totActividades?.find(
      (actividad) => actividad?.NUMACTIVIDADID === idNum
    );
    return actividad;
  };
  return (
    <>
      <div className='px-4 '>
        <Breadcrumbs>
          <BreadcrumbItem onClick={() => router.push(`/dashboard/flujos`)}>
            <p className='text-lg'>Flujos</p>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <p className='text-lg'>
              {flujoEd?.VCHNOMBRE !== null ? flujoEd.VCHNOMBRE : 'Cargando...'}
            </p>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <Title title={`Flujo - ${flujoEd.VCHNOMBRE}`}>
        <ModalEditFlujo flujo={flujoEd} setFlujoEd={setFlujoEd} />
      </Title>
      <div className='flex w-full flex-col px-4'>
        <Card className='w-full flex flex-col gap-4 p-4'>
          <CardBody className='flex flex-col gap-4'>
            <div className='flex w-full justify-between'>
              <h3 className='text-lg font-semibold'>ACTIVIDADES</h3>
              <div className='flex gap-4'>
                <ModalActividadAgregar
                  dataId={flujoEd.NUMFLUJOID}
                  totActividades={totActividades}
                  setTotActividades={setTotActividades}
                />
              </div>
            </div>
            {!totActividades ? (
              <p className='text-center py-4'>No existen Actividades</p>
            ) : (
              <>
                <Tabs
                  fullWidth
                  radius='md'
                  color='primary'
                  onSelectionChange={setIdAct}
                >
                  {totActividades?.map((Actividad) => (
                    <Tab
                      key={Actividad.NUMACTIVIDADID}
                      color='primary'
                      title={
                        <div className='flex items-center relative w-full text-center justify-center '>
                          <h1>{Actividad.VCHNOMBRE}</h1>
                          {Actividad.NUMACTIVIDADID === parseInt(idact) && (
                            <div className='absolute right-0 z-50'>
                              <Dropdown backdrop='blur'>
                                <DropdownTrigger>
                                  <Button isIconOnly size='sm' variant='light'>
                                    <IoMdSettings />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                  <DropdownItem
                                    onPress={() =>
                                      editarActividad.onOpenChange(
                                        !editarActividad.isOpen
                                      )
                                    }
                                  >
                                    Editar
                                  </DropdownItem>
                                  <DropdownItem
                                    onPress={() =>
                                      eliminarActividad.onOpenChange(
                                        !eliminarActividad.isOpen
                                      )
                                    }
                                  >
                                    Eliminar
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          )}
                        </div>
                      }
                      className='w-full block'
                    >
                      <TablaTareas
                        tareas={tareas}
                        setTareas={setTareas}
                        usuarios={usuarios}
                        roles={roles}
                      />
                    </Tab>
                  ))}
                </Tabs>
                <div className='w-full flex justify-center items-center my-4 gap-2'>
                  <ModalNuevaTarea
                    idActi={idact}
                    idFluj={flujoEd.NUMFLUJOID}
                    totalUsuarios={usuarios}
                    totalRol={roles}
                    setTareas={setTareas} // Pasar la función de actualización como prop
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
      <ModalActividadEditar
        actividad={busacarActividad(idact)}
        totActividades={totActividades}
        setTotActividades={setTotActividades}
        isOpen={editarActividad.isOpen}
        onOpen={editarActividad.onOpen}
        onOpenChange={editarActividad.onOpenChange}
      />
      <ModalEliminarActividad
        actividad={busacarActividad(idact)}
        totActividades={totActividades}
        setTotActividades={setTotActividades}
        isOpen={eliminarActividad.isOpen}
        onOpen={eliminarActividad.onOpen}
        onOpenChange={eliminarActividad.onOpenChange}
      />
    </>
  );
};

export default DetalleFlujo;
