'use client';
import { useState, useMemo, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';
import { RxPencil1 } from 'react-icons/rx';
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
} from '@nextui-org/react';
import { editarTarea, obtenerTareasActividad } from '@/services/Prisma/Tarea';
import AWS from 'aws-sdk';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

export default function ModalEditarTarea({
  Tarea,
  totalUsuarios,
  setTotalTarea,
  totalRol,
  isOpen,
  onOpen,
  onOpenChange,
}) {
  const s3 = new AWS.S3({
    region: 'us-east-1',
    accessKeyId: 'AKIAVNIGRL6VQALTCM77',
    secretAccessKey: '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',
  });
  const [selectedKeys, setSelectedKeys] = useState(new Set([Tarea?.VCHLISTAUSUARIOS.split(',')]));
  const [selectedKeys2, setSelectedKeys2] = useState(new Set([Tarea?.VCHROLES.split(',')]));
  //const Archivo = getArchivoTarea(Tarea.VCHARCHIVOS);

  // const {Archivo, setArchivo} = useState(await.getArchivoTarea(Tarea.VCHARCHIVOS))

  const [selectedFiles, setSelectedFiles] = useState([]); //ACA DEBEN ESTAR LOS ARCHIVOS PREVIOS

  const [archivoObtenido, setArchivoObtenido] = useState([]);

  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [values, setValues] = useState({
    VCHNOMBRE: Tarea.VCHNOMBRE,
    VCHDESCRIPCION: Tarea.VCHDESCRIPCION,
    NUMDIASALERTA: Tarea.NUMDIASALERTA,
    NUMDIASDURACION: Tarea.NUMDIASDURACION,
    // VCHROLRESPONSABLE: Tarea.VCHROLES,
    USUARIOS: new Set([Tarea.VCHLISTAUSUARIOS.split(',')]),
    ROLES: new Set([Tarea.VCHROLES.split(',')]),
    ARCHIVOS: [Tarea.VCHARCHIVOS],
  });
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedKeys(new Set(Tarea.VCHLISTAUSUARIOS?.split(',')));
      setSelectedKeys2(new Set(Tarea.VCHROLES?.split(',')));
      const archivos = async () => {
        try {
          const archivo = await extraccionarchivosS3(Tarea.VCHARCHIVOS);
          setArchivoObtenido(archivo);
        } catch (error) {
          console.error('Error al obtener archivos:', error);
        }
      };
      archivos();
    }
  }, [!isOpen]);

  const extraccionarchivosS3 = async (folder) => {
    try {
      const params = {
        Bucket: 'expedientespjvf',
        Prefix: `archivos/${empresa}/${folder}/`, // Utiliza Prefix en lugar de Key
      };
      s3.listObjectsV2(params, function (err, data) {
        if (err) {
          console.log('Error al listar objetos: ', err);
        } else {
          setArchivoObtenido(data.Contents);
        }
      });
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const empresa = process.env.CLIENTE;

  const handleDeleteFile = async (archivo) => {
    const params = {
      Bucket: 'expedientespjvf',
      Key: `${archivo}`, // Utiliza el nombre del archivo como Key para eliminarlo
    };
    try {
      await s3.deleteObject(params).promise();
      setArchivoObtenido(archivoObtenido.filter((arc) => arc.Key !== archivo));
    } catch (error) {
      console.error('Error al eliminar el archivo de S3:', error);
    }
  };

  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    setValues((prevState) => ({
      ...prevState,
      USUARIOS: new Set(Array.from(keys)),
    }));
  };
  const handleSelectionChange2 = (keys) => {
    setSelectedKeys2(keys);
    setValues((prevState) => ({
      ...prevState,
      ROLES: new Set(Array.from(keys)),
    }));
  };
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFilesArray]);
    }
  };

  const handleEditTarea = async () => {
    try {
      // Elimina archivos de S3 no seleccionados
      const selectedFilesCopy = [...selectedFiles];
      const filesToDelete = Tarea.VCHARCHIVOS.split(',').filter(
        (file) => !selectedFilesCopy.includes(file)
      );
      for (const fileToDelete of filesToDelete) {
        await handleDeleteFile(fileToDelete);
      }
      // Sube nuevos archivos a S3
      await handleUploadToS3();
      // Edita la tarea
      const res = await editarTarea(values, Tarea.NUMTAREAID);
      console.log(res);
      const actividades = await obtenerTareasActividad(Tarea.NUMACTIVIDADID);
      setTotalTarea(actividades);
      const archivo = await extraccionarchivosS3(Tarea.VCHARCHIVOS);
      setSelectedFiles(archivo);
      // onClose(); // Aquí se cierra el modal utilizando onClose
    } catch (error) {
      console.error('Error al editar la tarea:', error);
    }
  };
  const generateUniqueFileName = (fileName, uploadedFileNames) => {
    const getRandomNumber = () => Math.floor(Math.random() * 10000); // Genera un número aleatorio entre 0 y 9999
    let uniqueFileName = fileName;

    // Si el nombre del archivo ya existe en la lista de nombres de archivos subidos, genera un nombre único
    while (uploadedFileNames.includes(uniqueFileName)) {
      const randomNumber = getRandomNumber();
      const [name, ext] = fileName.split('.');
      uniqueFileName = `${name}_${randomNumber}.${ext}`;
    }

    return uniqueFileName;
  };

  const handleUploadToS3 = async () => {
    const uploadedNames = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const params = {
        Bucket: 'expedientespjvf',
        Key: `archivos/${empresa}/${Tarea.VCHARCHIVOS}/${file.name}`, // Ajusta la clave para incluir la carpeta existente y el nombre del archivo
        Body: file,
      };
      try {
        const data = await s3.upload(params).promise();
        console.log('Archivo cargado exitosamente:', data);
        setArchivoObtenido((prev) => [...prev, data]);
      } catch (error) {
        console.error('Error al cargar el archivo a S3:', error);
      }
    }
    // Actualizar el estado de ARCHIVOS con el nombre de la carpeta
    setSelectedFiles([]); // Restablecer el valor del estado de los archivos seleccionados después de la carga
  };

  const selectedUsersValue = useMemo(() => {
    const selectedUsers = Array.from(selectedKeys).map((key) => {
      const user = totalUsuarios.find((usuario) => usuario.NUMUSUARIOID === parseInt(key));
      return user ? user.VCHCORREO.split('@')[0] : '';
    });
    return selectedUsers.join(', ');
  }, [selectedKeys]);

  const selectedRolesValue = useMemo(() => {
    const selectedRoles = Array.from(selectedKeys2).map((key) => {
      const rol = totalRol.find((rol) => rol.NUMROLID === parseInt(key));
      return rol?.VCHNOMBRE;
    });

    return selectedRoles.join(', ');
  }, [selectedKeys2]);
  const handleDownloadFile = async (archivo) => {
    const params = {
      Bucket: 'expedientespjvf',
      Key: `${archivo}`, // Utiliza el nombre del archivo como Key para descargarlo
    };
    try {
      const data = await s3.getObject(params).promise();
      const url = URL.createObjectURL(new Blob([data.Body]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el archivo de S3:', error);
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={() => onOpenChange(!isOpen)} placement='top-center'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Editar Tarea</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label='Ingrese un nombre'
                name='VCHNOMBRE'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={Tarea.VCHNOMBRE}
              />
              <Input
                autoFocus
                label='Ingrese una descripcion'
                name='VCHDESCRIPCION'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={Tarea.VCHDESCRIPCION}
              />
              <Input
                type='number'
                autoFocus
                label='Dias de Duracion'
                name='NUMDIASDURACION'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={Tarea.NUMDIASDURACION}
              />
              <Input
                type='number'
                autoFocus
                label='Dias de Alerta'
                name='NUMDIASALERTA'
                variant='bordered'
                isClearable
                onChange={handleValues}
                defaultValue={Tarea.NUMDIASALERTA}
              />
              <div>Seleccione los usuarios asignados</div>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant='bordered' className='uppercase'>
                    {selectedUsersValue === '' ? 'Seleccione Usuarios' : selectedUsersValue}
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
                    <DropdownItem key={usuario.NUMUSUARIOID} value={usuario.VCHCORREO}>
                      {usuario.VCHCORREO}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <div>Seleccione los Roles</div>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant='bordered' className='uppercase'>
                    {selectedRolesValue === '' ? 'Seleccione Roles' : selectedRolesValue}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='Seleccione ROLES'
                  variant='flat'
                  closeOnSelect={false}
                  disallowEmptySelection={false}
                  selectionMode='multiple'
                  selectedKeys={selectedKeys2}
                  onSelectionChange={handleSelectionChange2}
                >
                  {totalRol?.map((usuario) => (
                    <DropdownItem key={usuario.NUMROLID} value={usuario.VCHNOMBRE}>
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
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-400 file:text-white file:cursor-pointer cursor-default'
                  multiple // Agrega el atributo multiple para permitir la selección de múltiples archivos
                />
                ///ARCHIVO NO VA SOLO NECESITA UNA PROPEIDAD
              )}
              <h3 className='text-center font-bold'>ARCHIVOS ASOCIADOS</h3>
              <div className='flex flex-col w-full'>
                {archivoObtenido?.length === 0 && (
                  <h4 className='text-center text-sm'>No existen archivos</h4>
                )}
                {archivoObtenido?.map((archivo) => (
                  <div
                    key={archivo.ETag}
                    className='w-full flex justify-between items-center hover:bg-gray-700 p-2 rounded-md'
                  >
                    <h3 className='text-sm font-semibold'>
                      {archivo.Key.split('/')[archivo.Key.split('/').length - 1]}
                    </h3>
                    <div className='flex gap-4'>
                      <Button
                        color='primary'
                        isIconOnly
                        onPress={() => handleDownloadFile(archivo.Key)}
                      >
                        <FaCloudDownloadAlt />
                      </Button>
                      <Button
                        color='danger'
                        isIconOnly
                        onPress={() => handleDeleteFile(archivo.Key)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                variant='flat'
                onPress={() => {
                  onClose();
                  !isSelected;
                }}
              >
                Cerrar
              </Button>
              {
                <Button
                  color='primary'
                  onPress={() => {
                    handleEditTarea();
                    onClose();
                    !isSelected;
                  }}
                >
                  Editar
                </Button>
              }
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
