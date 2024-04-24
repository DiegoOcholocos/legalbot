import { obtenerExpediente } from '@/services/Prisma/Expediente';

const AWS = require('aws-sdk');

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.REGION;

AWS.config.update({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const s3 = new AWS.S3();

export const getExpedienteJson = async (id, estudio) => {
  try {
    const empresa = process.env.EMPRESA;
    const paramS3 = {
      Bucket: 'expedientespjvf',
      Key: `expedientes/${empresa}/${id}/${id}.json`,
    };

    const data = await s3.getObject(paramS3).promise();
    console.log(data);
    const expediente = JSON.parse(data.Body.toString());
    return expediente;
  } catch (error) {
    const expedienteFromDB = await obtenerExpediente(estudio, id);
    console.log('Db: ', expedienteFromDB);
    return expedienteFromDB[0];
  }
};

export const listarArchivosCarpeta = async (prefix) => {
  try {
    const params = {
      Bucket: 'expedientespjvf',
      Prefix: prefix, // Utiliza Prefix en lugar de Key
    };
    return new Promise((resolve, reject) => {
      s3.listObjectsV2(params, function (err, data) {
        if (err) {
          console.log('Error al listar objetos: ', err);
          reject(err);
        } else {
          resolve(data.Contents);
        }
      });
    });
  } catch (error) {
    console.log('Error : ', error);
  }
};

export const descargarArchivo = async (archivo) => {
  const params = {
    Bucket: 'expedientespjvf',
    Key: `${archivo}`,
  };
  try {
    const data = await s3.getObject(params).promise();
    const blob = new Blob([data.Body]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const nombre = archivo.split('/')[archivo.split('/').length - 1];
    link.setAttribute('download', nombre);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error al descargar el archivo de S3:', error);
  }
};
