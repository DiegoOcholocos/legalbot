'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { crearRegistroEstudios, editarEstudio, eliminarEstudio } from '@/services/Prisma/Estudio';

export default function ModalEstudios({ isOpen, onOpen,  onOpenChange,  mode,  editData,  setEstudios,  estudios}) {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    setIsValid(true);
  };

  useEffect(() => {
    console.log(`edit data: ${editData}`)
    setData(editData);
    setError('');
  }, [editData]);
  

  const saveAction = async () => {
    if (!data.VCHNOMBRE) { 
      setIsValid(false);
      return;
    }
    if (mode === 'Crear') {
      const res = await crearRegistroEstudios(data.VCHNOMBRE);
      if (res) {
        if (
          !estudios.find((estudio) => estudio.NUMESTUDIOID == res.NUMESTUDIOID)
        ) {
          setEstudios((prevState) => [...prevState, res]);
        }
        onOpenChange();
      } else {
        setError('Error al crear el estudio');
      }
    }
    if (mode === 'Editar') {
      const res = await editarEstudio(data.NUMESTUDIOID, data.VCHNOMBRE);
      const estudiosActualizados = estudios.filter(
        (estudio) => estudio.NUMESTUDIOID !== data.NUMESTUDIOID
      );
      if (res) {
        setEstudios([...estudiosActualizados, res]);
        onOpenChange();
      } else {
        setError('Error al editar el rol');
      }
    }
    if (mode === 'Eliminar') {
      const res = await eliminarEstudio(data.NUMESTUDIOID);
      const estudiosActualizados = estudios.filter(
        (estudio) => estudio.NUMESTUDIOID !== data.NUMESTUDIOID
      );
      if (res) {
        setEstudios(estudiosActualizados);
        onOpenChange();
      } else {
        setError('Error al eliminar el rol');
      }
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <h2 className='font-bold'>{mode} Estudio</h2>
              </ModalHeader>
              <ModalBody>
              {error && <p className='text-red-500'>{error}</p>}
              {mode === 'Crear' && (
                <Input
                  label='Ingrese un estudio'
                  name='VCHNOMBRE'
                  variant='bordered'
                  onChange={handleCredentials}
                  isInvalid={!isValid}
                />
              )}
              {mode === 'Editar' && (
                <Input
                  label='Ingrese un estudio'
                  name='VCHNOMBRE'
                  variant='bordered'
                  onChange={handleCredentials}
                  defaultValue={editData.VCHNOMBRE}
                  isInvalid={!isValid}
                />
              )}
              {mode === 'Eliminar' && <h1>Desea eliminar el estudio {editData.VCHNOMBRE}?</h1>}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color='primary'
                  onPress={saveAction}
                >
                  {mode === 'Crear' && <h1>Crear</h1>}
                  {mode === 'Editar' && <h1>Editar</h1>}
                  {mode === 'Eliminar' && <h1>Aceptar</h1>}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
