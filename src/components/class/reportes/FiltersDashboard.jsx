'use client';
import { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import {
  obntenerEspecialidadesExpedientes,
  obntenerEstadosExpedientes,
  obtenerDistritosJudicialesExpedientes,
  buscarExpedientes,
} from '@/services/Prisma/Expediente';

const FiltersDashboard = ({ handleFilters }) => {
  const [distritos, setDistritos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');

  useEffect(() => {
    obtenerDistritosJudicialesExpedientes().then((res) =>
      setDistritos(res.map((distrito) => distrito.DistritoJudicial))
    );
    obntenerEstadosExpedientes().then((res) => setEstados(res.map((estado) => estado.Estado)));
    obntenerEspecialidadesExpedientes().then((res) =>
      setEspecialidades(res.map((especialidad) => especialidad.Especialidad))
    );
  }, []);

  const handleFilterClick = () => {
    const filters = {
      distrito: selectedDistrito,
      estado: selectedEstado,
      especialidad: selectedEspecialidad,
    };
    console.log('filtros seleccionados:      ', filters);
    handleFilters(filters);
  };

  return (
    <>
      <h3 className='text-md font-bold gap-4'>Buscar por Filtros</h3>
      <Autocomplete
        label='Seleccione un distrito judicial'
        onSelectionChange={(value) => setSelectedDistrito(value)}
        defaultSelectedKey={selectedDistrito}
      >
        {distritos.map((distrito, index) => (
          <AutocompleteItem key={index} value={distrito}>
            {distrito}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        label='Seleccione un estado'
        onSelectionChange={(value) => setSelectedEstado(value)}
        defaultSelectedKey={selectedEstado}
      >
        {estados.map((estado, index) => (
          <AutocompleteItem key={index} value={estado}>
            {estado}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        label='Seleccione una especialidad'
        onSelectionChange={(value) => setSelectedEspecialidad(value)}
        defaultSelectedKey={selectedEspecialidad}
      >
        {especialidades.map((especialidad, index) => (
          <AutocompleteItem key={index} value={especialidad}>
            {especialidad}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Button color='primary' onClick={handleFilterClick} className='w-full'>
        Filtrar
      </Button>
    </>
  );
};

export default FiltersDashboard;
