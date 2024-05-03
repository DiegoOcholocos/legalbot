"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import AWS from "aws-sdk";
import {
  editarActividad,
  obtenerActividad,
  obtenerActividadesPorFlujo,
} from "@/services/Prisma/Actividad";
export default function ModalArchivos({ Tarea }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [archivoObtenido, setArchivoObtenido] = useState([]);
  const s3 = new AWS.S3({
    region: "us-east-1",
    accessKeyId: "AKIAVNIGRL6VQALTCM77",
    secretAccessKey: "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",
  });

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
          console.error("Error al obtener archivos:", error);
        }
      };
      archivos();
      console.log("Estos son los archivos obtenidos", archivoObtenido);
    }
  }, [!isOpen]);

  const handleDownloadFile = async (archivo) => {
    const params = {
      Bucket: "expedientespjvf",
      Key: `${archivo}`, // Utiliza el nombre del archivo como Key para descargarlo
    };
    try {
      const data = await s3.getObject(params).promise();
      const url = URL.createObjectURL(new Blob([data.Body]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", archivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo de S3:", error);
    }
  };

  const extraccionarchivosS3 = async (folder) => {
    try {
      const params = {
        Bucket: "expedientespjvf",
        Prefix: `archivos/${empresa}/${folder}/`,
      };

      console.log(params);
      s3.listObjectsV2(params, function (err, data) {
        if (err) {
          console.log("Error al listar objetos: ", err);
        } else {
          setArchivoObtenido(data.Contents);
        }
      });
    } catch (error) {
      console.log("Error : ", error);
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
                {archivoObtenido?.map((archivo) => (
                  <div
                    key={archivo.ETag}
                    className='w-full flex justify-between items-center hover:bg-gray-700 p-2 rounded-md'
                  >
                    <h3 className='text-sm font-semibold'>
                      {archivo.Key.split("/")[archivo.Key.split("/").length - 1]}
                    </h3>
                    <div className='flex gap-4'>
                      <Button
                        color='primary'
                        isIconOnly
                        onPress={() => handleDownloadFile(archivo.Key)}
                      >
                        Descargar
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
