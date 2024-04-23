'use client';
import { useState } from 'react';
import { Card } from '@nextui-org/react';
import ModalNuevoFlujo from '@/components/utils/modals/ModalNuevoFlujo';
import Title from '@/components/utils/system/Title';
import TablaFlujos from './TablaFlujos';

const ListadoFlujos = ({ flujos, session }) => {
  const [totFlujos, setTotFlujos] = useState(flujos);
  return (
    <>
      <Title title='Flujos'>
        <ModalNuevoFlujo
          usersesion={session}
          setTotFlujos={setTotFlujos}
          totFlujos={totFlujos}
        />
      </Title>
      <div className=' w-full flex flex-col p-4 gap-4'>
        <Card className='flex-1 p-4 flex flex-col gap-4'>
          <h3 className='text-lg'>Flujos totales: {totFlujos.length}</h3>
          <TablaFlujos totFlujos={totFlujos} setTotFlujos={setTotFlujos} />
        </Card>
      </div>
    </>
  );
};

export default ListadoFlujos;
