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

export default function DashboardComponent({ estudio, usuariosTotales }) {
  const [filtros, setFiltros] = useState({
    distrito: null,
    estado: null,
    especialidad: null,
  });
  const [estados, setEstados] = useState({});
  const [cuantia, setCuantia] = useState({});
  const [estudios, setEstudios] = useState({});
  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    const fecth = async () => {
      const dataEstados = await obtenerConteoPorEstado(filtros, estudio);
      const labelsEstados = dataEstados.map((item) => item.Estado);
      const valuesEstados = dataEstados.map((item) => item._count);
      setEstados({ labelsEstados, valuesEstados });
      const dataCuantia = await calcularSumaCuantiaPorEstado(filtros, estudio);
      const labelsCuantia = dataCuantia.map((item) => item.Estado);
      const valuesCuantia = dataCuantia.map((item) => item._sum.Cuantia);
      setCuantia({ labelsCuantia, valuesCuantia });
      const data = await obtenerConteoPorEstudio(filtros, estudio);
      const labels = data.map((item) => item.Estudio);
      const values = data.map((item) => item._count);
      setEstudios({ labels, values });
      console.log(usuariosTotales);
      const valuesUsuarios = labels.map((item) => {
        return usuariosTotales?.filter((user) => user.TE_ESTUDIO?.VCHNOMBRE === item).length;
      });
      setUsuarios({ labels, valuesUsuarios });
    };
    fecth();
  }, [filtros]);
  return (
    <div className='flex-1 p-2 flex flex-col gap-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='col-span-1 order-1 items-center p-4 flex flex-col gap-4 justify-center'>
          <FiltersDashboard handleFilters={setFiltros} estudio={estudio} filtros={filtros} />
        </Card>
        <Card className='col-span-1 order-2 md:col-span-3'>
          <TableDashboard filtros={filtros} estudio={estudio} />
        </Card>
        <Card className='col-span-1 md:col-span-2 order-3 flex-1 w-full h-[45vh]'>
          <BarDashboard
            values={estados.valuesEstados}
            labels={estados.labelsEstados}
            title={'Procesos por etapa'}
            descripcion={'Indica la cantidad de procesos que se encuentran en cada etapa'}
          />
        </Card>
        <Card className='col-span-1 md:col-span-2 order-4 flex-1 w-full h-[45vh]'>
          <BarDashboard
            values={cuantia.valuesCuantia}
            labels={cuantia.labelsCuantia}
            title={'Cuantía por etapa'}
            descripcion={'Indica la cantidad total de cuantía que se encuentran en cada etapa'}
          />
        </Card>
        {estudio == 'Administrador' && (
          <>
            <Card className='col-span-1 md:col-span-4 order-5 flex-1 w-full h-[45vh]'>
              <BarDashboard
                values={estudios.values}
                labels={estudios.labels}
                title={'Procesos por Estudio'}
                descripcion={'Indica la cantidad de procesos que estan asignados a cada estudio'}
                tipo={'x'}
              />
            </Card>
            <Card className='col-span-1 md:col-span-4 order-6 flex-1 w-full h-[45vh]'>
              <BarDashboard
                values={usuarios.valuesUsuarios}
                labels={usuarios.labels}
                title={'Usuarios por estudio'}
                descripcion={'Indica la cantidad de usuarios que estan asignados a cada estudio'}
                tipo={'x'}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
