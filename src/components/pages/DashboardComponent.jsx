'use client';
import { useEffect } from 'react';
import { Card } from '@nextui-org/react';
import TableDashboard from '../class/reportes/TableDashboard';
import { useState } from 'react';
import FiltersDashboard from '../class/reportes/FiltersDashboard';
import BarDashboard from '../class/reportes/BarDashboard';
import {
  calcularSumaCuantiaPorEstado,
  obtenerConteoPorEstado,
  obtenerConteoPorEstudio,
} from '@/services/Prisma/Expediente';
import { listarUsuarios } from '@/services/Aws/Cognito/Usuarios';

export default function DashboardComponent({ estudio }) {
  const [filtros, setFiltros] = useState(undefined);
  const [estados, setEstados] = useState({});
  const [cuantia, setCuantia] = useState({});
  const [estudios, setEstudios] = useState({});
  const [usuarios, setUsuarios] = useState({});
  const handleFilters = (filters) => {
    setFiltros(filters);
  };
  useEffect(() => {
    const fecth = async () => {
      const dataEstados = await obtenerConteoPorEstado(filtros, estudio);
      const labelsEstados = dataEstados.map((item) => item.Estado);
      const valuesEstados = dataEstados.map((item) => item._count);
      const dataCuantia = await calcularSumaCuantiaPorEstado(filtros, estudio);
      const labelsCuantia = dataCuantia.map((item) => item.Estado);
      const valuesCuantia = dataCuantia.map((item) => item._sum.Cuantia);
      const data = await obtenerConteoPorEstudio(filtros, estudio);
      const labels = data.map((item) => item.Estudio);
      const values = data.map((item) => item._count);
      const dataUsuarios = await listarUsuarios();
      const valuesUsuarios = labels.map((item) => {
        return dataUsuarios.filter(
          (user) => user.Attributes[1].Value === item && user.Attributes[3].Value != 'Administrador'
        ).length;
      });
      setEstados({ labelsEstados, valuesEstados });
      setCuantia({ labelsCuantia, valuesCuantia });
      setEstudios({ labels, values });
      setUsuarios({ labels, valuesUsuarios });
    };
    fecth();
  }, [filtros]);
  console.log(estados);
  return (
    <div className='flex-1 p-4 flex flex-col gap-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='col-span-1 order-1 items-center p-4 flex flex-col gap-4 justify-center'>
          <FiltersDashboard handleFilters={handleFilters} estudio={estudio} />
        </Card>
        <Card className='col-span-1 order-2 md:col-span-3'>
          <TableDashboard filtros={filtros} estudio={estudio} />
        </Card>
        <Card className='col-span-1 md:col-span-2 order-3 flex-1 w-full h-[40vh]'>
          <BarDashboard
            values={estados.valuesEstados}
            labels={estados.labelsEstados}
            title={'Procesos por etapa'}
            descripcion={'Indicar la cantidad de procesos que se encuentran en cada etapa'}
          />
        </Card>
        <Card className='col-span-1 md:col-span-2 order-4 flex-1 w-full h-[40vh]'>
          <BarDashboard
            values={cuantia.valuesCuantia}
            labels={cuantia.labelsCuantia}
            title={'Procesos por etapa'}
            descripcion={'Indicar la cantidad de procesos que se encuentran en cada etapa'}
          />
        </Card>
        {estudio == 'Administrador' && (
          <>
            <Card className='col-span-1 md:col-span-4 order-5 flex-1 w-full h-[40vh]'>
              <BarDashboard
                values={estudios.values}
                labels={estudios.labels}
                title={'Procesos por etapa'}
                descripcion={'Indicar la cantidad de procesos que se encuentran en cada etapa'}
                tipo={'x'}
              />
            </Card>
            <Card className='col-span-1 md:col-span-4 order-6 flex-1 w-full h-[40vh]'>
              <BarDashboard
                values={usuarios.valuesUsuarios}
                labels={usuarios.labels}
                title={'Procesos por etapa'}
                descripcion={'Indicar la cantidad de procesos que se encuentran en cada etapa'}
                tipo={'x'}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
