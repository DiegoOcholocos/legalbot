export const formateoFecha = (fecha) => {
  return fecha?.toISOString().split('T')[0];
};
export const formateoFechaComplete = (fecha) => {
  return fecha?.toISOString();
};
