import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { FaRegCircleCheck } from 'react-icons/fa6';

export default function ModalCarteraAlerta({ isOpen, onOpen, onOpenChange }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='flex justify-center items-center'>
      <ModalContent className='text-center'>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <h2 className='font-bold'>Carga</h2>
            </ModalHeader>
            <ModalBody>
              <FaRegCircleCheck size={60} className='mx-auto mb-4 text-green-500' />
              <p>¡La carga de expedientes se realizó correctamente!</p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Cerrar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
