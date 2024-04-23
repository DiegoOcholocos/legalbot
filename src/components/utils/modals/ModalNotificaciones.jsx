import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React from 'react';

export default function ModalNotificaciones({
  isOpen,
  onOpenChange,
  notificaciones,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Notificaciones
            </ModalHeader>
            <ModalBody>
              {notificaciones.length == 0 && (
                <p className='text-center m-4 font-bold'>
                  No Existen notificaciones
                </p>
              )}
              {notificaciones.map((notificacion) => (
                <Card
                  key={notificacion.id}
                  className='flex flex-col p-4'
                  shadow
                >
                  <p>Título : {notificacion.Titulo}</p>
                  <p className='text-sm text-gray-300'>
                    Anexos : {notificacion.Anexos}
                  </p>
                  <p className='text-sm text-gray-300'>
                    Destinatario : {notificacion.Destinatario}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Forma de Entrega {notificacion.FormaEntrega}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Resolución {notificacion.FechaResolucion}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Notificacion Impresa{' '}
                    {notificacion.FechaNotificacionImpresa}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Envio de Notificacion{' '}
                    {notificacion.FechaEnviadaCentralNotificacion}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Recepcion de Notificacion{' '}
                    {notificacion.FechaRecepcionadaCentralNotificacion}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Notificacion a Destinatario{' '}
                    {notificacion.FechaNotificacionDestinatario}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Fecha de Cargo Devuelto al Juzgado{' '}
                    {notificacion.FechaCargoDevueltoJuzgado}
                  </p>
                </Card>
              ))}
              <ModalFooter>
                <Button onClick={onClose} color='danger'>
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
