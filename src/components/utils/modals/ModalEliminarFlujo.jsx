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
} from '@nextui-org/react';
import { eliminarFlujo } from '@/services/Prisma/Flujo';
export default function ModalEliminarFlujo({
  dataId,
  setTotFlujos,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const [values, setValues] = useState({
    NUMACTIVIDADID: '',
    VCHNOMBRE: '',
  });

  useEffect(() => {
    console.log('data id para prisma ==>  ');
    const fetchData = async () => {
      // const flujo = await getFlujo(credentialsUser.email);
      // setNomFlujo(flujo.VCHUSUARIOCREACION);
    };
    fetchData();
  }, []);

  const handledeleteButton = async () => {
    try {
      const res = await eliminarFlujo(dataId);
      if (res) {
        console.log(res);
        setTotFlujos((prevState) => {
          return prevState.filter((element) => element.NUMFLUJOID !== dataId);
        });
      }
    } catch (error) {
      console.error('Error eliminando el flujo:', error);
    }
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
              Eliminar flujo
            </ModalHeader>
            <ModalBody>¿Esta seguro de eliminar el flujo?</ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  handledeleteButton();
                  onClose();
                }}
              >
                Eliminar flujo
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
