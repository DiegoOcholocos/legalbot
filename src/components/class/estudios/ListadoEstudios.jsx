'use client';
import React from 'react';
import { Card, Pagination, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import Title from '@/components/utils/system/Title';
import TablaEstudios from './TablaEstudios';
import ModalEstudios from '@/components/utils/modals/ModalEstudios';
import Acciones from '@/components/utils/system/Acciones';
import { IoAddCircle } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';

const ListadoEstudios = ({ listaEstudios }) => {
  const [estudios, setEstudios] = useState(listaEstudios);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mode, setMode] = useState('');
  const [editData, setEditData] = useState({});
  
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(estudios.length / rowsPerPage);
  const estudiosList = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return estudios.slice(start, end);
  }, [page, estudios]);

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
      <Title title='Estudios'>
        <Acciones icon={<IoMdSettings />} items={items} />
      </Title>
      <div className='flex-1 p-4 flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4'>
          <Card className='w-full md:col-span-2 relative p-4 pb-4 flex flex-col gap-4 overflow-x-auto'>
            <h3 className='text-lg'>Estudios totales: {estudios.length}</h3>
            {estudiosList.length ? (
              <>
                <TablaEstudios
                  estudiosList={estudiosList}
                  activeModal={activeModal}
                />
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
              </>
            ) : (
              <div className='w-full flex justify-center items-center my-4 gap-2'>
                <h3 className='text-lg'>No hay estudios creados</h3>
              </div>
            )}
          </Card>
        </div>
      </div>

      <ModalEstudios
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        mode={mode}
        editData={editData}
        setEstudios={setEstudios}
        estudios={estudiosList}
      />
    </>
  );
};

export default ListadoEstudios;
