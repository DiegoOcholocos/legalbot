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
import { eliminarTarea } from '@/services/Prisma/Tarea';

export default function ModalEliminarTarea({
  Tarea,
  updateTareas,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const handledeleteButton = async () => {
    await eliminarTarea(Tarea.NUMTAREAID);
    // Llama a la función de actualización después de eliminar la tarea
    updateTareas();
  };

  return (
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
            <ModalBody>¿Está seguro de eliminar la Tarea?</ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  handledeleteButton();
                  onClose();
                }}
              >
                Eliminar Tarea
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
