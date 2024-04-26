'use client';
import {
  Button,
  Card,
  Pagination,
  CircularProgress,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  obtenerExpedientePage,
  obtenerCountExpediente,
} from '@/services/Prisma/Expediente';
import ButtonExcel from '../../utils/ButtonExcel';
import Title from '../../utils/system/Title';
import TablaExpedientes from '@/components/class/expedientes/TablaExpedientes';

const ESTADOS_EX = {
  INCIAL: 'INICIAL',
  EN_PROCESO: 'EN PROCESO',
  FINALIZADO: 'FINALIZADO',
};
const ListadoExpedientes = ({ estudio }) => {
  const [expedientesFilter, setExpedientesFilter] = useState([]);
  const [numPage, setNumPage] = useState(1);
  const [totalDatos, setTotalDatos] = useState(0);
  const [searchTerm, setSearchTerm] = useState({
    term: '',
    tipo: JSON.parse(localStorage.getItem('procesosTipo')) || 'Todos',
  });
  const [estadoExtraccion, setEstadoExtraccion] = useState(ESTADOS_EX.INCIAL);
  useEffect(() => {
    const fetchData = async () => {
      setEstadoExtraccion(ESTADOS_EX.EN_PROCESO);
      setExpedientesFilter([]);
      const count = await obtenerCountExpediente(searchTerm, estudio);
      setTotalDatos(count);
      const expedientes = await obtenerExpedientePage(
        1,
        searchTerm,
        10,
        estudio
      );
      setExpedientesFilter(expedientes);
      setEstadoExtraccion(ESTADOS_EX.FINALIZADO);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setEstadoExtraccion(ESTADOS_EX.EN_PROCESO);
      setExpedientesFilter([]);
      const expedientes = await obtenerExpedientePage(
        numPage,
        searchTerm,
        10,
        estudio
      );
      setExpedientesFilter(expedientes);
      setEstadoExtraccion(ESTADOS_EX.FINALIZADO);
    };
    fetchData();
  }, [numPage]);
  const filtrarExpedientes = async () => {
    setEstadoExtraccion(ESTADOS_EX.EN_PROCESO);
    setExpedientesFilter([]);
    const count = await obtenerCountExpediente(searchTerm, estudio);
    setTotalDatos(count);
    const expedientes = await obtenerExpedientePage(1, searchTerm, 10, estudio);
    setExpedientesFilter(expedientes);
    setEstadoExtraccion(ESTADOS_EX.FINALIZADO);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prevState) => ({ ...prevState, [name]: value }));
    if (name === 'tipo') {
      localStorage.setItem('procesosTipo', JSON.stringify(value));
    }
  };

  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalDatos / rowsPerPage);

  return (
    <>
      <Title title='Expedientes' />
      <Card className='p-4 flex flex-col m-4'>
        <h3 className='font-semibold mb-4'>
          Filtros de los expedientes : {totalDatos}
        </h3>
        <div className='flex flex-col lg:flex-row gap-2 h-auto items-center justify-center'>
          <div className='flex flex-1 items-center gap-2'>
            <Input
              type='text'
              id='filterName'
              label='Buscar'
              className='rounded-lg h-full'
              name='term'
              size='sm'
              value={searchTerm.term}
              onChange={handleOnChange}
            />
            <Select
              label='Tipo de procesos'
              name='tipo'
              size='sm'
              className='w-52 rounded-lg'
              onChange={handleOnChange}
            >
              <SelectItem key='Todos' value='Todos'>
                Todos
              </SelectItem>
              <SelectItem key='Activos' value='Activos'>
                Activos
              </SelectItem>
              <SelectItem key='Inactivos' value='Inactivos'>
                Inactivos
              </SelectItem>
            </Select>
          </div>
          <div className='flex gap-2 h-full items-center justify-center'>
            <Button
              className='py-2 px-4 rounded-md '
              size='md'
              onPress={() => filtrarExpedientes()}
            >
              🔍 Buscar
            </Button>
            <ButtonExcel
              filter={searchTerm}
              pages={totalDatos}
              estudio={estudio}
            />
          </div>
        </div>
      </Card>
      <Card className='p-4 flex-1 m-4 flex flex-col gap-4'>
        <h3 className='font-semibold'>Total de Expedientes : {totalDatos}</h3>
        <TablaExpedientes expedientesFilter={expedientesFilter} />
        {
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
              <Pagination
                className='flex w-full justify-center -z-0 '
                isCompact
                showShadow
                initialPage={1}
                color='primary'
                page={numPage}
                total={totalPages}
                onChange={(numPage) => setNumPage(numPage)}
              />
            )}
          </>
        }
      </Card>
    </>
  );
};

export default ListadoExpedientes;
