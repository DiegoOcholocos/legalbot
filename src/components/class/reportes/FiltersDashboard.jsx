'use client';
import { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import {
  obntenerEspecialidadesExpedientes,
  obntenerEstadosExpedientes,
  obtenerDistritosJudicialesExpedientes,
} from '@/services/Prisma/Expediente';
import { GrPowerReset } from 'react-icons/gr';

const FiltersDashboard = ({ handleFilters, estudio }) => {
  const [distritos, setDistritos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    distrito: null,
    estado: null,
    especialidad: null,
  });

  useEffect(() => {
    obtenerDistritosJudicialesExpedientes({}, estudio)
      .then((res) => setDistritos(res.map((distrito) => distrito.DistritoJudicial)))
      .catch((error) => console.error('Error fetching districts:', error));

    obntenerEstadosExpedientes({}, estudio)
      .then((res) => setEstados(res.map((estado) => estado.Estado)))
      .catch((error) => console.error('Error fetching states:', error));

    obntenerEspecialidadesExpedientes({}, estudio)
      .then((res) => setEspecialidades(res.map((especialidad) => especialidad.Especialidad)))
      .catch((error) => console.error('Error fetching specialties:', error));
  }, [estudio]); // Make sure to include estudio in the dependency array

  const onSelectionChange = (id, value) => {
    setSelectedFilters({ ...selectedFilters, [id]: value });
  };

  const handleFilterClick = () => {
    const selectedTextFilters = {
      distrito: selectedFilters.distrito !== null ? distritos[selectedFilters.distrito] : null,
      estado: selectedFilters.estado !== null ? estados[selectedFilters.estado] : null,
      especialidad:
        selectedFilters.especialidad !== null ? especialidades[selectedFilters.especialidad] : null,
    };
    handleFilters(selectedTextFilters);
  };

  const handleReset = () => {
    setSelectedFilters({
      distrito: null,
      estado: null,
      especialidad: null,
    });
    handleFilters({});
  };

  return (
    <>
      <h3 className='text-md font-bold gap-4'>Buscar por Filtros</h3>
      <Autocomplete
        label='Seleccione un distrito judicial'
        onSelectionChange={(value) => onSelectionChange('distrito', value)}
        defaultSelectedKey={selectedFilters.distrito !== null ? selectedFilters.distrito : -1}
      >
        {distritos.map((distrito, index) => (
          <AutocompleteItem key={index} value={index}>
            {distrito}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        label='Seleccione un estado'
        onSelectionChange={(value) => onSelectionChange('estado', value)}
        defaultSelectedKey={selectedFilters.estado !== null ? selectedFilters.estado : -1}
      >
        {estados.map((estado, index) => (
          <AutocompleteItem key={index} value={index}>
            {estado}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Autocomplete
        label='Seleccione una especialidad'
        onSelectionChange={(value) => onSelectionChange('especialidad', value)}
        defaultSelectedKey={
          selectedFilters.especialidad !== null ? selectedFilters.especialidad : -1
        }
      >
        {especialidades.map((especialidad, index) => (
          <AutocompleteItem key={index} value={index}>
            {especialidad}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className='flex justify-between mt-4'>
        <Button color='primary' onClick={handleFilterClick} className='w-2/5'>
          Filtrar
        </Button>
        <Button color='error' onClick={handleReset} className='w-2/5'>
          <GrPowerReset />
        </Button>
      </div>
    </>
  );
};

export default FiltersDashboard;
