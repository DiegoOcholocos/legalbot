'use client';
import { useState, useEffect } from 'react';
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
import { editarFlujo, obtenerFlujos } from '@/services/Prisma/Flujo';
import { RxPencil1 } from 'react-icons/rx';
export default function ModalEditFlujo({ flujo, setFlujoEd }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [values, setValues] = useState({
    VCHNOMBRE: flujo?.VCHNOMBRE,
  });
  useEffect(() => {
    setValues({
      VCHNOMBRE: flujo?.VCHNOMBRE,
    });
  }, [flujo]);
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };
  console.log(values);
  const handleEditButton = async () => {
    const res = await editarFlujo(flujo.NUMFLUJOID, values.VCHNOMBRE);
    setFlujoEd(res);
    onOpenChange(!isOpen);
  };

  return (
    <>
      <Button onPress={onOpen} color='warning'>
        <RxPencil1 />
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
                Editar Flujo
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Text'
                  name='VCHNOMBRE'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                  defaultValue={flujo.VCHNOMBRE}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={() => handleEditButton()}>
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
