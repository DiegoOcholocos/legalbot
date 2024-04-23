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
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  adminResetUserPassword,
  crearUsuario,
  editarUsuario,
} from '@/services/Aws/Cognito/Usuarios';
import { obtenerEstudios } from '@/services/Prisma/Estudio';
import { obtenerEstudiosExpedientes } from '@/services/Prisma/Expediente';
import { obtenerRoles } from '@/services/Prisma/Rol';

export default function ModalUser({
  isOpen,
  onOpenChange,
  mode,
  data,
  fetchUsers,
}) {
  const [credentials, setCredentials] = useState();

  const [estudios, setEstudios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [administradorSeleccionado, setAdministradorSeleccionado] =
    useState(false);
  const [externoSeleccionado, setExternoSeleccionado] = useState(false);

  useEffect(() => {
    if (!data) {
      setCredentials({
        email: '',
        usuario: '',
        password: '',
        estudio: 'Estudio no asignado',
        tipoUsuario: '',
        rol: 0,
      });
    } else {
      setCredentials({
        email: data.Attributes.find((attr) => attr.Name === 'email')?.Value,
        usuario: data.Username,
        password: '',
        estudio: data.Attributes.find((attr) => attr.Name === 'custom:estudio')
          ?.Value,
        tipoUsuario: data.Attributes.find(
          (attr) => attr.Name === 'custom:tipoUsuario'
        )?.Value,
        rol: data.Attributes.find((attr) => attr.Name === 'custom:rol')?.Value,
        usuarioId: data.Attributes.find(
          (attr) => attr.Name === 'custom:usuario_id'
        )?.Value,
        estudioId: data.Attributes.find(
          (attr) => attr.Name === 'custom:estudio_id'
        )?.Value,
      });
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const estudiosData = await obtenerEstudiosExpedientes();
      console.log(estudiosData);
      setEstudios(estudiosData);
      fetchEstudios();

      const roles = await obtenerRoles();
      setRoles(roles);
    };
    fetchData();
  }, []);

  const fetchEstudios = async () => {
    try {
      const estudios = await obtenerEstudios();
      const estudiosFormateados = estudios.map((e) => {
        return { Estudio: e.VCHNOMBRE, CodEstudio: e.NUMESTUDIOID };
      });
      setEstudios((prevState) => [...prevState, ...estudiosFormateados]);
    } catch (error) {
      console.error('Error fetching estudios:', error);
    }
  };

  const handleCredentials = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUserSelected = (userValue) => {
    if (userValue === 'Administrador') {
      setAdministradorSeleccionado(true);
    } else {
      setAdministradorSeleccionado(false);
    }
    if (userValue === 'usuario_externo') {
      setExternoSeleccionado(true);
    } else {
      setExternoSeleccionado(false);
    }
  };

  const handleSubmitBtn = async () => {
    console.log(credentials);
    try {
      if (mode === 'crear') {
        const res = await crearUsuario(credentials);
        if (res) {
          fetchUsers();
        }
      }
      if (mode === 'editar') {
        const res = await editarUsuario(credentials);
        if (res) {
          fetchUsers();
        }
      }
      if (mode === 'cambiarContra') {
        const res = await adminResetUserPassword(credentials);
        if (res) {
          fetchUsers();
        }
      }
      setCredentials({
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
              {mode === 'crear' && (
                <Input
                  autoFocus
                  label='Ingrese un email'
                  name='email'
                  variant='bordered'
                  onChange={handleCredentials}
                />
              )}
              {(mode === 'crear' || mode === 'editar') && (
                <Select
                  label='Elija un tipo de usuario'
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
              )}
              {(mode === 'crear' || mode === 'editar') && (
                <Select
                  label='Elija un rol'
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
              )}
              {(mode === 'crear' || mode === 'editar') && (
                <Select
                  label='Elija un estudio'
                  name='estudio'
                  variant='bordered'
                  onChange={handleCredentials}
                  isDisabled={administradorSeleccionado}
                >
                  {estudios.map((estudio) => (
                    <SelectItem key={estudio.Estudio} value={estudio.Estudio}>
                      {administradorSeleccionado ? '' : estudio.Estudio}
                    </SelectItem>
                  ))}
                </Select>
              )}
              {mode === 'crear' && (
                <Input
                  label='Ingrese un usuario'
                  name='usuario'
                  variant='bordered'
                  onChange={handleCredentials}
                  defaultValue={mode === 'editar' ? credentials.Username : ''}
                />
              )}
              {mode === 'cambiarContra' && (
                <Input
                  label='Ingrese un password'
                  name='password'
                  type='password'
                  variant='bordered'
                  onChange={handleCredentials}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                Cerrar
              </Button>
              <Button color='primary' onPress={() => handleSubmitBtn()}>
                {mode === 'crear'
                  ? 'Crear usuario'
                  : mode === 'editar'
                  ? 'Editar Usuario'
                  : 'Cambiar Contraseña'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
