import React from 'react';
import { Modal, Button } from '@nextui-org/react';

const ModalCarteraAlerta = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Carga completada</Modal.Header>
      <Modal.Content>
        <p>¡La carga de expedientes se realizó correctamente!</p>
      </Modal.Content>
      <Modal.Action passive onClick={onClose}>
        Cerrar
      </Modal.Action>
    </Modal>
  );
};

export default ModalCarteraAlerta;