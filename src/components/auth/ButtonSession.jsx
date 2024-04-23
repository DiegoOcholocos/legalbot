'use client';
import { Button, Tooltip } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import { RiLogoutCircleRLine } from 'react-icons/ri';

export function ButtonLogout() {
  return (
    <Tooltip content='Cerrar Session'>
      <Button isIconOnly onClick={() => signOut()}>
        <RiLogoutCircleRLine />
      </Button>
    </Tooltip>
  );
}
