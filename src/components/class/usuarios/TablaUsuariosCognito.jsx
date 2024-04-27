'use client';
import React from 'react';
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  adminDisableUser,
  adminEnableUser,
} from '@/services/Aws/Cognito/Usuarios';
import Acciones from '@/components/utils/system/Acciones';

const TablaUsuariosCognito = ({
  page,
  pages,
  setPage,
  usersList,
  isOpen,
  onOpenChange,
  setEditData,
  setMode,
  fetchUsers
}) => {

  const handleEditUser = (user) => {
    setMode('editar');
    setEditData(user);
    onOpenChange(!isOpen);
  };

  const handleToggleEnable = async (user) => {
    const usrmail = user.Attributes.find((attr) => attr.Name === 'email').Value;
    if (user.Enabled) {
      await adminDisableUser(user.Username, usrmail);
    } else {
      await adminEnableUser(user.Username, usrmail);
    }
    fetchUsers();
  };
  
  const handleChangePassword = async (user) => {
    setMode('cambiarContra');
    setEditData(user);
    onOpenChange(!isOpen);
  };
  return (
    <Table
      removeWrapper
      color='default'
      selectionMode='single'
      defaultSelectedKeys={[]}
      bottomContent={
        <div className='flex w-full justify-center'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='primary'
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn align='center' className='text-center'>
          Email
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          Estado de la Cuenta
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          Tipo
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          Estudio
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          Estado
        </TableColumn>
        <TableColumn className='text-center w-20'>ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {usersList.map((user) => {
          const items = [
            {
              name: 'Editar',
              icon: '✏️',
              action: () => handleEditUser(user),
            },
            {
              name: user.Enabled ? 'Desactivar' : 'Activar',
              icon: user.Enabled ? '🗑️' : '✔️',
              action: () => handleToggleEnable(user),
            },
            {
              name: 'Cambiar contraseña',
              icon: '🔐',
              action: () => handleChangePassword(user),
            },
          ];
          return (
            <TableRow
              key={user.Username}
              className='hover:bg-gray-100 dark:hover:bg-[#0005]'
            >
              <TableCell className='text-center text-sm'>
                {user.Attributes.find((attr) => attr.Name === 'email').Value}
              </TableCell>
              <TableCell className='text-center text-sm'>
                {user.UserStatus === 'FORCE_CHANGE_PASSWORD'
                  ? 'Cambio de contraseña obligatorio'
                  : user.UserStatus === 'CONFIRMED'
                  ? 'Confirmado'
                  : 'Estado no reconocido'}
              </TableCell>
              <TableCell className='text-center text-sm'>
                {user.Attributes.find(
                  (attr) => attr.Name === 'custom:tipoUsuario'
                )
                  ?.Value.split('_')
                  .join(' ')}
              </TableCell>
              <TableCell className='text-center text-sm'>
                {user.Attributes.find((attr) => attr.Name === 'custom:estudio')
                  ?.Value || 'Estudio no asignado'}
              </TableCell>
              <TableCell className='text-center text-sm'>
                {user.Enabled ? 'Activo' : 'Desactivado'}
              </TableCell>
              <TableCell className='text-center text-sm'>
                <Acciones items={items} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TablaUsuariosCognito;
