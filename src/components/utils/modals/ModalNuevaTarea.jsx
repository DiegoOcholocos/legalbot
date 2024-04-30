'use client';
import { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { Select, SelectItem } from "@nextui-org/react";
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
} from "@nextui-org/react";
import { crearTarea, obtenerTareasActividad } from '@/services/Prisma/Tarea';

import AWS from "aws-sdk";

import { FaSleigh } from "react-icons/fa";

export default function ModalNuevaTarea({ idActi, idFluj, totalUsuarios, totalRol, setTareas }) {

  const router = useRouter();
  const [showNoUsersModal, setShowNoUsersModal] = useState(false);
  const [showNoRolModal, setshowNoRolModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedKeys2, setSelectedKeys2] = useState(new Set([]));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tareasActividad, settareasActividad] = useState([]);

  const [IdDependencia, setIdDependencia] = useState();

  const [isFileCheckboxSelected, setIsFileCheckboxSelected] = useState(false);
  const [isDependencyCheckboxSelected, setIsDependencyCheckboxSelected] = useState(false);

  useEffect(() => {
    const getTareasActividad = async (idActi) => {
      const tareasActividad = await obtenerTareasActividad(idActi);
      settareasActividad(tareasActividad);
    }
    getTareasActividad(idActi);
  }, [idActi]);

  const [values, setValues] = useState({
    VCHNOMBRE: "",
    VCHDESCRIPCION: "",
    NUMDIASALERTA: "",
    NUMDIASDURACION: "",
  });
  const [isSelected, setIsSelected] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const empresa = process.env.EMPRESA;
  const isButtonDisabled = !idActi || idActi === "";


  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    setValues({ ...values, USUARIOS: keys });
  };
  const handleSelectionChange2 = (keys) => {
    setSelectedKeys2(keys);
    setValues({ ...values, ROLES: keys });
  };
  const handleValues = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateTarea = async () => {
    const { VCHNOMBRE, VCHDESCRIPCION, NUMDIASALERTA, NUMDIASDURACION } = values;
    if (!VCHNOMBRE || !VCHDESCRIPCION || !NUMDIASALERTA || !NUMDIASDURACION || selectedKeys.size === 0 || selectedKeys2.size === 0) {
      setShowWarning(true);
      return;
    }

    const folderName = Math.random().toString(36).substring(7);
    await handleUploadToS3(folderName);
    const res = await crearTarea(values, idActi, idFluj, folderName);

    if (res) {
      setTareas((prevTareas) => [...prevTareas, res]);
    }
    // setIsOpen(false);
    handleOpenModal();
  };


  const handleOpenModal = () => {
    if (totalUsuarios.length === 0) {
      setShowNoUsersModal(true);
      return;
    }

    if (totalRol.length === 0) {
      setshowNoRolModal(true);
      return;
    }

    setSelectedKeys(new Set([]));
    setSelectedKeys2(new Set([]));
    setSelectedFiles([]);
    setValues({
      VCHNOMBRE: "",
      VCHDESCRIPCION: "",
      NUMDIASALERTA: "",
      NUMDIASDURACION: "",
    });
    setIsSelected(false);
    setIsDependencyCheckboxSelected(false);
    setIsFileCheckboxSelected(false);
    setIsOpen(!isOpen);
  };


  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setSelectedFiles(files);

      // Almacenar los nombres de los archivos en el estado values
      const fileNames = Array.from(files).map((file) => file.name);
    }
  };

  const handleUploadToS3 = async (folderName) => {
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: "AKIAVNIGRL6VQALTCM77",
      secretAccessKey: "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",
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
        Bucket: "expedientespjvf",
        Key: `archivos/${empresa}/${uniqueFileName}`,
        Body: file,
      };

      try {
        const data = await s3.upload(params).promise();
        uploadedNames.push(uniqueFileName); // Agregar el nombre del archivo subido al array de nombres
      } catch (error) {
      }
    }

    // Actualizar el estado de ARCHIVOS con el nombre de la carpeta
    setSelectedFiles([]); // Restablecer el valor del estado de los archivos seleccionados después de la carga
  };

  const selectedUsersValue = useMemo(() => {
    const selectedUsers = Array.from(selectedKeys).map((key) => {
      const user = totalUsuarios.find((usuario) => usuario.NUMUSUARIOID === parseInt(key));
      return user ? user.VCHCORREO.split("@")[0] : "";
    });
    return selectedUsers.join(", ");
  }, [selectedKeys]);

  const selectedRolesValue = useMemo(() => {
    const selectedRoles = Array.from(selectedKeys2).map((key) => {
      const rol = totalRol.find((rol) => rol.NUMROLID === parseInt(key));
      return rol?.VCHNOMBRE;
    });
    return selectedRoles.join(", ");
  }, [selectedKeys2]);

  selectedRolesValue;
  return (
    <div>
      {idActi && (
        <Button
          onPress={handleOpenModal}
          color="danger"
          style={{ marginLeft: "20px" }}
          disabled={isButtonDisabled} >
          Crear Tarea
        </Button>
      )}

      <Modal isOpen={showNoUsersModal} onClose={() => setShowNoUsersModal(false)}>
        <ModalContent>
          <ModalHeader>No existen usuarios</ModalHeader>
          <ModalBody>No hay usuarios disponibles para asignar a la tarea.
            <Button
              color="danger"
              className='py-2 px-4 rounded-md'
              size='md'
              onPress={() => router.push(`/dashboard/usuarios`)}>
              Crear un Usuario
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowNoUsersModal(false)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showNoRolModal} onClose={() => setshowNoRolModal(false)}>
        <ModalContent>
          <ModalHeader>No existen Roles</ModalHeader>
          <ModalBody>No hay Roles disponibles para asignar a la tarea.
            <Button
              color="danger"
              className='py-2 px-4 rounded-md'
              size='md'
              onPress={() => router.push(`/dashboard/roles`)}>
              Crear un Rol
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setshowNoRolModal(false)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showWarning} onOpenChange={() => setShowWarning(false)}>
        <ModalContent>
          <ModalHeader>Advertencia</ModalHeader>
          <ModalBody>Por favor, complete todos los campos obligatorios.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setShowWarning(false)}>
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Nueva Tarea</ModalHeader>
          <ModalBody>
            <Input
              autoFocus label="Ingrese un nombre*"
              name="VCHNOMBRE"
              variant="bordered"
              isClearable onChange={handleValues}
              defaultValue={values.VCHNOMBRE} />

            <Input
              autoFocus
              label="Ingrese una descripcion *"
              name="VCHDESCRIPCION"
              variant="bordered"
              isClearable
              onChange={handleValues}
              defaultValue={values.VCHDESCRIPCION}
            />
            <Input
              type="number"
              autoFocus
              label="Dias de Duracion*"
              name="NUMDIASDURACION"
              variant="bordered"
              isClearable
              onChange={handleValues}
              defaultValue={values.VCHDIASDURACION}
            />
            <Input
              type="number"
              autoFocus
              label="Dias de Alerta*"
              name="NUMDIASALERTA"
              variant="bordered"
              isClearable
              onChange={handleValues}
              defaultValue={values.NUMDIASALERTA}
            />
            <div>Seleccione los usuarios asignados</div>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="uppercase">
                  {selectedUsersValue === "" ? "Seleccione Usuarios*" : selectedUsersValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Seleccione usuarios*"
                variant="flat"
                closeOnSelect={false}
                disallowEmptySelection={false}
                selectionMode="multiple"
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
                <Button variant="bordered" className="uppercase">
                  {selectedRolesValue === "" ? "Seleccione Roles*" : selectedRolesValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Seleccione Roles*"
                variant="flat"
                closeOnSelect={false}
                disallowEmptySelection={false}
                selectionMode="multiple"
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

            <Checkbox
              isSelected={isFileCheckboxSelected}
              onValueChange={setIsFileCheckboxSelected}
            >
              ¿Va a cargar archivos?
            </Checkbox>
            {isFileCheckboxSelected && (
              <input
                type="file"
                name="ARCHIVOS"
                onChange={handleFileInputChange}
                multiple // Permite la selección de múltiples archivos
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={() => setIsOpen(false)}>
              Cerrar
            </Button>
            <Button color="primary" onPress={handleCreateTarea}>
              Crear Tarea
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
