'use client';
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { crearRol, editarRol } from '@/data/prismaActions';

export default function ModalRol({ isOpen, onOpenChange, mode, data, roles, setRoles }) {
  const [credentials, setCredentials] = useState();

  useEffect(() => {
    if (!data) {
      setCredentials({
        rol: '',
      });
    } else {
      console.log(data);
      setCredentials({
        rolId: data.NUMROLID,
        rol: data.VCHNOMBRE,
      });
    }
  }, [data]);

  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmitBtn = async () => {
    try {
      if (mode === 'crear') {
        const res = await crearRol(credentials);
        if (res) {
          setRoles((prevState) => [...prevState, res]);
        }
      }
      if (mode === 'editar') {
        const res = await editarRol(credentials);
        if (res) {
          setRoles((prevState) => {
            const index = prevState.findIndex((rol) => rol.NUMROLID === res.NUMROLID);
            if (index !== -1) {
              const updatedRoles = [...prevState];
              updatedRoles[index] = res;
              return updatedRoles;
            }
            return prevState;
          });
        }
      }
      setCredentials({
        nombre: '',
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    onOpenChange(!isOpen);
  };

  return (
    <div className="p-4">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{mode === 'crear' ? 'Nuevo Rol' : 'Editar Rol'}</ModalHeader>
              <ModalBody>
                <Input
                  label="Ingrese un rol"
                  name="rol"
                  variant="bordered"
                  onChange={handleCredentials}
                  defaultValue={mode === 'editar' ? data.VCHNOMBRE : ''}
                  isInvalid={!credentials?.rol}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleSubmitBtn}>
                  {mode === 'crear' ? 'Guardar' : 'Editar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
