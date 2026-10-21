import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // LocalStorage එකේ ටෝකන් එක තිබේදැයි පරීක්ෂා කිරීම
  const token = localStorage.getItem('secureai_token');

  // ටෝකන් එක තිබේ නම් අදාළ Page එක (Outlet) පෙන්වයි, නැතහොත් /login වෙත Redirect කරයි
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;