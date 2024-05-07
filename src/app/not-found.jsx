"use client";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
export default function Example() {
  const router = useRouter();
  return (
    <>
      <main className='grid min-h-full place-items-center bg-black px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/2748/2748558.png'
            alt='Error Icon'
            className='mx-auto h-40 w-40'
          />
          <p className='text-base font-semibold text-indigo-300'>404</p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl'>
            Pagina no encontrada
          </h1>
          <p className='mt-6 text-base leading-7 text-gray-300'>
            La pagina a la que intentas ingresar no esta disponible parar tí
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button
              className='py-2 px-4 rounded-md'
              size='md'
              onPress={() => router.push(`/dashboard/`)}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
