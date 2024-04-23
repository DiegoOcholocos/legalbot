'use client';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { IoMdSettings } from 'react-icons/io';

export default function Acciones({ items, icon }) {
  return (
    <Dropdown backdrop='blur'>
      <DropdownTrigger>
        <Button isIconOnly>{icon ? icon : <IoMdSettings />}</Button>
      </DropdownTrigger>
      <DropdownMenu>
        {items.map((item, index) => (
          <DropdownItem
            key={index}
            onPress={item.action}
            startContent={item.icon}
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
