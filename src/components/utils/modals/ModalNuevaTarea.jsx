'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  select,
} from '@nextui-org/react';
import { crearTarea } from '@/services/Prisma/Tarea';
import AWS from 'aws-sdk';

export default function ModalNuevaTarea({
  idActi,
  idFluj,
  totalUsuarios,
  totalRol,
  setTareas,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedKeys2, setSelectedKeys2] = useState(new Set([]));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [values, setValues] = useState({
    VCHNOMBRE: '',
    VCHDESCRIPCION: '',
    NUMDIASALERTA: '',
    NUMDIASDURACION: '',
  });
  const [isSelected, setIsSelected] = useState(false);

  const empresa = process.env.EMPRESA;

  const handleSelectionChange = (keys) => {
    console.log('usuarios ==>', keys);
    setSelectedKeys(keys);
    setValues({ ...values, USUARIOS: keys });
  };
  const handleSelectionChange2 = (keys) => {
    console.log('roles ==>', keys);
    setSelectedKeys2(keys);
    setValues({ ...values, ROLES: keys });
  };
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateTarea = async () => {
    const folderName = Math.random().toString(36).substring(7);
    await handleUploadToS3(folderName);
    const res = await crearTarea(values, idActi, idFluj, folderName);
    console.log(res);
    if (res) {
      // Verificar si res existe y tiene la propiedad 'data'
      // Si la tarea se crea exitosamente, llamar a la función de actualización
      setTareas((prevTareas) => [...prevTareas, res]); // Asumiendo que res.data contiene la nueva tarea creada
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setSelectedFiles(files);
      console.log('Archivos seleccionados:', files);

      // Almacenar los nombres de los archivos en el estado values
      const fileNames = Array.from(files).map((file) => file.name);
    }
  };

  const handleUploadToS3 = async (folderName) => {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: 'AKIAVNIGRL6VQALTCM77',
      secretAccessKey: '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',
    });

    const s3 = new AWS.S3();

    const uploadedNames = []; // Almacenar los nombres de los archivos subidos

    // Generar un nombre aleatorio para la carpeta // Nombre aleatorio de 7 caracteres

    // Iterar sobre cada archivo seleccionado y cargarlo a S3
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Generar un nombre de archivo único dentro de la carpeta aleatoria
      const uniqueFileName = `${folderName}/${file.name}`;

      const params = {
        Bucket: 'expedientespjvf',
        Key: `archivos/${empresa}/${uniqueFileName}`,
        Body: file,
      };

      try {
        const data = await s3.upload(params).promise();
        console.log('Archivo cargado exitosamente:', data);
        uploadedNames.push(uniqueFileName); // Agregar el nombre del archivo subido al array de nombres
      } catch (error) {
        console.error('Error al cargar el archivo a S3:', error);
      }
    }

    // Actualizar el estado de ARCHIVOS con el nombre de la carpeta
    setSelectedFiles([]); // Restablecer el valor del estado de los archivos seleccionados después de la carga
  };

  const selectedUsersValue = useMemo(() => {
    const selectedUsers = Array.from(selectedKeys).map((key) => {
      console.log('key:', key);
      const user = totalUsuarios.find(
        (usuario) => usuario.NUMUSUARIOID === parseInt(key)
      );
      return user ? user.VCHCORREO.split('@')[0] : '';
    });
    return selectedUsers.join(', ');
  }, [selectedKeys]);

  const selectedRolesValue = useMemo(() => {
    const selectedRoles = Array.from(selectedKeys2).map((key) => {
      console.log('key:', key);
      const rol = totalRol.find((rol) => rol.NUMROLID === parseInt(key));
      return rol?.VCHNOMBRE;
    });
    return selectedRoles.join(', ');
  }, [selectedKeys2]);

  selectedRolesValue;
  return (
    <div>
      <Button onPress={onOpen} color='danger' style={{ marginLeft: '20px' }}>
        Crear Tarea
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => onOpenChange(!isOpen)}
        placement='top-center'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Nueva Tarea
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Ingrese un nombre'
                  name='VCHNOMBRE'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                  defaultValue={values.VCHNOMBRE}
                />

                <Input
                  autoFocus
                  label='Ingrese una descripcion'
                  name='VCHDESCRIPCION'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                  defaultValue={values.VCHDESCRIPCION}
                />
                <Input
                  type='number'
                  autoFocus
                  label='Dias de Duracion'
                  name='NUMDIASDURACION'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                  defaultValue={values.VCHDIASDURACION}
                />
                <Input
                  type='number'
                  autoFocus
                  label='Dias de Alerta'
                  name='NUMDIASALERTA'
                  variant='bordered'
                  isClearable
                  onChange={handleValues}
                  defaultValue={values.NUMDIASALERTA}
                />
                <div>Seleccione los usuarios asignados</div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant='bordered' className='uppercase'>
                      {selectedUsersValue === ''
                        ? 'Seleccione Usuarios'
                        : selectedUsersValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='Seleccione usuarios'
                    variant='flat'
                    closeOnSelect={false}
                    disallowEmptySelection={false}
                    selectionMode='multiple'
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelectionChange}
                  >
                    {totalUsuarios.map((usuario) => (
                      <DropdownItem
                        key={usuario.NUMUSUARIOID}
                        value={usuario.VCHCORREO}
                      >
                        {usuario.VCHCORREO}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <div>Seleccione los Roles</div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant='bordered' className='uppercase'>
                      {selectedRolesValue === ''
                        ? 'Seleccione Usuarios'
                        : selectedRolesValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='Seleccione usuarios'
                    variant='flat'
                    closeOnSelect={false}
                    disallowEmptySelection={false}
                    selectionMode='multiple'
                    selectedKeys={selectedKeys2}
                    onSelectionChange={handleSelectionChange2}
                  >
                    {totalRol?.map((usuario) => (
                      <DropdownItem
                        key={usuario.NUMROLID}
                        value={usuario.VCHNOMBRE}
                      >
                        {usuario.VCHNOMBRE}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                  ¿Va a cargar archivos?
                </Checkbox>
                {isSelected && (
                  <input
                    type='file'
                    name='ARCHIVOS'
                    onChange={handleFileInputChange}
                    multiple // Agrega el atributo multiple para permitir la selección de múltiples archivos
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    handleCreateTarea();
                    onClose();
                  }}
                >
                  Crear Tarea
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
