'use client';
import { useState,useRef } from 'react';
import {
  Card,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
} from '@nextui-org/react';
import ExcelJS from 'exceljs';
import { useRouter } from 'next/navigation';
import {
  crearRegistroCargas,
  registroMasivo,
} from '@/services/Prisma/Expediente';
import {
  crearRegistroHistorial,
  actualizarRegistro,
  obtenerExpedienteHisto,
} from '@/services/Prisma/HistorialDocumentos';
import Title from '../utils/system/Title';
import ModalCarteraAlerta from '@/components/utils/modals/ModalCarteraAlerta';

const CarteraComponent = ({ historialDocumentos, countExpedienteNum }) => {
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [validFormat, setValidFormat] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false); // Nuevo estado para el mensaje de finalización
  const [errors, setErrors] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const router = useRouter();
  const [totalDatos, setTotalDatos] = useState(countExpedienteNum);
  const [expedientes, setExpedientes] = useState(historialDocumentos);
  const [idArchivo, setIdArchivo] = useState('');
  const [contArchivoT, setContArchivoT] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const limite = process.env.LIMIT_WALLET;
  const inputFileRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const validarFormatoExcel = (worksheet) => {
    if (!worksheet || worksheet.rowCount < 1) {
      console.error(
        'Error al cargar el archivo Excel. Verifica que el archivo sea válido.'
      );
      setValidFormat(false);
      return false;
    }

    const encabezadosEsperados = [
      'DEMANDA',
      'CODIGO UNICO DE EXPEDIENTE',
      'RUC',
      'RAZON SOCIAL',
      'CODIGO ESTUDIO',
      'ESTUDIO',
      'Cuantía',
      'FECHA PRESENTACIÓN',
      'AÑO',
      'GRUPO',
      'CRITICOS',
      'ZONA',
      'CodigoCliente',
      'NombreCliente',
      'BUFFER01',
      'BUFFER02',
      'BUFFER03',
    ];

    const encabezados = worksheet.getRow(1).values;
    // Verificar si todos los encabezados esperados están presentes
    const esFormatoValido = encabezadosEsperados.every((encabezado) =>
      encabezados.includes(encabezado)
    );

    // Verificar si la cantidad de filas no supera un límite (por ejemplo, 100 filas)
    const limiteFilas = limite; // Puedes ajustar este límite según tus necesidades-------------------------------------------------VARIABLE
    const cantidadFilas = worksheet.rowCount;
    const noSuperaLimiteFilas = cantidadFilas <= limiteFilas + 1;

    setValidFormat(esFormatoValido && noSuperaLimiteFilas);

    return esFormatoValido && noSuperaLimiteFilas;
  };

  const handleFileUpload = async (e) => {
    const newErrors = []; // Definir 'newErrors' antes de su uso
    const rowsWithError = []; // Almacena las filas con errores
    const expedientesValidos = []; // Almacena los expedientes válidos
    const contador = [];
    // Lógica para procesar el archivo Excel y recopilar los errores en 'newErrors'

    setUploading(true);
    const archivo = e.target.files[0];

    const libroExcel = new ExcelJS.Workbook();

    try {
      await libroExcel.xlsx.load(archivo);
      const hojaExcel = libroExcel.getWorksheet(1);

      // Validar el formato del Excel
      const esFormatoValido = validarFormatoExcel(hojaExcel);

      if (esFormatoValido) {
        const headers = hojaExcel.getRow(1).values;

        hojaExcel.eachRow((fila, numeroFila) => {
          // No contar la primera fila (encabezados)
          if (numeroFila > 1) {
            const datosFila = {};
            let hasError = false;

            fila.eachCell({ includeEmpty: true }, (celda, indiceColumna) => {
              // Obtener el encabezado de la columna actual
              const encabezado = headers[indiceColumna];
              const valorCelda = celda.text || '';

              // Excluir la columna "DEMANDA" antes de agregar los datos a datosFila
              datosFila[encabezado] = valorCelda;

              // Validar los datos según el encabezado correspondiente
              if (encabezado === 'CODIGO UNICO DE EXPEDIENTE') {
                const patron_cod_expediente =
                  /\b\d{5}-\d{4}-\d{1,2}-\d{4}-[a-zA-Z]{2}-[a-zA-Z]{2}-\d+\b/i;
                expedientesValidos.push(datosFila);
                if (!patron_cod_expediente.test(valorCelda)) {
                  hasError = true;
                  // Aquí solo agregamos la fila con error, sin incluir las propiedades column y message
                  newErrors.push({ row: numeroFila, ...datosFila });
                } else {
                  setContArchivoT((prevContArchivoT) => prevContArchivoT + 1);
                }
              }
            });

            if (hasError) {
              rowsWithError.push(datosFila); // Agrega la fila con error al array
            }
          }
        });

        const fechaCarga = new Date();
        const options = { timeZone: 'America/Lima' };
        const fechaFormateada = `${fechaCarga.toLocaleDateString(
          'es-PE',
          options
        )} ${fechaCarga.toLocaleTimeString('es-PE', options)}`;

        setExcelData(expedientesValidos); // Establece solo las filas con errores como datos del Excel

        const nomArchivo = archivo.name;
        const rowCountString = expedientesValidos.length - rowsWithError.length;
        const idData = await crearRegistroHistorial(
          nomArchivo,
          rowCountString.toString(),
          'No Cargado',
          fechaFormateada
        );
        setIdArchivo(idData);

        const expedientesData = await obtenerExpedienteHisto();
        setExpedientes(expedientesData);
      } else {
        console.error(
          'Formato de Excel no válido. Por favor, verifica la estructura.'
        );
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        setErrorCount(newErrors.length);
        await guardarErroresEnExcel(newErrors);
      } else {
        setErrors([]);
        setErrorCount(0);
      }

      setUploading(false);
    } catch (error) {
      console.error('Error al cargar el archivo Excel:', error);
      setUploading(false);
    }
  };

  const guardarErroresEnExcel = async (newErrors) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Errores');

    // Agregar encabezados
    const headers = Object.keys(newErrors[0]); // Obtener los encabezados de las filas con errores
    worksheet.addRow(headers);

    // Agregar cada fila con error en el Excel
    newErrors.forEach((error) => {
      const rowData = headers.map((header) => error[header]); // Obtener solo los valores de cada campo en la fila con error
      worksheet.addRow(rowData);
    });

    // Guardar el archivo Excel
    const blob = await workbook.xlsx.writeBuffer();
    const nombreArchivo = 'errores_detectados.xlsx'; // Nombre del archivo de errores
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowExcel = async () => {
    const validData = excelData.filter((expediente) => {
      // Verificar si hay errores para esta fila
      const tieneError = errors.some(
        (error) =>
          error['CODIGO UNICO DE EXPEDIENTE'] ===
          expediente['CODIGO UNICO DE EXPEDIENTE']
      );
      // Devolver falso si hay un error para esta fila, verdadero en caso contrario
      return !tieneError;
    });
    if (validData.length > 0) {
      setUploading(true);
      try {
        const tamañoLote = 2500; // Tamaño del lote para la carga masiva
        const lotes = [];
        for (let i = 0; i < validData.length; i += tamañoLote) {
          lotes.push(validData.slice(i, i + tamañoLote));
        }
        console.log('=== Hora Inicio Total: ', new Date());
        let expedientesCargados = 0;
        for (let lote of lotes) {
          try {
            console.log('Insertando lote en la base de datos... : ');
            await registroMasivo(lote, idArchivo);
          } catch (error) {
            console.error(
              'Error al insertar carga en la base de datos:',
              error
            );
          } finally {
            expedientesCargados += lote.length;
            setPorcentaje(
              ((expedientesCargados / validData.length) * 100).toFixed(2)
            );
          }
        }
        console.log('=== Hora Fin Total: ', new Date());
        await actualizarRegistro(idArchivo);
        const expedientesData = await obtenerExpedienteHisto();
        setExpedientes(expedientesData);

        setUploadCompleted(true); // Indica que la carga ha finalizado
        window.alert("✔️✔️✔️  Sus expedientes se han subido satisfactoriamente  ✔️✔️✔️");
      } catch (error) {
        console.error('Error al subir el archivo a S3:', error);
        window.alert("❌❌❌  Ocurrio un error al subir los expedientes  ❌❌❌");
      } finally {
        setUploading(false);
        // Limpiar el contenido una vez que se ha cargado
        setExcelData([]);
        setValidFormat(null);
        setUploadCompleted(false);
        setErrors([]);
        setErrorCount(0);
        setTotalDatos(0);
        setContArchivoT(0);
        setPorcentaje(0);
        setIdArchivo('');
        handleResetFileInput();
        setShowModal(true);
      }
    } else {
      console.log('No hay datos válidos para subir a S3.');
    }
  };

  const handleResetFileInput = () => {
    inputFileRef.current.value = null;
  };

  return (
    <>
      <Title title='Cartera de Expedientes' />

      <Card className='p-4 rounded-lg mx-4 flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <label className='font-bold text-md' for='file_input'>
            Subir el archivo de expedientes :
          </label>
          <div>
            <input
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-400 file:text-white file:cursor-pointer cursor-default'
              aria-describedby='file_input_help'
              id='file_input'
              type='file'
              accept='.xlsx, .xls'
              onChange={handleFileUpload}
              ref={inputFileRef} 
            />
            <p class='text-sm text-gray-400 p-2' id='file_input'>
              Solo se aceptan archivos de tipo XLSX o XLS.   ❗
            </p>
          </div>
        </div>
        <h3>
          Porcentaje de Expedientes Subidos :
          {porcentaje ? porcentaje + '%' : '0%'}   ⌛
        </h3>
        <div className='flex flex-col gap-1 px-2 '>
          {uploading && <p> - Subiendo a la nube...</p>}
          {uploadCompleted && (
            <p> - La carga a la Nube se ha completado exitosamente.   ✔️</p>
          )}
          {uploading ? <p>Subiendo...   ⌛</p> : null}
          {validFormat === false && (
            <p>
              - Formato de Excel no válido. Por favor, verifica la estructura.   ❌
            </p>
          )}
          {validFormat === false && (
            <p> - Cantidad de expedientes máximo por archivo: {limite}   ❌</p>
          )}

          {!uploading && contArchivoT > 0 && validFormat && (
            <>
              <p>{`Cantidad de expedientes en el archivo : ${contArchivoT}`}   ✔️</p>
              <p>{`Cantidad de expedientes en la aplicación : ${totalDatos}`}   ✔️</p>
              <p>{`Cantidad de errores en el archivo : ${errorCount}`}   ✔️</p>
              {/* Mostrar la cantidad de errores */}
              <p>{`LÍMITE DE CARTERA : ${limite}`}   ✔️</p>
              {/* Mostrar el límite de la cartera */}
              {totalDatos + contArchivoT > limite ? (
                <h1>
                  No se puede subir el archivo porque excede el límite de la
                  cartera. Te excediste por:{' '}
                  {contArchivoT + totalDatos - limite}   ❌
                </h1>
              ) : (
                <Button
                  onClick={handleShowExcel}
                  className='w-full'
                  disabled={uploading || contArchivoT + totalDatos > limite}
                >
                  Subir expedientes
                </Button>
              )}
            </>
          )}
          {!uploading && contArchivoT === 0 && validFormat && (
            <p>No hay datos de Excel para mostrar.</p>
          )}
        </div>
        {/* Mostrar la lista de errores en una tabla */}
        {errorCount > 0 && (
          <div className='mt-4'>
            <h2 className='text-lg font-semibold mb-2'>Errores encontrados:</h2>
            <table className='w-full border-collapse border border-gray-600'>
              <thead>
                <tr>
                  <TableColumn>
                    Se han borrado todas las columnas que no cumplen con el
                    formato y se descargara un excel con los errores para su
                    analisis
                  </TableColumn>
                </tr>
              </thead>
            </table>
          </div>
        )}
        {expedientes.length > 0 && (
          <div className='mt-4'>
            <h2 className='text-lg font-semibold mb-2'>
              Expedientes Históricos:
            </h2>
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>
                  <p>Nombre Documento</p>
                </TableColumn>
                <TableColumn>
                  <p>Cant. expedientes</p>
                </TableColumn>
                <TableColumn>
                  <p>Estado de la carga</p>
                </TableColumn>
                <TableColumn>
                  <p>Fecha de carga</p>
                </TableColumn>
              </TableHeader>
              <TableBody>
                {expedientes.map((expediente) => (
                  <TableRow key={expediente.NUMHISTORIALDOCSID}>
                    <TableCell>{expediente.VCHNOMDOC}</TableCell>
                    <TableCell>{expediente.VCHCANTEXP}</TableCell>
                    <TableCell>{expediente.VCHESTADO}</TableCell>
                    <TableCell>{expediente.VCHFECHACARDA}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      <ModalCarteraAlerta open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default CarteraComponent;
