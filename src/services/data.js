import {
  RxFileText,
  RxHome,
  RxUpload,
  RxFile,
  RxBarChart,
  RxPerson,
  RxCheckbox,
  RxAccessibility,
} from 'react-icons/rx';
import { GoLaw } from 'react-icons/go';

export const size = 22;
export const menu = [
  {
    nombre: 'Configuración',
    icon: <RxHome size={size} />,
    menu: [
      {
        nombre: 'Inicio',
        href: '/dashboard',
      },
    ],
  },
  {
    nombre: 'Expedientes',
    icon: <RxFileText size={size} />,
    menu: [
      {
        nombre: 'Expedientes',
        href: '/dashboard/expedientes',
      },
    ],
  },
  {
    nombre: 'Dashboard',
    icon: <RxBarChart size={size} />,
    menu: [
      {
        nombre: 'Dashboard',
        href: '/dashboard/reportes',
      },
    ],
  },
  {
    nombre: 'Cartera',
    icon: <RxUpload size={size} />,
    menu: [
      {
        nombre: 'Cartera',
        href: '/dashboard/cartera',
      },
    ],
  },
  {
    nombre: 'Usuarios',
    icon: <RxPerson size={size} />,
    menu: [
      {
        nombre: 'Usuarios',
        href: '/dashboard/usuarios',
      },
    ],
  },
  {
    nombre: 'Estudios',
    icon: <GoLaw size={size} />,
    menu: [
      {
        nombre: 'Estudios',
        href: '/dashboard/estudios',
      },
    ],
  },
  {
    nombre: 'Roles',
    icon: <RxAccessibility size={size} />,
    menu: [
      {
        nombre: 'Roles',
        href: '/dashboard/roles',
      },
    ],
  },
  {
    nombre: 'Flujos',
    icon: <RxCheckbox size={size} />,
    menu: [
      {
        nombre: 'Flujos',
        href: '/dashboard/flujos',
      },
    ],
  },
];

export const estadosTareaExpediente = {
  PENDIENTE: 'PENDIENTE',
  TERMINADO: 'TERMINADO',
  INACTIVO: 'INACTIVO',
};
