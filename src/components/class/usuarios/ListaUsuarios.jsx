'use client';
import { Card, useDisclosure } from '@nextui-org/react';
import { useState, useMemo } from 'react';
import TablaUsuariosCognito from './TablaUsuariosCognito';
import Title from '@/components/utils/system/Title';
import ModalUser from '@/components/utils/modals/ModalUser';
import { IoAddCircle } from 'react-icons/io5';
import Acciones from '@/components/utils/system/Acciones';
import { IoMdSettings } from 'react-icons/io';
import { obtenerUsuarios } from '@/services/Prisma/Usuario';

export default function ListaUsuarios({ usuariosData, rolesData, estudiosData }) {
  const [users, setUsers] = useState(usuariosData);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editData, setEditData] = useState();
  const [mode, setMode] = useState('');

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(users.length / rowsPerPage);
  const usersList = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  const fetchUsers = async () => {
    const users = await obtenerUsuarios();
    setUsers(users);
  };

  const activeModal = (mode, data) => {
    setMode(mode);
    setEditData(data);
    onOpen();
  };
  const items = [
    {
      name: 'crear',
      icon: <IoAddCircle />,
      action: () => activeModal('crear', null),
    },
  ];

  return (
    <>
      <Title title={'Lista de Usuarios'}>
        <Acciones icon={<IoMdSettings />} items={items} />
      </Title>
      <div className='p-4'>
        <Card className='w-full md:col-span-2 relative flex flex-col gap-4 overflow-x-auto p-4'>
          <h3> Usuarios totales: {users.length}</h3>

          <TablaUsuariosCognito
            page={page}
            pages={pages}
            setPage={setPage}
            usersList={usersList}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            setEditData={setEditData}
            setMode={setMode}
            fetchUsers={fetchUsers}
          />
        </Card>
      </div>

      <ModalUser
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mode={mode}
        editData={editData}
        setUsers={setUsers}
        usersList={usersList}
        roles={rolesData}
        estudios={estudiosData}
        fetchUsers={fetchUsers}
      />
    </>
  );
}
