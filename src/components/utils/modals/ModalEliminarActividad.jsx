'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import {
  eliminarActividad,
  obtenerActividad,
  obtenerActividadesPorFlujo,
} from '@/services/Prisma/Actividad';

export default function ModalEliminarActividad({
  actividad,
  totActividades,
  setTotActividades,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const handledeleteButton = async () => {
    const res = await eliminarActividad(actividad.NUMACTIVIDADID);
    const actividades = await obtenerActividadesPorFlujo(actividad.NUMFLUJOID);
    setTotActividades(actividades);
    onOpenChange(!isOpen);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => onOpenChange(!isOpen)}
        placement='top-center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Eliminar Actividad
              </ModalHeader>
              <ModalBody>¿Esta seguro de eliminar la actividad?</ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color='danger'
                  onPress={() => {
                    handledeleteButton();
                  }}
                >
                  Eliminar Actividad
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
