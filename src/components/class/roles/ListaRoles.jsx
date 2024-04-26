'use client';

import Title from '@/components/utils/system/Title';
import TablaRoles from './TablaRoles';
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import ModalRoles from '@/components/utils/modals/ModalRoles';
import { useState } from 'react';
import { IoAddCircle } from 'react-icons/io5';
import Acciones from '@/components/utils/system/Acciones';
import { IoMdSettings } from 'react-icons/io';

export default function ListaRoles({ roles }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mode, setMode] = useState('');
  const [rolesTotales, setRolesTotales] = useState(roles);
  const [editData, setEditData] = useState({});

  const activeModal = (mode, data) => {
    setMode(mode);
    setEditData(data);
    onOpen();
  };
  const items = [
    {
      name: 'Crear',
      icon: <IoAddCircle />,
      action: () => activeModal('Crear', {}),
    },
  ];
  return (
    <>
      <Title title='Roles'>
        <Acciones icon={<IoMdSettings />} items={items} />
      </Title>
      <div className='p-4'>
        <Card className='p-4 flex flex-col gap-4'>
          <h3>Cantidad de Roles : {roles.length}</h3>
          {roles.length ? (
            <TablaRoles roles={rolesTotales} activeModal={activeModal} />
          ) : (
            <div className='w-full flex justify-center items-center my-4 gap-2'>
              <h3 className='text-lg'>No hay roles creados</h3>
            </div>
          )}
        </Card>
      </div>

      <ModalRoles
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        mode={mode}
        editData={editData}
        setRolesTotales={setRolesTotales}
        rolesTotales={rolesTotales}
      />
    </>
  );
}
