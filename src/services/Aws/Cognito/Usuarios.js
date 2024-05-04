import { crearRegistroEstudios, crearRegistroUsuarioEstudio } from '@/services/Prisma/Estudio';
import {
  editarUsuario as editarUsuarioP,
  crearUsuario as crearUsuarioP,
  cambiarEstado,
} from '@/services/Prisma/Usuario';
const AWS = require('aws-sdk');

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;
const userPoolId = process.env.USER_POOL_ID;

AWS.config.update({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

export const crearUsuario = async (credentials) => {
  const { email, usuario, password, tipoUsuario, rol } = credentials;
  console.log('CR:', credentials);
  const dataEstudio = credentials.estudio.split('/-/');
  const estudioId = dataEstudio[0];
  const estudioNombre = dataEstudio[1];
  console.log('estudio: ', credentials.estudio);
  const usuarioId = await crearUsuarioP(email, tipoUsuario, Number(rol), parseInt(estudioId));
  console.log('usuarioId', usuarioId);
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: userPoolId,
    };
    //
    const userData = {
      Username: email,
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'custom:estudio',
          Value: estudioNombre,
        },
        {
          Name: 'custom:tipoUsuario',
          Value: tipoUsuario,
        },
        {
          Name: 'custom:rol',
          Value: rol ? String(rol) : null,
        },
        {
          Name: 'custom:usuario_id',
          Value: usuarioId ? String(usuarioId) : null,
        },
        {
          Name: 'custom:estudio_id',
          Value: estudioId ? String(estudioId) : null,
        },
      ],
    };

    cognitoidentityserviceprovider.adminCreateUser({ ...poolData, ...userData }, (err, data) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        reject(err); // Reject the promise with the error
      } else {
        resolve(true); // Resolve the promise with true on success
      }
    });
  });
};

export const listarUsuarios = async () => {
  const params = {
    UserPoolId: userPoolId,
  };

  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data.Users);
      }
    });
  });
};

export const adminDisableUser = async (username, mail) => {
  await cambiarEstado(mail, '0');
  return new Promise((resolve, reject) => {
    const params = {
      UserPoolId: userPoolId,
      Username: username,
    };

    cognitoidentityserviceprovider.adminDisableUser(params, (err, data) => {
      if (err) {
        console.error('Error disabling user:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export const adminEnableUser = async (username, mail) => {
  await cambiarEstado(mail, '1');
  return new Promise((resolve, reject) => {
    const params = {
      UserPoolId: userPoolId,
      Username: username,
    };

    cognitoidentityserviceprovider.adminEnableUser(params, (err, data) => {
      if (err) {
        console.error('Error enabling user:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export const editarUsuario = async (data) => {
  console.log('EDIT : ', data);
  const dataEstudio = data.estudio.split('/-/');
  const estudioId = dataEstudio[0];
  const estudioNombre = dataEstudio[1];
  await editarUsuarioP(
    Number(data.usuarioId),
    data.tipoUsuario,
    Number(data.rol),
    parseInt(estudioId)
  );

  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: userPoolId,
    };

    const params = {
      UserPoolId: poolData.UserPoolId,
      Username: data.usuario,
      UserAttributes: [
        {
          Name: 'custom:estudio',
          Value: estudioNombre,
        },
        {
          Name: 'custom:tipoUsuario',
          Value: data.tipoUsuario,
        },
        {
          Name: 'custom:rol',
          Value: data.rol ? String(data.rol) : null,
        },
        {
          Name: 'custom:estudio_id',
          Value: estudioId ? String(estudioId) : null,
        },
      ],
    };

    cognitoidentityserviceprovider.adminUpdateUserAttributes(params, (err, data) => {
      if (err) {
        console.error('Error al editar el usuario:', err);
        reject(err); // Reject the promise with the error
      } else {
        resolve(true); // Resolve the promise with true on success
      }
    });
  });
};

export const adminResetUserPassword = async (credentials) => {
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: userPoolId,
    };

    const params = {
      UserPoolId: poolData.UserPoolId,
      Username: credentials.usuario,
      Password: credentials.password,
    };

    cognitoidentityserviceprovider.adminSetUserPassword(params, (err, data) => {
      if (err) {
        console.error('Error resetting user password:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
