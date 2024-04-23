'use client';
import { Button, Tooltip } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { size } from '@/services/data';

export default function ButtonTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <Tooltip content='Tema'>
      <Button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        isIconOnly
      >
        {theme === 'light' ? (
          <MdDarkMode size={size} />
        ) : (
          <MdLightMode size={size} />
        )}
      </Button>
    </Tooltip>
  );
}
