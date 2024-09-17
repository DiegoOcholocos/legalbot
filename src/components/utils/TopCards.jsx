'use client';
import { Card, Chip } from '@nextui-org/react';
import Link from 'next/link';
import Title from './system/Title';
import { useRouter } from 'next/navigation';

const TopCards = ({ data }) => {
  const router = useRouter();
  const handleLocalStorage = (item) => {
    if (item) {
      localStorage.setItem('procesosTipo', JSON.stringify(item));
      return;
    }
    router.push('/dashboard/expedientes');
  };
  return (
    <>
      <Title title={'Pagina inicial'} />
      <div className='flex flex-wrap gap-4 p-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
        {data.map((item) => (
          <div
            className='flex flex-col items-center w-full px-4 py-2 md:max-w-1/2 lg:max-w-full'
            key={item.id}
          >
            <Card className='flex flex-col justify-between items-center w-full h-full p-4 rounded-xl'>
              <div className='flex flex-col items-center'>
                <div className='mb-2'>{item.nombre}</div>
                <div className='flex justify-center items-center h-10 w-10'>
                  <Link href={item.href}>
                    <Chip
                      color='primary'
                      onClick={() => handleLocalStorage(item.local)}
                      className='cursor-pointer w-auto'
                    >
                      {item.valor}
                    </Chip>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default TopCards;
