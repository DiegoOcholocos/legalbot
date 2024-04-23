'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@nextui-org/react';
import { menu } from '../../../services/data';
import Image from 'next/image';
import {
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
  RxHamburgerMenu,
} from 'react-icons/rx';
import ButtonTheme from '@/components/utils/system/ButtonTheme';
import { ButtonLogout } from '@/components/auth/ButtonSession';

const LayoutDashboard = ({ children, session, estudio }) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={`grid min-h-screen ${
        !collapsed
          ? 'grid-cols-sidebar-sm md:grid-cols-sidebar-md'
          : 'grid-cols-sidebar-collapsed'
      } transition-grid-template-columns duration-300 ease-in-out`}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
        session={session}
        estudio={estudio}
      />
      <div className='w-full max-h-screen flex flex-col overflow-x-hidden'>
        <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
        <div className='flex-1 w-full h-full p-4'>{children}</div>
      </div>
    </div>
  );
};
export default LayoutDashboard;

const Sidebar = ({ collapsed, setCollapsed, shown, session, estudio }) => {
  return (
    <Card
      className={`
        z-20 transition-all duration-300 ease-in-out fixed md:static md:translate-x-0 rounded-r-lg rounded-l-none md:w-full w-[200px] '
        ${!shown ? '-translate-x-full' : ''}
      `}
    >
      <div className='flex flex-col justify-between h-screen sticky inset-0 w-full'>
        <div
          className={`
            flex items-center  transition-none
            ${!collapsed ? 'p-4 justify-between' : 'py-4 justify-center'}
          `}
        >
          <div className='w-full flex flex-col items-center'>
            <Link href='/'>
              <Image width={50} height={50} src='/logo.png' alt='TrackExp' />
            </Link>
            {!collapsed && (
              <>
                <h1 className='font-bold text-lg md:text-2xl mb-4'>
                  Track{' '}
                  <span className='font-bold text-lg  md:text-2xl text-primary-400'>
                    Exp
                  </span>
                </h1>
                <h2 className='text-md font-semibold uppercase'>
                  {session.user.email.split('@')[0]}{' '}
                </h2>
                <h2 className='text-sm font-light'>({estudio})</h2>
              </>
            )}
          </div>
        </div>

        <nav className='flex-grow w-full justify-between flex flex-col p-2'>
          <ul className='flex flex-col gap-2 items-stretch'>
            {menu.map((item) => (
              <ItemSidebar
                key={item.nombre}
                icon={item.icon}
                nombre={item.nombre}
                menu={item.menu}
                collapsed={collapsed}
              />
            ))}
          </ul>
          <div className='w-full flex justify-center gap-2 flex-wrap'>
            <ButtonTheme />
            <ButtonLogout />
          </div>
        </nav>
        <Button
          variant='light'
          className='w-full rounded-lg h-10 hidden md:block md:flex justify-center items-center'
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <RxDoubleArrowRight size={20} />
          ) : (
            <RxDoubleArrowLeft size={20} />
          )}
        </Button>
      </div>
    </Card>
  );
};

const ItemSidebar = ({ icon, nombre, menu, collapsed }) => {
  return (
    <li
      key={nombre}
      className={`
        flex hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-300
        ${
          !collapsed
            ? 'rounded-md p-2 mx-3 gap-4'
            : 'rounded-full p-2 mx-3 w-10 h-10'
        }
      `}
    >
      <Link href={menu[0].href} className='flex gap-2'>
        {icon} <span>{!collapsed && menu[0].nombre}</span>
      </Link>
    </li>
  );
};

const Navbar = ({ onMenuButtonClick }) => {
  return (
    <div className='md:hidden flex justify-end items-center w-screen md:w-full sticky z-10 py-4 px-8'>
      <Button onClick={onMenuButtonClick}>
        <RxHamburgerMenu size={20} />
      </Button>
    </div>
  );
};
