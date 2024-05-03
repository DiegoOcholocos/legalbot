'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  adminResetUserPassword,
  crearUsuario,
  editarUsuario,
} from '@/services/Aws/Cognito/Usuarios';

export default function ModalUser({
  isOpen,
  onOpenChange,
  mode,
  editData,
  setUsers,
  usersList,
  roles,
  estudios,
  fetchUsers
}) {
  const router = useRouter();
  const [data, setData] = useState({});
  const [adminSeleccionado, setAdminSeleccionado] = useState(false)
  const [emailValid, setEmailValid] = useState(true);
  const [externoSeleccionado, setExternoSeleccionado] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    console.log(editData);
    if (!editData) {
      setData({
        email: '',
        usuario: '',
        password: '',
        estudio: 'Estudio no asignado',
        tipoUsuario: '',
        rol: 0,
        usuarioId: '',
        estudioId: '',
      });
    } else {
      setData({
        email: editData.Attributes.find((attr) => attr.Name === 'email')?.Value,
        usuario: editData.Username,
        password: '',
        estudio: editData.Attributes.find((attr) => attr.Name === 'custom:estudio')
          ?.Value,
        tipoUsuario: editData.Attributes.find(
          (attr) => attr.Name === 'custom:tipoUsuario'
        )?.Value,
        rol: editData.Attributes.find((attr) => attr.Name === 'custom:rol')?.Value,
        usuarioId: editData.Attributes.find(
          (attr) => attr.Name === 'custom:usuario_id'
        )?.Value,
        estudioId: editData.Attributes.find(
          (attr) => attr.Name === 'custom:estudio_id'
        )?.Value,
      });
    }
  }, [editData]);

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    if (name === 'email') {
      setEmailValid(validarEmail(value));
    }
  };

  const handleUserSelected = (userValue) => {
    if (userValue === 'Administrador') {
      setAdminSeleccionado(true);
    } else {
      setAdminSeleccionado(false);
    }
    if (userValue === 'usuario_externo') {
      setExternoSeleccionado(true);
    } else {
      setExternoSeleccionado(false);
    }
  };

  const handleSubmitBtn = async () => {
    console.log(data);
    try {
      if (mode === 'crear') {
        if (!data.email || !data.usuario || !data.tipoUsuario || !data.rol || (data.tipoUsuario !== 'Administrador' && !data.estudio)) {
          setShowWarning(true);
          return;
        }
        const res = await crearUsuario(data);
        if (res) {
          fetchUsers();
        }
      }
      if (mode === 'editar') {
        const res = await editarUsuario(data);
        if (res) {
          fetchUsers();
        }
      }
      if (mode === 'cambiarContra') {
        const res = await adminResetUserPassword(data);
        if (res) {
          fetchUsers();
        }
      }
      setData({
        email: '',
        usuario: '',
        password: '',
        estudio: 'Estudio no asignado',
        tipoUsuario: '',
        rol: 0,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    onOpenChange(!isOpen);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {mode === 'crear'
                ? 'Datos del usuario'
                : mode === 'editar'
                ? 'Editar Usuario'
                : 'Cambiar Contraseña'}
            </ModalHeader>
            <ModalBody>
            {estudios.length === 0 && (
              <div className='flex flex-col justify-center items-center gap-4 w-full'>
                <p>Para crear un usuario es necesario tener al menos un estudio disponible para seleccionar.</p>
                <Button color='primary' onPress={() => router.push('/dashboard/estudios')}>
                  Agregar Usuarios
                </Button>
              </div>
            )}
            {roles.length === 0 && (
              <div className='flex flex-col justify-center items-center gap-4 w-full'>
                <p>Para crear un usuario es necesario tener al menos un rol disponible para seleccionar.</p>
                <Button color='primary' onPress={() => router.push('/dashboard/roles')}>
                  Agregar Roles
                </Button>
              </div>
            )}
            {roles.length > 0 && estudios.length > 0 && (
                <>
                {showWarning && (
                 <p className='text-red-500'>Por favor, rellene todos los campos obligatorios. (*)</p>
            )}
             {mode === 'crear' && (
                <Input
                  autoFocus
                  label='Ingrese un email (*)'
                  name='email'
                  variant='bordered'
                  onChange={handleCredentials}
                  status={!emailValid && 'error'}
                />

              )}
              {!emailValid && (
              <p className='text-red-500'>Ingrese un email válido.</p>
                )}
              {(mode === 'crear' || mode === 'editar') && (
                <>
                  <Select
                    label='Elija un tipo de usuario (*)'
                    name='tipoUsuario'
                    variant='bordered'
                    onChange={handleCredentials}
                  >
                    <SelectItem
                      key='Administrador'
                      value='Administrador'
                      onClick={() => handleUserSelected('Administrador')}
                    >
                      Administrador
                    </SelectItem>
                    <SelectItem
                      key='usuario_interno'
                      value='usuario_interno'
                      onClick={() => handleUserSelected('usuario_interno')}
                    >
                      Usuario interno
                    </SelectItem>
                    <SelectItem
                      key='usuario_externo'
                      value='usuario_externo'
                      onClick={() => handleUserSelected('usuario_externo')}
                    >
                      Usuario externo
                    </SelectItem>
                  </Select>
                  <Select
                    label='Elija un rol (*)'
                    name='rol'
                    variant='bordered'
                    onChange={handleCredentials}
                  >
                    {roles.map((rol) => (
                      <SelectItem key={rol.NUMROLID} value={rol.VCHNOMBRE}>
                        {rol.VCHNOMBRE}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label='Elija un estudio (*)'
                    name='estudio'
                    variant='bordered'
                    onChange={handleCredentials}
                    isDisabled={adminSeleccionado}
                  >
                    {estudios.map((estudio) => (
                      <SelectItem key={estudio.Estudio} value={estudio.Estudio}>
                        {adminSeleccionado ? '' : estudio.Estudio}
                      </SelectItem>
                    ))}
                  </Select>
                </>
              )}
              {mode === 'crear' && (
                <Input
                  label='Ingrese un usuario (*)'
                  name='usuario'
                  variant='bordered'
                  onChange={handleCredentials}
                  defaultValue={mode === 'editar' ? credentials.Username : ''}
                />
              )}
              {mode === 'cambiarContra' && (
                <Input
                  label='Ingrese un password (*)'
                  name='password'
                  type='password'
                  variant='bordered'
                  onChange={handleCredentials}
                />
              )}
            </>
            )}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                Cerrar
              </Button>
              {roles.length > 0 && estudios.length > 0 && (
              <Button color='primary' onPress={() => handleSubmitBtn()}>
                {mode === 'crear'
                  ? 'Crear usuario'
                  : mode === 'editar'
                  ? 'Editar Usuario'
                  : 'Cambiar Contraseña'}
              </Button>
                )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
