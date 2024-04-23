export const validarEstudio = async ({ session }) => {
  let estudio = '';
  if (session.user.tipoUsuario === 'usuario_interno') {
    estudio =
      session.user.estudio === 'Estudio no asignado'
        ? 'Administrador'
        : session.user.estudio;
  } else if (session.user.tipoUsuario === 'Administrador') {
    estudio = 'Administrador';
  } else {
    estudio = session.user.estudio;
  }
  return estudio;
};
