'use client';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { RxInfoCircled } from 'react-icons/rx';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
const BarDashboard = ({ values, labels, title, descripcion, tipo }) => {
  const dataBar = {
    labels: labels,
    datasets: [
      {
        data: values,
        borderWidth: 1,
        backgroundColor: 'rgb(54, 162, 235)',
      },
    ],
  };
  const config = {
    indexAxis: tipo ? tipo : 'y',
    type: 'bar',
    data: dataBar,
    plugins: {
      legend: null,
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className='w-full h-full'>
      <CardHeader className='flex gap-3'>
        <Popover placement='right-start'>
          <PopoverTrigger>
            <div className='flex items-center gap-1'>
              <p className='text-md font-bold'>{title}</p>
              <RxInfoCircled />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className='px-1 py-2'>
              <div className='text-tiny w-48'>{descripcion}</div>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardBody className='h-full '>
        <Bar options={config} data={dataBar} />
      </CardBody>
    </Card>
  );
};

export default BarDashboard;
