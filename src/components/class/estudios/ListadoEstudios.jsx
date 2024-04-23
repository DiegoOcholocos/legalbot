'use client';
import React from 'react';
import { Card, Pagination } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalEditEstudio from '@/components/utils/modals/ModalEditEstudio';
import ModalCreateEstudio from '@/components/utils/modals/ModalCreateEstudio';
import Title from '@/components/utils/system/Title';
import TablaEstudios from './TablaEstudios';

const ListadoEstudios = ({ listaEstudios }) => {
  const [estudios, setEstudios] = useState(listaEstudios);
  const router = useRouter();
  const [editEstudio, setEditEstudio] = useState(false);
  const [estudioData, setEstudioData] = useState();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(estudios.length / rowsPerPage);

  const estudiosList = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return estudios.slice(start, end);
  }, [page, estudios]);

  const handleEditEstudio = (estudio) => {
    setEstudioData(estudio);
    setEditEstudio(true);
  };

  return (
    <>
      <Title title='Estudios'>
        <ModalCreateEstudio setEstudios={setEstudios} estudios={estudios} />
      </Title>
      <div className='flex-1 p-4 flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4'>
          <Card className='w-full md:col-span-2 relative p-4 pb-4 flex flex-col gap-4 overflow-x-auto'>
            {editEstudio && (
              <ModalEditEstudio
                estudioData={estudioData}
                openModal={editEstudio}
                setEditEstudio={setEditEstudio}
              />
            )}

            <h3 className='text-lg'>Estudios totales: {estudios.length}</h3>

            <TablaEstudios
              estudiosList={estudiosList}
              handleEditEstudio={handleEditEstudio}
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default ListadoEstudios;
