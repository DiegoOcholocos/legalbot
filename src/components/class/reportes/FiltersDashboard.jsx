'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';
import {
  obntenerEspecialidadesExpedientes,
  obntenerEstadosExpedientes,
  obtenerDistritosJudicialesExpedientes,
} from '@/services/Prisma/Expediente';
const FiltersDashboard = ({ handleFilters, estudio }) => {
  const [distritos, setDistritos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedTextFilters, setSelectedTextFilters] = useState({});
  useEffect(() => {
    obtenerDistritosJudicialesExpedientes(selectedTextFilters, estudio).then(
      (res) => setDistritos(res.map((distrito) => distrito.DistritoJudicial))
    );
    obntenerEstadosExpedientes(selectedTextFilters, estudio).then((res) =>
      setEstados(res.map((distrito) => distrito.Estado))
    );
    obntenerEspecialidadesExpedientes(selectedTextFilters, estudio).then(
      (res) => setEspecialidades(res.map((distrito) => distrito.Especialidad))
    );
  }, [selectedTextFilters]);

  const onSelectionChange = (id, value) => {
    const selectedValue = value !== '' ? value : null;
    setSelectedFilters({ ...selectedFilters, [id]: selectedValue });
  };
  const handleFilterClick = () => {
    const selectedTextFilters = {
      distrito:
        selectedFilters.distrito !== null
          ? distritos[selectedFilters.distrito]
          : null,
      estado:
        selectedFilters.estado !== null
          ? estados[selectedFilters.estado]
          : null,
      especialidad:
        selectedFilters.especialidad !== null
          ? especialidades[selectedFilters.especialidad]
          : null,
    };
    setSelectedTextFilters(selectedTextFilters);
    handleFilters(selectedTextFilters);
  };

  return (
    <>
      <h3 className='text-md font-bold gap-4'>Buscar por Filtros</h3>
      <Autocomplete
        label='Seleccione un distrito judicial'
        onSelectionChange={(value) => onSelectionChange('distrito', value)}
        defaultSelectedKey={selectedTextFilters?.distrito}
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
        defaultSelectedKey={selectedTextFilters?.estado}
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
        defaultSelectedKey={selectedTextFilters?.especialidad}
      >
        {especialidades.map((especialidad, index) => (
          <AutocompleteItem key={index} value={index}>
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
