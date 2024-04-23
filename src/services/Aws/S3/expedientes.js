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
