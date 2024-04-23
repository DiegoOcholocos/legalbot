'use client';
import Acciones from '@/components/utils/system/Acciones';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { formateoFecha } from '@/services/format';

export default function TablaRoles({ roles, activeModal }) {
  return (
    <Table
      removeWrapper
      color='default'
      selectionMode='single'
      defaultSelectedKeys={[]}
      className='overflow-x-auto overflow-y-hidden'
    >
      <TableHeader>
        <TableColumn className='text-center'>NOMBRE</TableColumn>
        <TableColumn className='text-center'>FECHA CREACIÓN</TableColumn>
        <TableColumn className='text-center'>FECHA ACTUALIZACION</TableColumn>
        <TableColumn className='text-center'>ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {roles.map((rol) => {
          const items = [
            {
              name: 'Editar',
              icon: <FaEdit />,
              action: () => activeModal('Editar', rol),
            },
            {
              name: 'Eliminar',
              icon: <MdDelete />,
              action: () => activeModal('Eliminar', rol),
            },
          ];
          return (
            <TableRow key={rol.NUMROLID}>
              <TableCell>
                <p className='text-center'>{rol.VCHNOMBRE}</p>
              </TableCell>
              <TableCell>
                <p className='text-center'>
                  {formateoFecha(rol.FECFECHACREACION)}
                </p>
              </TableCell>
              <TableCell>
                <p className='text-center'>
                  {formateoFecha(rol.FECFECHACTUALIZACION) || '-'}
                </p>
              </TableCell>
              <TableCell className='w-20 text-center'>
                <Acciones icon={<IoMdSettings />} items={items} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
