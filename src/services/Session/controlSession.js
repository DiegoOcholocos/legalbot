export const controlSessionExpired = ({ session }) => {
  if (session) {
    if (session.user.isExpired) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};
