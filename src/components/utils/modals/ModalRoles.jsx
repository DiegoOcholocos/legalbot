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
  const [isValid, setIsValid] = useState(true);
  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    setIsValid(true);
  };

  useEffect(() => {
    setData(editData);
    setError('');
  }, [editData]);

  const saveAction = async () => {
    if (!data.VCHNOMBRE) { 
      setIsValid(false);
      return;
    }
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
                  isInvalid={!isValid}
                />
              )}
              {mode === 'Editar' && (
                <Input
                  label='Ingrese un rol'
                  name='VCHNOMBRE'
                  variant='bordered'
                  onChange={handleCredentials}
                  defaultValue={editData.VCHNOMBRE}
                  isInvalid={!isValid}
                />
              )}
              {mode === 'Eliminar' && <h1>Desea eliminar el rol {editData.VCHNOMBRE}?</h1>}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cerrar
              </Button>
              <Button color='primary' onPress={saveAction}>
                {mode === 'Crear' && <h1>Crear</h1>}
                {mode === 'Editar' && <h1>Editar</h1>}
                {mode === 'Eliminar' && <h1>Aceptar</h1>}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
