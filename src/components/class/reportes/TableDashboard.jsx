'use client';
import React from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  CircularProgress,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  obtenerExpedientePageDash,
  obtenerCountExpedienteDash,
} from '@/services/Prisma/Expediente';

const ESTADOS_EX = {
  INCIAL: 'INICIAL',
  EN_PROCESO: 'EN PROCESO',
  FINALIZADO: 'FINALIZADO',
};

const TableDashboard = ({ filtros, estudio }) => {
  const [expedientesFilter, setExpedientesFilter] = useState([]);
  const [numPage, setNumPage] = useState(1);
  const [totalDatos, setTotalDatos] = useState(0);
  const rowsPerPage = 5;
  const [estadoExtraccion, setEstadoExtraccion] = useState(ESTADOS_EX.INCIAL);
  useEffect(() => {
    const fetchData = async () => {
      setEstadoExtraccion(ESTADOS_EX.EN_PROCESO);
      setExpedientesFilter([]);
      const count = await obtenerCountExpedienteDash(filtros, estudio);
      setTotalDatos(count);
      const expedientes = await obtenerExpedientePageDash(
        1,
        filtros,
        rowsPerPage,
        estudio
      );
      setExpedientesFilter(expedientes);
      setEstadoExtraccion(ESTADOS_EX.FINALIZADO);
    };
    fetchData();
  }, [filtros]);

  useEffect(() => {
    const fetchData = async () => {
      setEstadoExtraccion(ESTADOS_EX.EN_PROCESO);
      setExpedientesFilter([]);
      const expedientes = await obtenerExpedientePageDash(
        numPage,
        filtros,
        rowsPerPage,
        estudio
      );
      setExpedientesFilter(expedientes);
      setEstadoExtraccion(ESTADOS_EX.FINALIZADO);
    };
    fetchData();
  }, [numPage]);

  const totalPages = Math.ceil(totalDatos / rowsPerPage);

  return (
    <Card className='md:col-span-2 relative h-full p-4 w-full overflow-x-auto'>
      <div className='flex w-full justify-between py-2'>
        Total de Expedientes : {totalDatos}
      </div>
      <Table
        removeWrapper
        bottomContent={
          <>
            {estadoExtraccion === ESTADOS_EX.EN_PROCESO ? (
              <>
                <div className='flex w-full justify-center'>
                  <CircularProgress size='large' />
                </div>
                <div className='flex w-full justify-center'>
                  <Pagination
                    isCompact
                    showShadow
                    initialPage={1}
                    color='primary'
                    page={numPage}
                    total={totalPages}
                    onChange={(numPage) => setNumPage(numPage)}
                  />
                </div>
              </>
            ) : estadoExtraccion === ESTADOS_EX.FINALIZADO &&
              expedientesFilter.length === 0 ? (
              <div className='flex w-full justify-center'>
                <p>No se encontraron expedientes</p>
              </div>
            ) : (
              <div className='flex w-full justify-center'>
                <Pagination
                  isCompact
                  showShadow
                  initialPage={1}
                  color='primary'
                  page={numPage}
                  total={totalPages}
                  onChange={(numPage) => setNumPage(numPage)}
                />
              </div>
            )}
          </>
        }
      >
        <TableHeader>
          <TableColumn align='center' className='text-center'>
            NO. EXPEDIENTE
          </TableColumn>
          <TableColumn align='center' className='text-center'>
            DISTRITO JUDICIAL
          </TableColumn>
          <TableColumn align='center' className='text-center'>
            PROCESO
          </TableColumn>
          <TableColumn align='center' className='text-center'>
            ESTADO
          </TableColumn>
          <TableColumn align='center' className='text-center'>
            ESPECIALIDAD
          </TableColumn>
        </TableHeader>
        <TableBody>
          {expedientesFilter.map((expediente) => (
            <TableRow
              key={expediente.NumeroExpediente}
              className='hover:bg-gray-100 dark:hover:bg-[#0005]'
            >
              <TableCell>
                <p className='text-center text-sm'>
                  {expediente.NumeroExpediente}
                </p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>
                  {expediente.DistritoJudicial}
                </p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.Proceso}</p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.Estado}</p>
              </TableCell>
              <TableCell>
                <p className='text-center text-sm'>{expediente.Especialidad}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TableDashboard;
