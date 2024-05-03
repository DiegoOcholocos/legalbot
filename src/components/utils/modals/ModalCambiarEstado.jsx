import { useState, useEffect } from "react";
import { cambiarEstado } from "@/services/Prisma/TareasExpediente";
import { estadosTareaExpediente } from "@/services/data";
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

export default function ModalCambiarEstado({ Tarea, onEstadoChange }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [estadoTarea, setEstadoTarea] = useState(Tarea.VCHESTADO);
  
    const handleEditButton = async () => {
        console.log("entrando a cambio de estado")
        const esPendiente = estadoTarea === estadosTareaExpediente.PENDIENTE || estadoTarea === "pendiente";
        const nuevoEstado = esPendiente ? estadosTareaExpediente.TERMINADO : estadosTareaExpediente.PENDIENTE;
    
        const res = await cambiarEstado(Tarea.NUMEXPEDTAREAID, nuevoEstado);
        console.log("Ya se cambio el estado")
            console.log("verifcando sets")
          setEstadoTarea(nuevoEstado);
          onEstadoChange(Tarea.NUMEXPEDTAREAID, nuevoEstado); 
          console.log("YA SE ACTUALIZARON DAOTS")
          onClose();

      };
  
    return (
      <div>
        <Button onPress={onOpen}>Cambiar Estado</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader className='flex flex-col gap-1'>Confirmar Cambio de Estado</ModalHeader>
            <ModalBody>
              ¿Seguro que quiere cambiar el estado de la tarea: {Tarea.TE_TAREA.VCHNOMBRE}?
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cerrar
              </Button>
              <Button color='primary' onPress={handleEditButton}>
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }