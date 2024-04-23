import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
} from '@nextui-org/react';
import ModalEliminarTarea from '@/components/utils/modals/ModalEliminarTarea';
import ModalEditarTarea from '@/components/utils/modals/ModalEditarTarea';
import Acciones from '@/components/utils/system/Acciones';

export default function TablaTareas({ tareas, setTareas, usuarios, roles }) {
  const editar = useDisclosure();
  const eliminar = useDisclosure();
  const [tarea, setTarea] = useState(null);
  const activeModal = (tarea, mode) => {
    setTarea(tarea);
    mode === 'edit' ? editar.onOpenChange() : eliminar.onOpenChange();
  };
  return (
    <>
      <Table
        removeWrapper
        color='default'
        selectionMode='single'
        defaultSelectedKeys={[]}
      >
        <TableHeader className='text-center'>
          <TableColumn>Nombre Tarea</TableColumn>
          <TableColumn>Descripcion</TableColumn>
          <TableColumn>Duracion Dias</TableColumn>
          <TableColumn className='w-20 text-center'>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody className='text-center'>
          {tareas?.map((tarea) => {
            const items = [
              {
                name: 'Editar',
                action: () => activeModal(tarea, 'edit'),
              },
              {
                name: 'Eliminar',
                action: () => activeModal(tarea, 'delete'),
              },
            ];
            return (
              <TableRow key={tarea.NUMTAREAID}>
                <TableCell>{tarea.VCHNOMBRE}</TableCell>
                <TableCell>{tarea.VCHDESCRIPCION}</TableCell>
                <TableCell>{tarea.NUMDIASDURACION}</TableCell>
                <TableCell className='flex w-auto'>
                  <Acciones items={items} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {tarea && (
        <>
          <ModalEliminarTarea
            Tarea={tarea}
            updateTareas={() => {
              const updatedTareas = tareas.filter(
                (t) => t.NUMTAREAID !== tarea.NUMTAREAID
              );
              setTareas(updatedTareas);
            }}
            isOpen={eliminar.isOpen}
            onOpen={eliminar.onOpen}
            onOpenChange={eliminar.onOpenChange}
          />{' '}
          <ModalEditarTarea
            Tarea={tarea}
            totalUsuarios={usuarios}
            setTotalTarea={setTareas}
            totalRol={roles}
            isOpen={editar.isOpen}
            onOpen={editar.onOpen}
            onOpenChange={editar.onOpenChange}
          ></ModalEditarTarea>
        </>
      )}
    </>
  );
}
