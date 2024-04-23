'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Acciones from '@/components/utils/system/Acciones';
import { FaEye } from 'react-icons/fa6';

export default function TablaExpedientes({ expedientesFilter }) {
  const router = useRouter();
  const detalleExpediente = (ExpedienteId) => {
    router.push(`/dashboard/expedientes/${ExpedienteId}`);
  };
  return (
    <Table
      removeWrapper
      color='default'
      selectionMode='single'
      defaultSelectedKeys={[]}
      className='overflow-x-auto overflow-y-hidden'
    >
      <TableHeader>
        <TableColumn align='center' className='text-center'>
          NO. EXPEDIENTE
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          SUMILLA
        </TableColumn>
        <TableColumn align='center' className='text-center w-10'>
          UBICACIÓN
        </TableColumn>
        <TableColumn align='center' className='text-center w-10'>
          ESTADO
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          JUZGADO
        </TableColumn>
        <TableColumn align='center' className='text-center'>
          RAZON SOCIAL
        </TableColumn>
        <TableColumn className='text-center w-20'>ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {expedientesFilter.map((expediente, index) => {
          const items = [
            {
              name: 'Detalle',
              action: () => {
                detalleExpediente(expediente.ExpedienteId);
              },
              icon: <FaEye />,
            },
          ];
          return (
            <TableRow key={expediente.ExpedienteId}>
              <TableCell className='text-center'>
                <p>{expediente.NumeroExpediente}</p>
              </TableCell>
              <TableCell>
                <p className='text-sm'>{expediente.Sumilla}</p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.Ubicacion}</p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.Estado}</p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>
                  {expediente.OrganoJurisdiccional}
                </p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.RazonSocial}</p>
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
