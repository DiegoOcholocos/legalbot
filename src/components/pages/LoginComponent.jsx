'use client';
import { Button, Card, Checkbox, Input } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Imagen from './images/image.jpg';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Chip } from '@nextui-org/react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
export default function LoginComponent() {
  const [usuario, setUsuario] = useState({});
  const router = useRouter();
  const [error, setError] = useState(null); //
  const [newPassword, setNewPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleLogin = async () => {
    const res = await signIn('credentials', {
      username: usuario.usuario,
      password: usuario.pasword,
      newPassword: usuario.newPassword,
      redirect: false,
    });
    if (res?.error) {
      const error = JSON.parse(res.error.slice(7));
      if (error.newPasswordRequired) {
        setNewPassword(true);
      } else {
        setError(error.mensaje);
        setLoading(false);
      }
    } else { //
      const callbackUrl = await obtenerValorCallbackUrl(res.url);
      router.push(callbackUrl == null ? '/dashboard' : callbackUrl);
    }
  };

  const confirmContraseña = async () => {
    if (usuario.newPassword === usuario.newPasswordConfirm) {
      const res = await signIn('credentials', {
        username: usuario.usuario,
        password: usuario.pasword,
        newPassword: usuario.newPassword,
        redirect: false,
      });
      if (res?.error) {
        const error = JSON.parse(res.error.slice(7));
        setError(error.mensaje);
        setLoading(false);
      } else {
        const callbackUrl = await obtenerValorCallbackUrl(res.url);
        router.push(callbackUrl == null ? '/dashboard' : callbackUrl);
      }
    } else {
      setError('Las contraseñas no coinciden');
    }
  };
  async function obtenerValorCallbackUrl(urlString) {
    var parametros = urlString.split('?')[1]; // Obtén la parte de la cadena después del '?'

    if (parametros) {
      var pares = parametros.split('&');

      for (var i = 0; i < pares.length; i++) {
        var par = pares[i].split('=');

        if (par[0] === 'callbackUrl') {
          return decodeURIComponent(par[1]);
        }
      }
    }

    return null; // Retorna null si no se encuentra el parámetro
  }
  const [passwordConditions, setPasswordConditions] = useState({
    containsNumber: false,
    containsSpecialChar: false,
    containsUpperCase: false,
    containsLowerCase: false,
  });

  useEffect(() => {
    validatePassword();
  }, [usuario.newPassword]); // Trigger validation on password change

  const validatePassword = () => {
    const newPassword = usuario.newPassword || '';

    const containsNumber = /\d/.test(newPassword);
    const containsSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const containsUpperCase = /[A-Z]/.test(newPassword);
    const containsLowerCase = /[a-z]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;

    const isValid =
      containsNumber &&
      containsSpecialChar &&
      containsUpperCase &&
      containsLowerCase &&
      hasMinLength;

    setPasswordConditions({
      containsNumber,
      containsSpecialChar,
      containsUpperCase,
      containsLowerCase,
      hasMinLength,
    });

    setIsPasswordValid(isValid);

    // Actualiza el estado para mostrar las condiciones solo si la contraseña se está escribiendo
    setShowPasswordConditions(newPassword.length > 0);
  };

  const PasswordConditionIndicator = ({ condition, label }) => {
    return (
      <div className={condition ? 'text-green-500' : 'text-red-500'}>
        {condition ? '✔' : '✘'} {label}
      </div>
    );
  };

  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(!(usuario.usuario && usuario.pasword));
  }, [usuario.usuario, usuario.pasword]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="flex flex-row m-6 space-y-8 shadow-2xl rounded-2xl md:space-y-0 w-auto">
        <div className="flex flex-col justify-center p-8 md:p-14 max-w-[550px] w-[550px]">
          <span className="mb-3 text-2xl md:text-4xl font-bold">
            Bienvenido
          </span>
          {newPassword ? (
            <span className="font-light text-sm md:text-xl text-gray-400 mb-4">
              Ingrese su nueva contraseña
            </span>
          ) : (
            <span className="font-light text-sm md:text-xl text-gray-400 mb-4">
              Ingrese sus datos
            </span>
          )}

          {error && (
            <Chip color="danger" className="mb-4 w-full text-wrap">
              {error}
            </Chip>
          )}
          {newPassword ? (
            <>
              <div className="py-4 relative">
                <span className="mb-2 text-sm md:text-md">
                  Nueva Contraseña
                </span>
                <Input
                  type="password"
                  variant="bordered"
                  color={
                    !isPasswordValid || (isFocused && !isPasswordValid)
                      ? 'danger'
                      : 'default'
                  }
                  name="newPassword"
                  id="newPassword"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) =>
                    setUsuario({ ...usuario, newPassword: e.target.value })
                  }
                  value={usuario.newPassword || ''}
                />
                {isFocused && (
                  <div className="md:absolute -right-96 top-0 p-4 backdrop-blur-lg bg-white/70 rounded-lg z-40 ">
                    {/* Condiciones de contraseña aquí */}
                    <PasswordConditionIndicator
                      condition={passwordConditions.containsNumber}
                      label="Contiene al menos 1 número"
                    />
                    <PasswordConditionIndicator
                      condition={passwordConditions.containsSpecialChar}
                      label="Contiene al menos 1 carácter especial"
                    />
                    <PasswordConditionIndicator
                      condition={passwordConditions.containsUpperCase}
                      label="Contiene al menos una letra mayúscula"
                    />
                    <PasswordConditionIndicator
                      condition={passwordConditions.containsLowerCase}
                      label="Contiene al menos una letra minúscula"
                    />
                    <PasswordConditionIndicator
                      condition={passwordConditions.hasMinLength}
                      label="Tiene al menos 8 caracteres"
                    />
                  </div>
                )}
              </div>
              <div className="py-4 relative">
                <span className="mb-2 text-sm md:text-md">
                  Confirmar Contraseña
                </span>
                <Input
                  type="password"
                  variant="bordered"
                  color={
                    usuario.newPassword !== usuario.newPasswordConfirm
                      ? 'danger'
                      : 'default'
                  }
                  name="newPasswordConfirm"
                  id="newPasswordConfirm"
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      newPasswordConfirm: e.target.value,
                    })
                  }
                  value={usuario.newPasswordConfirm || ''}
                />
              </div>
            </>
          ) : (
            <>
              <div className="py-4 relative">
                <span className="mb-2 text-sm md:text-md">Usuario</span>
                <Input
                  type="text"
                  name="usuario"
                  id="usuario"
                  variant="bordered"
                  onChange={(e) =>
                    setUsuario({ ...usuario, usuario: e.target.value })
                  }
                />
              </div>
              <div className="py-4">
                <span className="mb-2 text-sm md:text-md ">Contraseña</span>
                <div className="relative">
                  <Input
                    variant="bordered"
                    type={isVisible ? 'text' : 'password'}
                    name="contraseña"
                    id="contraseña"
                    onChange={(e) =>
                      setUsuario({ ...usuario, pasword: e.target.value })
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              <Checkbox
                defaultSelected
                size="sm"
                color="primary"
                className="text-sm md:text-md"
              >
                Recordar Usuario
              </Checkbox>
            </div>
          </div>
          {newPassword ? (
            <Button
              className={`py-2 px-4 ${
                usuario.newPassword === usuario.newPasswordConfirm
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } rounded-md`}
              onClick={async () => {
                setIsLoadingButton(true);
                await confirmContraseña();
                setIsLoadingButton(false);
              }}
              disabled={
                usuario.newPassword !== usuario.newPasswordConfirm ||
                isLoadingButton
              }
            >
              {isLoadingButton ? 'Cargando...' : 'Confirmar'}
            </Button>
          ) : (
            <Button
              className={`w-full p-2 rounded-lg mb-6 ${
                isButtonDisabled
                  ? 'bg-gray-700 text-white cursor-not-allowed'
                  : 'bg-primary-400 text-white'
              } rounded-lg`}
              disabled={isButtonDisabled || isLoadingButton}
              onClick={async () => {
                setIsLoadingButton(true);
                await handleLogin();
                setIsLoadingButton(false);
              }}
            >
              {isLoadingButton ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          )}
        </div>
        <div className="relative">
          <Image
            src={Imagen}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
            width={500}
            height={500}
            priority
          />
          <div className="absolute w-full hidden bottom-10 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-xl">
              Transformando la Experiencia en la Gestión de los procesos
              judiciales.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
