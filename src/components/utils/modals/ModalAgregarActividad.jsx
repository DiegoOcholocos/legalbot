'use client';
import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { crearActividad } from '@/services/Prisma/Actividad';

export default function ModalActividadAgregar({
  dataId,
  setTotActividades,
  totActividades = [],
}) {
  console.log('totActividades: ', totActividades);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const [values, setValues] = useState({
    NUMFLUJOID: '',
    VCHNOMBRE: '',
  });

  const handlecrearActividad = async () => {
    const res = await crearActividad(dataId, values.VCHNOMBRE);
    if (totActividades == null) {
      setTotActividades([res]);
    } else {
      setTotActividades([...totActividades, res]);
    }
    onOpenChange(!isOpen);
  };

  return (
    <>
      <Button onPress={onOpen} color='primary'>
        Crear Actividad
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => onOpenChange(!isOpen)}
        placement='top-center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Crear Activdad
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Text'
                  name='VCHNOMBRE'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={() => handlecrearActividad()}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
