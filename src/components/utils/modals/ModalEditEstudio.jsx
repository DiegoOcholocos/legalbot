'use client';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { editarEstudio } from '@/services/Prisma/Estudio';

export default function ModalEditEstudio({
  estudioData,
  openModal,
  setEditEstudio,
  fetchEstudios,
}) {
  const [values, setValues] = useState({
    NUMESTUDIOID: '',
    VCHNOMBRE: '',
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (openModal) {
      onOpen();
    }
    setValues(estudioData);
  }, [estudioData, openModal, onOpen]);

  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditButton = async () => {
    const res = await editarEstudio(values.NUMESTUDIOID, values.VCHNOMBRE);
    console.log(res);
    fetchEstudios();
    setEditEstudio(false);
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
              Editar Estudio
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label='Text'
                name='VCHNOMBRE'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={values.VCHNOMBRE}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                variant='flat'
                onPress={() => {
                  setEditEstudio(false);
                  onClose;
                }}
              >
                Cerrar
              </Button>
              <Button color='primary' onPress={() => handleEditButton()}>
                Editar estudio
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
