'use client';
import { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import {
  obntenerEspecialidadesExpedientes,
  obntenerEstadosExpedientes,
  obtenerDistritosJudicialesExpedientes,
} from '@/services/Prisma/Expediente';

const FiltersDashboard = ({ handleFilters, estudio, filtros }) => {
  const [distritos, setDistritos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  useEffect(() => {
    obtenerDistritosJudicialesExpedientes(filtros, estudio)
      .then((res) => setDistritos(res.map((distrito) => distrito.DistritoJudicial)))
      .catch((error) => console.error('Error fetching districts:', error));

    obntenerEstadosExpedientes(filtros, estudio)
      .then((res) => setEstados(res.map((estado) => estado.Estado)))
      .catch((error) => console.error('Error fetching states:', error));

    obntenerEspecialidadesExpedientes(filtros, estudio)
      .then((res) => setEspecialidades(res.map((especialidad) => especialidad.Especialidad)))
      .catch((error) => console.error('Error fetching specialties:', error));
  }, [filtros]);

  const onSelectionChange = (id, value) => {
    handleFilters({ ...filtros, [id]: value });
  };

  return (
    <>
      <h3 className='text-md font-bold gap-4'>Buscar por Filtros</h3>
      <div className='flex flex-col gap-0'>
        <label className='text-sm font-medium'>Seleccione un distrito judicial :</label>
        <Autocomplete onSelectionChange={(value) => onSelectionChange('distrito', value)}>
          {distritos.map(
            (distrito) =>
              distrito && (
                <AutocompleteItem key={distrito} value={distrito}>
                  {distrito}
                </AutocompleteItem>
              )
          )}
        </Autocomplete>
      </div>
      <div className='flex flex-col gap-0'>
        <label className='text-sm font-medium'>Seleccione un estado :</label>
        <Autocomplete onSelectionChange={(value) => onSelectionChange('estado', value)}>
          {estados.map(
            (estado) =>
              estado && (
                <AutocompleteItem key={estado} value={estado}>
                  {estado}
                </AutocompleteItem>
              )
          )}
        </Autocomplete>
      </div>
      <div className='flex flex-col gap-0'>
        <label className='text-sm font-medium'>Seleccione una especialidad :</label>
        <Autocomplete onSelectionChange={(value) => onSelectionChange('especialidad', value)}>
          {especialidades.map(
            (especialidad) =>
              especialidad && (
                <AutocompleteItem key={especialidad} value={especialidad}>
                  {especialidad}
                </AutocompleteItem>
              )
          )}
        </Autocomplete>
      </div>
    </>
  );
};

export default FiltersDashboard;
