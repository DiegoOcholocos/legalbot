'use client';
import React, { useState } from 'react';
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
import { crearFlujo } from '@/services/Prisma/Flujo';

export default function ModalNuevoFlujo({
  usersesion,
  setTotFlujos,
  totFlujos,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nuevoflujo, setnuevoflujo] = useState('');

  const handleEditButton = async () => {
    const res = await crearFlujo(nuevoflujo, usersesion);
    if (!totFlujos.find((flujo) => flujo.NUMFLUJOID == res.NUMFLUJOID)) {
      setTotFlujos((prevState) => [...prevState, res]);
    }
    onOpenChange(!isOpen);
  };

  return (
    <>
      <Button onPress={onOpen} color='primary' style={{ marginLeft: '20px' }}>
        Crear Flujo
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
                Nuevo Flujo
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Text'
                  name='VCHNOMBRE'
                  variant='bordered'
                  value={nuevoflujo}
                  onChange={(e) => setnuevoflujo(e.target.value)}
                  isClearable
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={() => handleEditButton()}>
                  Crear Flujo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
