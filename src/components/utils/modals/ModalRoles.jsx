import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { crearRol, editarRol, eliminarRol } from '@/services/Prisma/Rol';

export default function ModalRoles({
  isOpen,
  onOpen,
  onOpenChange,
  mode,
  editData,
  setRolesTotales,
  rolesTotales,
}) {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    setData(editData);
    setError('');
  }, [editData]);

  const saveAction = async () => {
    if (mode === 'Crear') {
      const res = await crearRol(data);
      if (res) {
        setRolesTotales((prevState) => [...prevState, res]);
        onOpenChange();
      } else {
        setError('Error al crear el rol');
      }
    }
    if (mode === 'Editar') {
      const res = await editarRol(data);
      const roles = rolesTotales.filter(
        (rol) => rol.NUMROLID !== data.NUMROLID
      );
      if (res) {
        setRolesTotales([...roles, res]);
        onOpenChange();
      } else {
        setError('Error al editar el rol');
      }
    }
    if (mode === 'Eliminar') {
      const res = await eliminarRol(data.NUMROLID);
      const roles = rolesTotales.filter(
        (rol) => rol.NUMROLID !== data.NUMROLID
      );
      if (res) {
        setRolesTotales(roles);
        onOpenChange();
      } else {
        setError('Error al eliminar el rol');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='font-bold'>{mode} Roles</h2>
            </ModalHeader>
            <ModalBody>
              {error && <p className='text-red-500'>{error}</p>}
              {mode === 'Crear' && (
                <Input
                  label='Ingrese un rol'
                  name='VCHNOMBRE'
                  variant='bordered'
                  onChange={handleCredentials}
                  isInvalid={!data.VCHNOMBRE}
                />
              )}
              {mode === 'Editar' && (
                <Input
                  label='Ingrese un rol'
                  name='VCHNOMBRE'
                  variant='bordered'
                  onChange={handleCredentials}
                  defaultValue={editData.VCHNOMBRE}
                  isInvalid={!data.VCHNOMBRE}
                />
              )}
              {mode === 'Eliminar' && <h1>Fomulario Eliminar ROL</h1>}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <Button color='primary' onPress={saveAction}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
