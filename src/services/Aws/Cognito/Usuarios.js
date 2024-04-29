import {
  crearRegistroEstudios,
  crearRegistroUsuarioEstudio,
} from '@/services/Prisma/Estudio';
import {
  EditarEstadoCuentaCognito2,
  EditarEstadoCuentaCognito1,
  editarUsuario as editarUsuarioP,
  crearUsuario as crearUsuarioP,
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
  console.log(credentials);
  const { email, usuario, password, estudio, tipoUsuario, rol } = credentials;
  const usuarioId = await crearUsuarioP(email, tipoUsuario, Number(rol));
  const estudioId = await crearRegistroEstudios(estudio);
  console.log(usuarioId, estudioId.NUMESTUDIOID);
  await crearRegistroUsuarioEstudio(usuarioId, estudioId.NUMESTUDIOID);
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
          Value: estudio,
        },
        {
          Name: 'custom:tipoUsuario',
          Value: tipoUsuario,
        },
        {
          Name: 'custom:rol',
          Value: rol,
        },
        {
          Name: 'custom:usuario_id',
          Value: String(usuarioId),
        },
        {
          Name: 'custom:estudio_id',
          Value: String(estudioId.NUMESTUDIOID),
        },
      ],
    };

    cognitoidentityserviceprovider.adminCreateUser(
      { ...poolData, ...userData },
      (err, data) => {
        if (err) {
          console.error('Error al crear el usuario:', err);
          reject(err); // Reject the promise with the error
        } else {
          resolve(true); // Resolve the promise with true on success
        }
      }
    );
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
  await EditarEstadoCuentaCognito2(mail);
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
  await EditarEstadoCuentaCognito1(mail);
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
  console.log(data);
  await editarUsuarioP(
    Number(data.usuarioId),
    data.tipoUsuario,
    Number(data.rol)
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
          Value:
            data.tipoUsuario === 'Administrador'
              ? ''
              : data.estudio,
        },
        {
          Name: 'custom:tipoUsuario',
          Value: data.tipoUsuario,
        },
        {
          Name: 'custom:rol',
          Value: data.rol,
        },
      ],
    };

    cognitoidentityserviceprovider.adminUpdateUserAttributes(
      params,
      (err, data) => {
        if (err) {
          console.error('Error al editar el usuario:', err);
          reject(err); // Reject the promise with the error
        } else {
          resolve(true); // Resolve the promise with true on success
        }
      }
    );
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
