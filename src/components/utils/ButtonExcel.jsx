// components/ButtonExcel.jsx
'use client';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import ExcelJS from 'exceljs';
import { RxDownload } from 'react-icons/rx';
1;
import { obtenerExpedientePageBExport } from '@/services/Prisma/Expediente';
import { size } from '@/services/data';

const ButtonExcel = ({ filter, pages, estudio }) => {
  const [downloading, setDownloading] = useState(0);
  const pageSize = 100;
  const totalPages = Math.ceil(pages / pageSize);
  const handleButtonClick = async () => {
    try {
      const allExpedientes = [];
      for (let i = 1; i <= totalPages; i++) {
        const jsonData = await obtenerExpedientePageBExport(
          i,
          filter,
          pageSize,
          estudio
        );
        if (!jsonData || jsonData.length === 0) {
          console.error('Error: JSON data is not available or empty.');
          return;
        }
        // Agregar todos los elementos de jsonData al array temporal
        allExpedientes.push(...jsonData);
        setDownloading(i);
      }

      const excelData = allExpedientes.map((expediente) => ({
        NumeroExpediente: expediente.NumeroExpediente,
        Demanda: expediente.Demanda,
        RazonSocial: expediente.RazonSocial,
        Estudio: expediente.Estudio,
        Ruc: expediente.Ruc,
        Cuantia: expediente.Cuantia,
        CodEstudio: expediente.CodEstudio,
        FechaPresentacion: expediente.FechaPresentacion,
        Año: expediente.Año,
        Grupo: expediente.Grupo,
        Criticos: expediente.Criticos,
        Zona: expediente.Zona,
        OrganoJurisdiccional: expediente.OrganoJurisdiccional,
        DistritoJudicial: expediente.DistritoJudicial,
        Juez: expediente.Juez,
        EspecialistaLegal: expediente.EspecialistaLegal,
        FechaInicio: expediente.FechaInicio,
        Proceso: expediente.Proceso,
        Observacion: expediente.Observacion,
        Especialidad: expediente.Especialidad,
        Materias: expediente.Materias,
        Estado: expediente.Estado,
        EtapaProcesal: expediente.EtapaProcesal,
        FechaConclucion: expediente.FechaConclucion,
        Ubicacion: expediente.Ubicacion,
        MotivoConclucion: expediente.MotivoConclucion,
        Sumilla: expediente.Sumilla,
        ResumenUltimaResolucion: expediente.ResumenUltimaResolucion,
        UltimaClasificacion: expediente.UltimaClasificacion,
        CodigoUltimaClasificacion: expediente.CodigoUltimaClasificacion,
        FechaUltimaClasificacion: expediente.FechaUltimaClasificacion,
        MovimientoUltimaClasificacion: expediente.MovimientoUltimaClasificacion,
        ClasificacionPriorizada: expediente.ClasificacionPriorizada,
        CodigoClasificacionPriorizada: expediente.CodigoClasificacionPriorizada,
        FechaClasificacionPriorizada: expediente.FechaClasificacionPriorizada,
        MovimientoClasificacionPriorizada:
          expediente.MovimientoClasificacionPriorizada,
        Demandado: expediente.Demandado,
        CompararDemandado: expediente.CompararDemandado,
      }));

      if (excelData.length === 0) {
        console.error('Error: No data available for Excel file.');
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expedientes');

      // Añadir encabezados
      const headers = [
        'Número Expediente',
        'Número de Demanda',
        'Empleador',
        'Estudio',
        'RUC',
        'Cuantia', // Agregado
        'Codigo de Estudio', // Agregado
        'Fecha de Presentación', // Agregado
        'Año', // Agregado
        'Grupo', // Agregado
        'Criticos', // Agregado
        'Zona', // Agregado
        'Organo Jurisdiccional',
        'Distrito Judicial',
        'Juez',
        'Especialista Legal',
        'Fecha Inicio',
        'Proceso',
        'Observación',
        'Especialidad',
        'Materias',
        'Estado',
        'Etapa Procesal',
        'Fecha Conclusión',
        'Ubicación',
        'Motivo Conclusión',
        'Sumilla',
        'Resumen Última Resolución',
        'Última Clasificación',
        'Código Última Clasificación',
        'Fecha Última Clasificación',
        'Movimiento Última Clasificación',
        'Clasificación Priorizada',
        'Código Clasificación Priorizada',
        'Fecha Clasificación Priorizada',
        'Movimiento Clasificación Priorizada',
        'Demandado',
        'CompararDemandado',
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2F75B5' },
      };

      headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1);
        column.width = 30;
      });

      // Añadir datos
      excelData.forEach((expediente) => {
        worksheet.addRow(Object.values(expediente));
      });

      // Generar un blob desde el libro de Excel
      const blob = await workbook.xlsx.writeBuffer();

      // Crear un objeto URL para el blob y abrir una nueva ventana con el enlace
      const url = URL.createObjectURL(
        new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expedientes.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(0);
    } catch (error) {
      setDownloading(0);
      console.error(error);
    }
  };
  if (downloading == 0) {
    return (
      <Button
        color='default'
        className='py-2 px-4 rounded-md '
        size='md'
        onClick={handleButtonClick}
      >
        <RxDownload size={size} />
        Descargar Excel
      </Button>
    );
  } else {
    return (
      <Button className='py-2 px-4 rounded-md ' size='md' color='success'>
        {downloading == totalPages ? (
          <>Exportando Excel ... </>
        ) : (
          <>{((downloading / totalPages) * 100).toFixed(2)} %</>
        )}
      </Button>
    );
  }
};

export default ButtonExcel;
