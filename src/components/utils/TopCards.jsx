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
      <Title title={'Estados'} />
      <div className='flex gap-4 p-4 flex-wrap'>
        {data.map((item) => (
          <div className='relative flex-1 w-52' key={item.id}>
            <Card className='flex flex-col justify-between items-center w-full p-4 rounded-xl'>
              <div className='flex flex-col items-center h-full'>
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
