'use client';
import React from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import Acciones from '@/components/utils/system/Acciones';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

export default function TablaEstudios({ estudiosList, activeModal }) {
  return (
    <Table
      removeWrapper
      color='default'
      selectionMode='single'
      defaultSelectedKeys={[]}
      aria-label='Example static collection table'
    >
      <TableHeader>
        <TableColumn className='text-center'>ID</TableColumn>
        <TableColumn className='text-center'>Estudio</TableColumn>
        <TableColumn className='text-center w-20'>ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {estudiosList.map((estudio) => {
          const items = [
            {
              name: 'Editar',
              icon: <FaEdit />,
              action: () => activeModal('Editar', estudio),
            },
            {
              name: 'Eliminar',
              icon: <MdDelete />,
              action: () => activeModal('Eliminar', estudio),
            },
          ];
          return (
            <TableRow
              key={estudio.NUMESTUDIOID}
              className='hover:bg-gray-100 dark:hover:bg-[#0005]'
            >
              <TableCell className='text-center text-sm'>
                {estudio.NUMESTUDIOID}
              </TableCell>
              <TableCell className='text-center text-sm'>
                {estudio.VCHNOMBRE}
              </TableCell>
              <TableCell className='text-center text-sm'>
                <Acciones items={items} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
