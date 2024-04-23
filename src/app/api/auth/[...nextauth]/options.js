import CredentialsProvider from 'next-auth/providers/credentials';
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;
const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.USER_POOL_WEB_CLIENT_ID;

AWS.config.update({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

var poolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
export const options = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        newPassword: { label: 'New Password', type: 'password' },
      },

      async authorize(credentials, req) {
        try {
          const result = await new Promise((resolve, reject) => {
            const authenticationData = {
              Username: credentials.username,
              Password: credentials.password,
            };

            const authenticationDetails =
              new AmazonCognitoIdentity.AuthenticationDetails(
                authenticationData
              );

            const userData = {
              Username: credentials.username,
              Pool: userPool,
            };

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: function (result) {
                const data = {
                  id: result.getIdToken().payload.sub,
                  name: result.getIdToken().payload['cognito:username'],
                  email: result.getIdToken().payload.email,
                  group: result.getIdToken().payload['cognito:groups'],
                  estudio: result.getIdToken().payload['custom:estudio'],
                  tipoUsuario:
                    result.getIdToken().payload['custom:tipoUsuario'],
                };
                resolve(data);
              },
              onFailure: function (err) {
                const data = {
                  mensaje: 'Credenciales incorrectas',
                };
                reject(new Error(JSON.stringify(data)));
              },
              newPasswordRequired: async function (
                userAttributes,
                requiredAttributes
              ) {
                if (credentials.newPassword != 'undefined') {
                  const result = await new Promise((resolve, reject) => {
                    cognitoUser.completeNewPasswordChallenge(
                      credentials.newPassword,
                      {},
                      {
                        onSuccess: function (result) {
                          const data = {
                            id: result.getIdToken().payload.sub,
                            name: result.getIdToken().payload[
                              'cognito:username'
                            ],
                            email: result.getIdToken().payload.email,
                            group:
                              result.getIdToken().payload['cognito:groups'],
                            estudio:
                              result.getIdToken().payload['custom:estudio'],
                            tipoUsuario:
                              result.getIdToken().payload['custom:tipoUsuario'],
                          };
                          resolve(data);
                        },
                        onFailure: function (err) {
                          const data = {
                            error: err,
                          };
                          resolve(data);
                        },
                      }
                    );
                  });
                  if (result.error) {
                    reject(new Error(JSON.stringify(result.error)));
                  } else {
                    resolve(result);
                  }
                } else {
                  const data = {
                    mensaje: 'NewPasswordRequired',
                    newPasswordRequired: true,
                    userAttributes: userAttributes,
                  };
                  reject(new Error(JSON.stringify(data)));
                }
              },
            });
          });
          return result;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const name = user.email.split('@')[0];
        token.id = user.id;
        token.name = name;
        token.email = user.email;
        token.group = user.group;
        token.estudio = user.estudio;
        token.tipoUsuario = user.tipoUsuario;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.expired < Date.now()) {
        session.user.isExpired = true;
      } else {
        // que expiren en 1 minuto
        token.expired = Date.now() + 1000 * 60 * 30;
        session.user.isExpired = false;
      }
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.group = token.group;
      session.user.estudio = token.estudio;
      session.user.tipoUsuario = token.tipoUsuario;
      return { ...session, ...token };
    },
  },
  session: {
    jwt: true,
  },
};
