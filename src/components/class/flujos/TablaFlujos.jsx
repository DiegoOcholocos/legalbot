'use client';
import { useState } from 'react';
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@nextui-org/react';
import ModalEliminarFlujo from '@/components/utils/modals/ModalEliminarFlujo';
import { useRouter } from 'next/navigation';
import Acciones from '@/components/utils/system/Acciones';
import { FaEye } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { formateoFecha } from '@/services/format';

export default function TablaFlujos({ totFlujos, setTotFlujos }) {
  const router = useRouter();
  const handleFlujoClick = (flujoId) => {
    router.push(`/dashboard/flujos/${flujoId}`);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editData, setEditData] = useState({});
  const activeModal = (data) => {
    setEditData(data);
    onOpen();
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
          <TableColumn align='center' className='text-center uppercase'>
            Nombre Flujo
          </TableColumn>
          <TableColumn align='center' className='text-center uppercase'>
            Cantidad Expedientes
          </TableColumn>
          <TableColumn align='center' className='text-center uppercase'>
            Fecha creacion
          </TableColumn>
          <TableColumn align='center' className='text-center w-20 uppercase'>
            ACCIONES
          </TableColumn>
        </TableHeader>
        <TableBody className='text-center'>
          {totFlujos?.map((flujo) => {
            const items = [
              {
                name: 'Detalle',
                action: () => {
                  handleFlujoClick(flujo.NUMFLUJOID);
                },
                icon: <FaEye />,
              },
              {
                name: 'Eliminar',
                action: () => activeModal(flujo),
                icon: <MdDelete />,
              },
            ];
            return (
              <TableRow key={flujo.NUMFLUJOID}>
                <TableCell>
                  <p className='text-center uppercase'>{flujo.VCHNOMBRE}</p>
                </TableCell>
                <TableCell>
                  <p className='text-center uppercase'>10</p>
                </TableCell>
                <TableCell>
                  <p className='text-center uppercase'>
                    {formateoFecha(flujo.FECFECHACREACION)}
                  </p>
                </TableCell>
                <TableCell className='flex w-auto justify-center'>
                  <Acciones items={items} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ModalEliminarFlujo
        dataId={editData.NUMFLUJOID}
        setTotFlujos={setTotFlujos}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
