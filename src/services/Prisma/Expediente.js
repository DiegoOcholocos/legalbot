'use server';
import db from '@/libs/prisma';

export async function obtenerExpedientePage(
  page = 1,
  filter,
  pageSize = 10,
  estudio
) {
  const pages = parseInt(page) || 1;
  const pagesSize = parseInt(pageSize) || 10;
  const skip = (pages - 1) * pagesSize;

  const whereClause = {
    NOT: { NumeroSincronizaciones: 0 },
    Estudio: estudio !== 'Administrador' ? estudio : undefined,
  };

  if (filter.term && filter.term !== '') {
    whereClause.OR = [
      {
        NumeroExpediente: {
          contains: filter.term,
        },
      },
      {
        Sumilla: {
          contains: filter.term,
        },
      },
      {
        Ubicacion: {
          contains: filter.term,
        },
      },
      {
        Estado: {
          contains: filter.term,
        },
      },
      {
        OrganoJurisdiccional: {
          contains: filter.term,
        },
      },
      {
        RazonSocial: {
          contains: filter.term,
        },
      },
    ];
  }

  if (filter.tipo === 'Activos') {
    whereClause.FechaUltimaActualizacion = {
      gte: '2024-04-10 00:00:00',
    };
  } else if (filter.tipo === 'Inactivos') {
    whereClause.FechaUltimaActualizacion = {
      lte: '2024-04-10 00:00:00',
    };
  }

  const expedientes = await db.Expediente.findMany({
    take: pagesSize,
    skip: skip,
    where: whereClause,
    select: {
      ExpedienteId: true,
      NumeroExpediente: true,
      Sumilla: true,
      Ubicacion: true,
      Estado: true,
      OrganoJurisdiccional: true,
      Estudio: true,
      RazonSocial: true,
    },
  });

  return expedientes;
}

export async function obtenerCountExpediente(filter, estudio) {
  const whereClause = {
    NOT: { NumeroSincronizaciones: 0 },
    Estudio: estudio !== 'Administrador' ? estudio : undefined,
  };

  if (filter.term && filter.term !== '') {
    whereClause.OR = [
      {
        NumeroExpediente: {
          contains: filter.term,
        },
      },
      {
        Sumilla: {
          contains: filter.term,
        },
      },
      {
        Ubicacion: {
          contains: filter.term,
        },
      },
      {
        Estado: {
          contains: filter.term,
        },
      },
      {
        OrganoJurisdiccional: {
          contains: filter.term,
        },
      },
      {
        RazonSocial: {
          contains: filter.term,
        },
      },
    ];
  }

  if (filter.tipo === 'Activos') {
    whereClause.FechaUltimaActualizacion = {
      gte: '2024-04-10 00:00:00',
    };
  } else if (filter.tipo === 'Inactivos') {
    whereClause.FechaUltimaActualizacion = {
      lte: '2024-04-10 00:00:00',
    };
  }

  const count = await db.Expediente.count({ where: whereClause });
  return count;
}

export async function obtenerExpedientePageBExport(
  page = 1,
  filter,
  pageSize = 10,
  estudio
) {
  const pages = parseInt(page) || 1;
  const pagesSize = parseInt(pageSize) || 10;
  const skip = (pages - 1) * pagesSize;

  const whereClause = {
    NOT: { NumeroSincronizaciones: 0 },
    Estudio: estudio !== 'Administrador' ? estudio : undefined,
  };

  if (filter.term && filter.term !== '') {
    whereClause.OR = [
      {
        NumeroExpediente: {
          contains: filter.term,
        },
      },
      {
        Sumilla: {
          contains: filter.term,
        },
      },
      {
        Ubicacion: {
          contains: filter.term,
        },
      },
      {
        Estado: {
          contains: filter.term,
        },
      },
      {
        OrganoJurisdiccional: {
          contains: filter.term,
        },
      },
      {
        RazonSocial: {
          contains: filter.term,
        },
      },
    ];
  }

  if (filter.tipo === 'Activos') {
    whereClause.FechaUltimaActualizacion = {
      gte: '2024-04-10 00:00:00',
    };
  } else if (filter.tipo === 'Inactivos') {
    whereClause.FechaUltimaActualizacion = {
      lte: '2024-04-10 00:00:00',
    };
  }

  const expedientes = await db.Expediente.findMany({
    take: pagesSize,
    skip: skip,
    where: whereClause,
  });

  return expedientes;
}

export async function obtenerDistritosJudicialesExpedientes(filter, estudio) {
  const distritosUnicos = await db.Expediente.groupBy({
    by: ['DistritoJudicial'],
    select: {
      DistritoJudicial: true,
    },
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  return distritosUnicos;
}

export async function obntenerEstadosExpedientes(filter, estudio) {
  const estadosUnicos = await db.Expediente.groupBy({
    by: ['Estado'],
    select: {
      Estado: true,
    },
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  return estadosUnicos;
}

export async function obntenerEspecialidadesExpedientes(filter, estudio) {
  const especialidadesEnicas = await db.Expediente.groupBy({
    by: ['Especialidad'],
    select: {
      Especialidad: true,
    },
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  return especialidadesEnicas;
}
export async function obtenerExpedientePageDash(
  page = 1,
  filter,
  pageSize = 5,
  estudio
) {
  if (filter != '' && filter != undefined) {
    const pages = parseInt(page) || 1;
    const pagesSize = parseInt(pageSize);
    const skip = (pages - 1) * pageSize;
    const expedientes = await db.Expediente.findMany({
      take: pagesSize,
      skip: skip,
      where: {
        Estudio: estudio !== 'Administrador' ? estudio : undefined,
        DistritoJudicial:
          filter.distrito != undefined && filter.distrito != ''
            ? filter.distrito
            : undefined,
        Estado:
          filter.estado != undefined && filter.estado != ''
            ? filter.estado
            : undefined,
        Especialidad:
          filter.especialidad != undefined && filter.especialidad != ''
            ? filter.especialidad
            : undefined,
        NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
      },
      select: {
        ExpedienteId: true,
        NumeroExpediente: true,
        DistritoJudicial: true,
        Proceso: true,
        Estado: true,
        Especialidad: true,
      },
    });
    return expedientes;
  } else {
    const pages = parseInt(page) || 1;
    const pagesSize = parseInt(pageSize) || 10;
    const skip = (pages - 1) * pagesSize;
    const expedientes = db.Expediente.findMany({
      take: pagesSize,
      skip: skip,
      where: {
        Estudio: estudio !== 'Administrador' ? estudio : undefined,
        NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
      },
      select: {
        ExpedienteId: true,
        NumeroExpediente: true,
        DistritoJudicial: true,
        Proceso: true,
        Estado: true,
        Especialidad: true,
      },
    });
    return expedientes;
  }
}
export async function obtenerCountExpedienteDash(filter, estudio) {
  const count = db.Expediente.count({
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  return count;
}

export async function obtenerConteoPorEstado(filter, estudio) {
  const conteoPorEstado = await db.Expediente.groupBy({
    by: ['Estado'],
    _count: true,
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  const resultadoOrdenado = conteoPorEstado.sort((a, b) => b._count - a._count);
  const primerosSeis = resultadoOrdenado.slice(0, 7);
  const otros = resultadoOrdenado.slice(7);

  // Sumar el recuento de "otros"
  const recuentoOtros = otros.reduce(
    (total, estado) => total + estado._count,
    0
  );
  const resultadoFinal = [
    ...primerosSeis,
    { _count: recuentoOtros, Estado: 'OTROS ...' },
  ];
  return resultadoFinal;
}

export async function obtenerExpedientesTotales(estudio) {
  const expedientes = db.Expediente.findMany({
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      NOT: { NumeroSincronizaciones: 0 },
    },
    select: {
      NumeroExpediente: true,
      FechaUltimaClasificacion: true,
    },
  });
  return expedientes;
}

export async function obtenerExpedientesFechasCount(estudio) {
  const expedientes = db.Expediente.findMany({
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      FechaUltimaActualizacion: {
        gte: '2024-04-10 00:00:00',
      },
      NOT: { NumeroSincronizaciones: 0 },
    },
    select: {
      NumeroExpediente: true,
      FechaUltimaClasificacion: true,
    },
  });
  return expedientes;
}

export async function calcularSumaCuantiaPorEstado(filter, estudio) {
  try {
    // Consulta SQL para calcular la suma de cuantía por estado
    const resultado = await db.Expediente.groupBy({
      _sum: {
        Cuantia: true,
      },
      by: ['Estado'],
      where: {
        Estudio: estudio !== 'Administrador' ? estudio : undefined,
        DistritoJudicial:
          filter?.distrito != undefined && filter.distrito != ''
            ? filter.distrito
            : undefined,
        Estado:
          filter?.estado != undefined && filter.estado != ''
            ? filter.estado
            : undefined,
        Especialidad:
          filter?.especialidad != undefined && filter.especialidad != ''
            ? filter.especialidad
            : undefined,
        NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
      },
    });
    const resultadoOrdenado = resultado.sort(
      (a, b) => b._sum.Cuantia - a._sum.Cuantia
    );
    const primerosSeis = resultadoOrdenado.slice(0, 7);
    const otros = resultadoOrdenado.slice(7);

    // Sumar el recuento de "otros"
    const recuentoOtros = otros.reduce(
      (total, estado) => total + estado._sum.Cuantia,
      0
    );
    const resultadoFinal = [
      ...primerosSeis,
      { _sum: { Cuantia: recuentoOtros }, Estado: 'OTROS ...' },
    ];
    return resultadoFinal;
  } catch (error) {
    console.error('Error al calcular la suma de la cuantía por estado:', error);
    throw error;
  }
}

export async function obtenerEstudiosExpedientes() {
  const estudios = await db.Expediente.findMany({
    distinct: ['Estudio'],
    select: {
      Estudio: true,
      CodEstudio: true,
    },
  });
  return estudios;
}

export async function obtenerConteoPorEstudio(filter, estudio) {
  const conteoPorEstudio = await db.Expediente.groupBy({
    by: ['Estudio'],
    _count: true,
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      DistritoJudicial:
        filter?.distrito != undefined && filter.distrito != ''
          ? filter.distrito
          : undefined,
      Estado:
        filter?.estado != undefined && filter.estado != ''
          ? filter.estado
          : undefined,
      Especialidad:
        filter?.especialidad != undefined && filter.especialidad != ''
          ? filter.especialidad
          : undefined,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  const resultadoOrdenado = conteoPorEstudio.sort(
    (a, b) => b._count - a._count
  );
  return resultadoOrdenado;
}
export async function obtenerExpediente(estudio, ExpedienteId) {
  const expedientes = db.Expediente.findMany({
    where: {
      Estudio: estudio !== 'Administrador' ? estudio : undefined,
      ExpedienteId: ExpedienteId,
      NOT: { NumeroSincronizaciones: 0 }, // Agregado NOT
    },
  });
  return expedientes;
}

export async function obtenerCountExpedienteNum() {
  const totalExpedientes = await db.Expediente.count();
  return totalExpedientes;
}

export async function crearRegistroCargas(carga, idArchivo) {
  try {
    // Convertir INTANO a un número entero
    const intAno = parseInt(carga.AÑO);
    const codigo = generarCodigoAleatorio(longitudCodigo);
    var fecha = new Date();
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var dia = ('0' + fecha.getDate()).slice(-2);
    var horas = ('0' + fecha.getHours()).slice(-2);
    var minutos = ('0' + fecha.getMinutes()).slice(-2);
    var segundos = ('0' + fecha.getSeconds()).slice(-2);
    var fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    //const fechaPeru = moment().tz('America/Lima');
    // Insertar cada carga
    const nuevaCarga = await db.Expediente.create({
      data: {
        ExpedienteId: codigo,
        Demanda: carga.DEMANDA,
        NumeroExpediente: carga['CODIGO UNICO DE EXPEDIENTE'].toUpperCase(),
        Ruc: carga.RUC,
        RazonSocial: carga['RAZON SOCIAL'],
        CodEstudio: carga['CODIGO ESTUDIO'],
        Estudio: carga.ESTUDIO,
        Cuantia: parseFloat(carga.Cuantía),
        FechaPresentacion: carga['FECHA PRESENTACIÓN'],
        Date: carga.AÑO, // Utilizar el valor convertido
        Grupo: carga.GRUPO,
        Criticos: carga.CRITICOS,
        Zona: carga.ZONA,
        CodigoCliente: carga.CodigoCliente,
        NombreCliente: carga.NombreCliente,
        NUMESTADOREGISTRO: -1,
        VCHTIPOSINCRONIZACION: 'D',
        //NUMHISTORIALDOCSID: ,
        FECINSERCION: fechaFormateada,
        VCHTIPOCARGA: 'M',
        NUMHISTORIALDOCSID: parseInt(idArchivo),
      },
    });
    console.log('Nueva carga insertada:', nuevaCarga);
  } catch (error) {
    console.error('Error al crear registro de carga:', error);
    throw error;
  }
}
const longitudCodigo = 20;
function generarCodigoAleatorio(longitud) {
  const caracteresPermitidos =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteresPermitidos.length);
    codigo += caracteresPermitidos.charAt(indice);
  }

  return codigo;
}

const obtenerDatosParaRegistroMasivo = async (cargas, idArchivo) => {
  const expedientes = [];
  for (const carga of cargas) {
    const intAno = parseInt(carga.AÑO);
    const codigo = generarCodigoAleatorio(longitudCodigo);
    var fecha = new Date();
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var dia = ('0' + fecha.getDate()).slice(-2);
    var horas = ('0' + fecha.getHours()).slice(-2);
    var minutos = ('0' + fecha.getMinutes()).slice(-2);
    var segundos = ('0' + fecha.getSeconds()).slice(-2);
    var fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    const data = {
      ExpedienteId: codigo,
      Demanda: carga.DEMANDA,
      NumeroExpediente: carga['CODIGO UNICO DE EXPEDIENTE'].toUpperCase(),
      Ruc: carga.RUC,
      RazonSocial: carga['RAZON SOCIAL'],
      CodEstudio: carga['CODIGO ESTUDIO'],
      Estudio: carga.ESTUDIO,
      Cuantia: parseFloat(carga.Cuantía),
      FechaPresentacion: carga['FECHA PRESENTACIÓN'],
      Date: carga.AÑO, // Utilizar el valor convertido
      Grupo: carga.GRUPO,
      Criticos: carga.CRITICOS,
      Zona: carga.ZONA,
      CodigoCliente: carga.CodigoCliente,
      NombreCliente: carga.NombreCliente,
      NUMESTADOREGISTRO: -1,
      VCHTIPOSINCRONIZACION: 'D',
      FECINSERCION: fechaFormateada,
      VCHTIPOCARGA: 'M',
      NUMHISTORIALDOCSID: parseInt(idArchivo),
    };
    expedientes.push(data);
  }
  return expedientes;
};

export const registroMasivo = async (cargas, idArchivo) => {
  const expedientes = await obtenerDatosParaRegistroMasivo(cargas, idArchivo);
  console.log('Hora Inicio: ', new Date());
  const nuevaCarga = await db.Expediente.createMany({
    data: expedientes,
  });
  console.log('Hora Fin: ', new Date());
  return nuevaCarga;
};
