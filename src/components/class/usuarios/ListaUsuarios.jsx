'use client';
import { Button, Card, useDisclosure } from '@nextui-org/react';
import { useState, useMemo } from 'react';
import TablaUsuariosCognito from './TablaUsuariosCognito';
import Title from '@/components/utils/system/Title';
import ModalUser from '@/components/utils/modals/ModalUser';
import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';

export default function ListaUsuarios({ usuarios }) {
  const [users, setUsers] = useState(usuarios);
  const [editData, setEditData] = useState();
  const [modalMode, setModalMode] = useState('crear');

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(users.length / rowsPerPage);

  const usersList = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCreateUser = () => {
    setModalMode('crear');
    onOpenChange(!isOpen);
  };
  const fetchUsers = async () => {
    const users = await listarUsuarios();
    setUsers(users);
  };

  return (
    <>
      <Title title={'Lista de Usuarios'}>
        <Button onPress={() => handleCreateUser()} color='primary'>
          Crear usuario
        </Button>
      </Title>
      <div className='p-4'>
        <Card className='w-full md:col-span-2 relative flex flex-col gap-4 overflow-x-auto p-4'>
          <ModalUser
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            mode={modalMode}
            data={modalMode === 'crear' ? null : editData}
            fetchUsers={fetchUsers}
          />

          <h3> Usuarios totales: {users.length}</h3>

          <TablaUsuariosCognito
            usersList={usersList}
            page={page}
            pages={pages}
            setPage={setPage}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            fetchUsers={fetchUsers}
            setEditData={setEditData}
            setModalMode={setModalMode}
          />
        </Card>
      </div>
    </>
  );
}
