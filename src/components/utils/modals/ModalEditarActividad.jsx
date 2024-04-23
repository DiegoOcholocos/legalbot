'use client';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import {
  editarActividad,
  obtenerActividad,
  obtenerActividadesPorFlujo,
} from '@/services/Prisma/Actividad';
export default function ModalActividadEditar({
  actividad,
  setTotActividades,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const [values, setValues] = useState({
    VCHNOMBRE: actividad?.VCHNOMBRE,
  });

  useEffect(() => {
    setValues({
      VCHNOMBRE: actividad?.VCHNOMBRE,
    });
  }, [actividad]);

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditButton = async () => {
    const res = await editarActividad(
      actividad.NUMACTIVIDADID,
      values.VCHNOMBRE
    );
    const actividades = await obtenerActividadesPorFlujo(actividad.NUMFLUJOID);
    setTotActividades(actividades);
    onOpenChange(!isOpen);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(!isOpen)}
      placement='top-center'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Editar Actividad
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label='Text'
                name='VCHNOMBRE'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={actividad.VCHNOMBRE}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                Cerrar
              </Button>
              <Button color='primary' onPress={() => handleEditButton()}>
                Aceptar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
