import { useAuth, hasAccess } from '../contexts/AuthContext';

const RBAC = ({ children, appRoles }) => {
  const { permissions } = useAuth();
  return hasAccess(appRoles, permissions) ? children : null;
};

export default RBAC;
