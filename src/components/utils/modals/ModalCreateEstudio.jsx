'use client';
import React, { useState, useEffect } from 'react';
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
import { crearRegistroEstudios } from '@/services/Prisma/Estudio';

export default function ModalCreateEstudio({ setEstudios, estudios }) {
  const [values, setValues] = useState({
    estudio: '',
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mostrarError, setMostrarError] = useState({
    estudio: false,
  });

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
    setMostrarError((prevState) => ({ ...prevState, [name]: value === '' }));
  };

  const handleCreateEstudio = async () => {
    const { estudio } = values;
    const errores = {
      estudio: estudio === '',
    };
    if (Object.values(errores).some((error) => error)) {
      setMostrarError(errores);
    } else {
      setMostrarError({
        estudio: false,
      });
      try {
        const res = await crearRegistroEstudios(values.estudio);
        console.log('registro : ', res);
        if (
          !estudios.find((estudio) => estudio.NUMESTUDIOID == res.NUMESTUDIOID)
        ) {
          setEstudios((prevState) => [...prevState, res]);
        }
        setValues({
          estudio: '',
        });
        onOpenChange(false);
      } catch (error) {
        console.error('Error en el registro :', error);
      }
    }
  };

  return (
    <>
      <Button onPress={onOpen} color='primary'>
        Crear estudio
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Datos del estudio
              </ModalHeader>
              <ModalBody>
                <Input
                  label='Ingrese un estudio'
                  name='estudio'
                  variant='bordered'
                  onChange={handleValues}
                  errorMessage={
                    mostrarError.estudio ? 'Este campo es requerido' : ''
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color='primary'
                  onPress={() => handleCreateEstudio(values)}
                >
                  Crear estudio
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
