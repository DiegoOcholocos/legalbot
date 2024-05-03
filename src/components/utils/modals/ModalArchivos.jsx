'use client';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from '@nextui-org/react';

import { descargarArchivo, listarArchivosCarpeta } from '@/services/Aws/S3/actions';
import { FaCloudDownloadAlt } from 'react-icons/fa';
export default function ModalArchivos({ Tarea }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [archivoObtenido, setArchivoObtenido] = useState(null);
  const empresa = process.env.CLIENTE;

  useEffect(() => {
    if (isOpen) {
      console.log(Tarea);
      console.log(Tarea.VCHARCHIVOS);
      const archivos = async () => {
        try {
          const archivo = await extraccionarchivosS3(Tarea.VCHARCHIVOS);
          setArchivoObtenido(archivo);
        } catch (error) {
          console.error('Error al obtener archivos:', error);
        }
      };
      archivos();
      console.log('Estos son los archivos obtenidos', archivoObtenido);
    }
  }, [!isOpen]);

  const handleDownloadFile = async (archivo) => {
    try {
      await descargarArchivo(archivo);
    } catch (error) {
      console.error('Error al descargar el archivo de S3:', error);
    }
  };

  const extraccionarchivosS3 = async (folder) => {
    try {
      const archivos = await listarArchivosCarpeta(`archivos/${empresa}/${folder}/`);
      return archivos;
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  return (
    <div>
      <Button
        className='text-xs p-0 justify-start bg-transparent w-max text-gray-500'
        onPress={onOpen}
      >
        ARCHIVOS ASOCIADOS
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-4'>ARCHIVOS ASOCIADOS</ModalHeader>
              <ModalBody>
                {archivoObtenido?.length == 0 && <p>No hay archivos asociados</p>}
                {archivoObtenido?.map((archivo) => (
                  <div
                    key={archivo.ETag}
                    className='w-full flex justify-between items-center hover:bg-gray-700 p-2 rounded-md'
                  >
                    <h3 className='text-sm font-semibold'>
                      {archivo.Key.split('/')[archivo.Key.split('/').length - 1]}
                    </h3>
                    <div className='flex gap-4'>
                      <Button
                        color='primary'
                        isIconOnly
                        onPress={() => handleDownloadFile(archivo.Key)}
                      >
                        <FaCloudDownloadAlt />
                      </Button>
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
